import Fs from "fs";
import {
    BotText,
    UserText,
    ChoiceRequest,
    ChoiceResponse,
    StartChatSession,
    EndChatSession
} from "../messages";

type name = string;

/**
 * State definitions
 */
export type StateMachine = Map<name, State>;

export interface State {
    sendRequest?: SendRequest,
    matchResponse?: MatchResponse;
    next?: string,
}

export type SendRequest =
    | BotText
    | ChoiceRequest
    | StartChatSession
    | EndChatSession;

export type MatchResponse =
    | ChoiceResponse
    | UserText

/**
 * Load state machine from file
 */
export function loadStateMachine(filePath: string) {
    const jsonFile = Fs.readFileSync(filePath);
    const jsonObject = JSON.parse(jsonFile.toString());

    var state_machine: StateMachine = new Map<string, State>();
    for (var value in jsonObject) {
        state_machine.set(value, jsonObject[value])
    }

    return state_machine;
}
