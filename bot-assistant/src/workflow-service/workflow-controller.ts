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
import { TopicProducer, PartitionConsumer, Offset } from "@fluvio/client";

export class WorkflowController {
    private stateMachine: StateMachine;
    private initState: string;
    private fluvioProducer: TopicProducer;
    private fluvioConsumer: PartitionConsumer;

    constructor(
        stateMachine: StateMachine,
        fluvioProducer: TopicProducer,
        fluvioConsumer: PartitionConsumer,
    ) {
        this.stateMachine = stateMachine;
        this.initState = stateMachine.keys().next().value;

        this.fluvioProducer = fluvioProducer;
        this.fluvioConsumer = fluvioConsumer;
    }

    public init() {
        this.fluvioConsumer.stream(Offset.FromEnd(), async (sessionMsg: string) => {
            await this.processProxyMessage(sessionMsg);
        });
    }

    private async processNewConnection(sid: SID) {
        const nextStates = this.processNext(this.initState);
        await this.sendMessages(sid, nextStates);
    }

    private async processNextState(sid: SID, response: ResponseMessage) {
        const state: string = this.getState(response);
        const nextStates = this.processNext(state);
        await this.sendMessages(sid, nextStates);
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

    private async sendMessages(sid: SID, nextStates: State[]) {
        for (let idx = 0; idx < nextStates.length; idx++) {
            const state = nextStates[idx];
            if (state.sendRequest) {
                const message = buildRequest(sid, state.sendRequest);
                await this.fluvioProducer.sendRecord(JSON.stringify(message), 0);
            }
        }
    }

    public async processProxyMessage(clientMessage: string) {
        const message: Message = JSON.parse(clientMessage);
        if (!isRequest(message.payload)) {
            const sid = message.sid;
            if (message.payload) {
                this.processNextState(
                    sid,
                    <ResponseMessage>message.payload.message
                );
            } else {
                await this.processNewConnection(sid);
            }
        }
    }
}