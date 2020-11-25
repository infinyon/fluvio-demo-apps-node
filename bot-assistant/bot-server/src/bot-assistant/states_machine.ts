import Fs from "fs";

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

export interface BotText {
    kind: "BotText",
    content: string
}

export interface OperatorText {
    kind: "OperatorText",
    name: string,
    content: string
}

export interface UserText {
    kind: "UserText",
    sessionId: string,
    content?: string,
}

export interface ChoiceRequest {
    kind: "ChoiceRequest",
    question: string,
    groupId: string,
    choices: Array<Choice>,
}

export interface Choice {
    itemId: string,
    content: string
}

export interface ChoiceResponse {
    kind: "ChoiceResponse",
    groupId: string,
    itemId: string,
    content?: string,
}

export interface StartChatSession {
    kind: "StartChatSession",
    sessionId: string,
    chatPrompt?: string,
    chatText?: string,
}

export interface EndChatSession {
    kind: "EndChatSession",
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
