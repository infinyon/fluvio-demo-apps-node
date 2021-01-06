export type TimeStamp = string;
export type SID = string;

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

export type RequestMessage =
    | BotText
    | ChoiceRequest
    | StartChatSession
    | EndChatSession;

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

export interface ChoiceResponse {
    kind: "ChoiceResponse",
    groupId: string,
    itemId: string,
    content?: string,
}

export interface UserText {
    kind: "UserText",
    sessionId: string,
    content?: string,
}

export function buildInitMessage(sid: SID) {
    return <Message>{
        sid: sid,
        timestamp: getDateTime(),
    };
};

export function buildRequest(sid: SID, message: RequestMessage) {
    return <Message>{
        sid: sid,
        payload: <Request>{ kind: "Request", message: message },
        timestamp: getDateTime(),
    };
};

export function buildResponse(sid: SID, message: ResponseMessage) {
    return <Message>{
        sid: sid,
        payload: <Response>{ kind: "Response", message: message },
        timestamp: getDateTime(),
    };
};

export function isRequest(payload?: Payload) {
    return (payload) ? (payload.kind == "Request") : false;
}

function getDateTime() {
    return new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, -1);
}
