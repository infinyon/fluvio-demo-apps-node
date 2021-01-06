import {
    SID,
    Message,
    ResponseMessage,
    ChoiceResponse,
    UserText,
    buildRequest,
    isRequest
} from "../messages";
import { StateMachine, State } from "./state-machine";
import { SessionController } from "../proxy-service/session-controller";

export class WorkflowController {
    private stateMachine: StateMachine;
    private sessionController: SessionController;
    private initState: string;

    constructor(
        stateMachine: StateMachine,
    ) {
        this.stateMachine = stateMachine;
        this.initState = stateMachine.keys().next().value;

        this.sessionController = Object();
    }

    public init(sessionController: SessionController) {
        this.sessionController = sessionController;
    }

    private processNewConnection(sid: SID) {
        const nextStates = this.processNext(this.initState);
        this.sendMessages(sid, nextStates);
    }

    private processNextState(sid: SID, response: ResponseMessage) {
        const state: string = this.getState(response);
        const nextStates = this.processNext(state);
        this.sendMessages(sid, nextStates);
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

        var state = this.stateMachine.get(startState);
        while (state) {
            nextStates.push(state);

            const next = state.next || "";
            state = this.stateMachine.get(next);
            if (next.length > 0 && !state) {
                console.error(`Error: Cannot find next state: ${next}`);
            }
        }

        return nextStates;
    }

    private getChoiceResponseState(choiceResponse: ChoiceResponse) {
        for (let [key, state] of this.stateMachine.entries()) {
            if (state.matchResponse &&
                state.matchResponse.kind == choiceResponse.kind &&
                state.matchResponse.groupId == choiceResponse.groupId &&
                state.matchResponse.itemId == choiceResponse.itemId) {
                return key;
            }
        }

        console.error(`Error: cannot find choice ${JSON.stringify(choiceResponse)}`);
        return this.initState;
    }

    private getUserTextState(userText: UserText) {
        for (let [key, state] of this.stateMachine.entries()) {
            if (state.matchResponse &&
                state.matchResponse.kind == "UserText" &&
                state.matchResponse.sessionId == userText.sessionId) {
                return key;
            }
        }

        console.error(`Error: cannot find user session ${JSON.stringify(userText)}`);
        return this.initState;
    }

    private sendMessages(sid: SID, nextStates: State[]) {
        for (let idx = 0; idx < nextStates.length; idx++) {
            const state = nextStates[idx];
            if (state.sendRequest) {
                const message = buildRequest(sid, state.sendRequest);
                this.sessionController.processBotMessage(JSON.stringify(message));
            }
        }
    }

    public processProxyMessage(clientMessage: string) {
        const message: Message = JSON.parse(clientMessage);
        console.log(message);
        if (!isRequest(message.payload)) {
            const sid = message.sid;
            if (message.payload) {
                this.processNextState(
                    sid,
                    <ResponseMessage>message.payload.message
                );
            } else {
                this.processNewConnection(sid);
            }
        }
    }
}
