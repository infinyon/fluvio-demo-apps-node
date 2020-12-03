import {
    SID,
    ResponseMessage,
    ChoiceResponse,
    UserText,
    buildRequest,
    isRequest
} from "../messages";
import { StateMachine, State } from "./state-machine";
import { FluvioLib, fluvioEvents } from "./fluvio-lib";

export class WorkflowController {
    private _fluvio: FluvioLib;
    private static _stateMachine: StateMachine;
    private static _initState: string;

    constructor() {
        this._fluvio = new FluvioLib();
    }

    async init(topicName: string, stateMachine: StateMachine) {
        this.listenForEvents();

        await this._fluvio.init(topicName);
        await this._fluvio.startConsumerStream();

        WorkflowController._stateMachine = stateMachine;
        WorkflowController._initState = stateMachine.keys().next().value;
    }

    async processNewConnection(sid: SID) {
        const nextStates = this.getInit();
        await this.sendMessages(sid, nextStates);
    }

    async processClientMessage(sid: SID, response: ResponseMessage) {
        const nextStates = this.getNext(response);
        await this.sendMessages(sid, nextStates);
    }

    private getInit() {
        return this.processNext(WorkflowController._initState);
    }

    private getNext(response: ResponseMessage) {
        var state: string = this.getState(response);

        return this.processNext(state);
    }

    private getState(response: ResponseMessage) {
        switch (response.kind) {
            case "ChoiceResponse": {
                return this.getChoiceResponseState(response);
            }
            case "UserText": {
                return this.getUserTextState(response);
            }
        }
    }

    private processNext(startState: string) {
        var nextStates: State[] = [];

        var state = WorkflowController._stateMachine.get(startState);
        while (state) {
            nextStates.push(state);

            const next = state.next || "";
            state = WorkflowController._stateMachine.get(next);
            if (next.length > 0 && !state) {
                console.error(`Error: Cannot find next state: ${next}`);
            }
        }

        return nextStates;
    }

    private getChoiceResponseState(choiceResponse: ChoiceResponse) {
        for (let [key, state] of WorkflowController._stateMachine.entries()) {
            if (state.matchResponse &&
                state.matchResponse.kind == choiceResponse.kind &&
                state.matchResponse.groupId == choiceResponse.groupId &&
                state.matchResponse.itemId == choiceResponse.itemId) {
                return key;
            }
        }

        console.error(`Error: cannot find choice ${JSON.stringify(choiceResponse)}`);
        return WorkflowController._initState;
    }

    private getUserTextState(userText: UserText) {
        for (let [key, state] of WorkflowController._stateMachine.entries()) {
            if (state.matchResponse &&
                state.matchResponse.kind == "UserText" &&
                state.matchResponse.sessionId == userText.sessionId) {
                return key;
            }
        }

        console.error(`Error: cannot find user session ${JSON.stringify(userText)}`);
        return WorkflowController._initState;
    }

    private async sendMessages(sid: SID, nextStates: State[]) {
        for (let idx = 0; idx < nextStates.length; idx++) {
            const state = nextStates[idx];
            if (state.sendRequest) {
                const message = buildRequest(sid, state.sendRequest);
                await this._fluvio.produceMessage(JSON.stringify(message));
            }
        }
    }
    private listenForEvents() {
        fluvioEvents.on(
            fluvioEvents.FLUVIO_MESSAGE,
            async (msgObj: string) => {
                const message = JSON.parse(msgObj);
                if (!isRequest(message.payload)) {
                    const sid = message.sid;

                    if (message.payload) {
                        await this.processClientMessage(sid, message.payload.message);
                    } else {
                        await this.processNewConnection(sid);
                    }
                }
            }
        );
    }
}