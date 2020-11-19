
import { botAssistantEvents } from './bot_assistant';
import { SID, Payload, ChoiceResponse, UserText } from "../messages";
import { StateMachine, loadStateMachine } from "./states_machine";

const DEFAULT_STATE = "greetings";

class BotWorkflow {
    private static _stateMachine: StateMachine;

    init(fileName: string) {
        BotWorkflow._stateMachine = loadStateMachine(fileName);
    }

    nextMessages(sid: SID, payload?: Payload) {
        var state: string = this.getState(payload);
        this.processNext(sid, state);
    }

    getState(payload?: Payload) {
        if (payload) {
            switch (payload.kind) {
                case "ChoiceResponse": {
                    return this.getChoiceResponseState(payload);
                }
                case "UserText": {
                    return this.getUserTextState(payload);
                }
            }
            console.log(`Error: unknown state ${payload.kind}`);
        }
        return DEFAULT_STATE;
    }

    processNext(sid: SID, next: string) {
        var state = BotWorkflow._stateMachine.get(next);

        while (state) {
            if (state && state.sendRequest) {
                botAssistantEvents.emit(
                    botAssistantEvents.BOT_MESSAGE,
                    sid,
                    state.sendRequest
                );
            }

            const next = state.next;
            state = BotWorkflow._stateMachine.get(state.next || "");
            if (next && !state) {
                console.error(`Error: Cannot find next state: ${next}`);
            }
        }
    }

    getChoiceResponseState(choiceResponse: ChoiceResponse) {
        for (let [key, state] of BotWorkflow._stateMachine.entries()) {
            if (state.onMatchResponse &&
                state.onMatchResponse.kind == choiceResponse.kind &&
                state.onMatchResponse.groupId == choiceResponse.groupId &&
                state.onMatchResponse.itemId == choiceResponse.itemId) {
                return key;
            }
        }

        console.error(`Error: cannot find choice ${JSON.stringify(choiceResponse)}`);
        return DEFAULT_STATE;
    }

    getUserTextState(userText: UserText) {
        for (let [key, state] of BotWorkflow._stateMachine.entries()) {
            if (state.onMatchResponse &&
                state.onMatchResponse.kind == "UserText" &&
                state.onMatchResponse.sessionId == userText.sessionId) {
                return key;
            }
        }

        console.error(`Error: cannot find user session ${JSON.stringify(userText)}`);
        return DEFAULT_STATE;
    }
}

// Bot Workflow Singleton
const BWS = new BotWorkflow();
Object.freeze(BWS);

export default BWS;