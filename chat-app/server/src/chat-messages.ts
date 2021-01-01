export type UserName = string;
export type SID = string;

// Chat Message
export interface IChatMessage {
    user: UserName;
    message: string;
    timestamp: string;
}

// Fluvio Messages
export interface IFluvioChatMessage {
    sid: SID,
    message: IChatMessage,
}

// Websocket Messages
export interface IWsChatMessage {
    kind: "ChatMessage";
    content: IChatMessage;
}

export interface IWsChatMessages {
    kind: "ChatMessages",
    content: Array<IChatMessage>,
}

// Fluvio APIs
export function buildFluvioChatMessage(sid: SID, chatMessage: IChatMessage) {
    return <IFluvioChatMessage>{
        sid: sid,
        message: chatMessage,
    };
}

export function parseFluvioChatMessage(fluvioMessage: string) {
    return <IFluvioChatMessage>JSON.parse(fluvioMessage);
}

// Websocket APIs
export function buildWsChatMessage(chatMessage: IChatMessage) {
    return <IWsChatMessage>{
        kind: "ChatMessage",
        content: chatMessage,
    };
}

export function parseWsChatMessage(wsMessage: string) {
    const message = JSON.parse(wsMessage);
    if (message.kind == "ChatMessage") {
        return <IChatMessage>message.content;
    }
    console.error(`Error: Invalid "ChatMessage"`, wsMessage);
    return undefined;
}

export function buildWsChatMessages(chatMessages: Array<IChatMessage>) {
    return <IWsChatMessages>{
        kind: "ChatMessages",
        content: chatMessages,
    };
}