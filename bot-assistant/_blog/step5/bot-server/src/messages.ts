/* Request Messages */
export type RequestMessage =
    | BotText
    | ChoiceRequest
    | StartChatSession
    | EndChatSession;

/* Response Messages */
export type ResponseMessage =
    | ChoiceResponse
    | UserText

export interface BotText {
    kind: "BotText",
    content: string
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

export interface UserText {
    kind: "UserText",
    sessionId: string,
    content?: string,
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
