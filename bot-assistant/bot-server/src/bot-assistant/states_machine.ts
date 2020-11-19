import Fs from "fs";
import { Payload } from "../messages";

/**
 * State definitions
 */
export type StateMachine = Map<string, State>;

export interface State {
    sendRequest?: Payload,
    onMatchResponse?: OnMatchResponse;
    next?: string,
}

export type OnMatchResponse =
    | ChoiceResponseNext
    | UserTextNext

export interface ChoiceResponseNext {
    kind: "ChoiceResponse",
    groupId: string,
    itemId: string,
}

export interface UserTextNext {
    kind: "UserText",
    sessionId: string,
}

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
