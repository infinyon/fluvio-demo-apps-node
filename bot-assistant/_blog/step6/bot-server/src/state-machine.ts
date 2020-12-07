import Fs from "fs";
import { RequestMessage, ResponseMessage } from "./messages";

type name = string;

/* State Machine definition */
export type StateMachine = Map<name, State>;

export interface State {
    sendRequest?: RequestMessage,
    matchResponse?: ResponseMessage;
    next?: string,
}

/* Load state machine from JSON file */
export function loadStateMachine(filePath: string) {
    const jsonFile = Fs.readFileSync(filePath);
    const jsonObject = JSON.parse(jsonFile.toString());

    var state_machine: StateMachine = new Map<string, State>();
    for (var value in jsonObject) {
        state_machine.set(value, jsonObject[value])
    }

    return state_machine;
}
