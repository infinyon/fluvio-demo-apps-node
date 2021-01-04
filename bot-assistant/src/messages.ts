export type TimeStamp = string;
export type SID = string;

/* Message Header */
export interface Message {
    sid: SID;
    payload?: Payload;
    timestamp: TimeStamp;
}

export type Payload =
    | Request
    | Response;

export interface Request {
    kind: "Request",
    message: RequestMessage,
}

export interface Response {
    kind: "Response",
    message: ResponseMessage,
}

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

/* Build an initialization message */
export function buildInitMessage(sid: SID) {
    return <Message>{
        sid: sid,
        timestamp: getDateTime(),
    };
};

/* Append header to a request message */
export function buildRequest(sid: SID, message: RequestMessage) {
    return <Message>{
        sid: sid,
        payload: <Request>{ kind: "Request", message: message },
        timestamp: getDateTime(),
    };
};

/* Append header to a response message */
export function buildResponse(sid: SID, message: ResponseMessage) {
    return <Message>{
        sid: sid,
        payload: <Response>{ kind: "Response", message: message },
        timestamp: getDateTime(),
    };
};

/* Returns true if Request message, false otherwise */
export function isRequest(payload?: Payload) {
    return (payload) ? (payload.kind == "Request") : false;
}

/* Generate timestamp */
function getDateTime() {
    return new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, -1);
}