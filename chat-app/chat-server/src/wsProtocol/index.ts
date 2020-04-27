import { KV, getDateTime } from "../common/utils";

interface WsMessage {
    metadata: WsMetadata,
    operation: String,
    data: KV,
}

interface WsMetadata {
    kind: WsKind,
    timestamp: string,
}

enum WsKind {
    User = "user",
    Chat = "chat",
}

export const enum UserOperation {
    // From Client
    GetUsers = "getUsers",

    // Unicast Client
    AllUsers = "allUsers",

    // Broadcast Clients
    AddUser = "addUser",
    RemoveUser = "removeUser",
    Online = "online",
    Offline = "offline",
}

export const enum ChatOperation {
    // From Client
    AddMessage = "addMessage",

    // Unicast Client
    AllMessages = "allMessages",

    // Broadcast Clients
    NewMessage = "newMessage",
}


export const buildWsUserMessage = (operation: string, data: KV) => {
    return encodeWsMessage(WsKind.User, operation, data);
}

export const buildWsChatMessage = (operation: string, data: KV) => {
    return encodeWsMessage(WsKind.Chat, operation, data);
}

export const getWsUserMessage = (msgObj: string) => {
    let msg = parseWsMessage(msgObj);
    if (msg && msg.metadata.kind == WsKind.User) {
        return {
            operation: msg.operation,
            data: msg.data,
        }
    }
    return undefined;
}

export const getWsChatMessage = (msgObj: string) => {
    let msg = parseWsMessage(msgObj);
    if (msg && msg.metadata.kind == WsKind.Chat) {
        return {
            operation: msg.operation,
            data: msg.data,
        }
    }
    return undefined;
}

const encodeWsMessage = (
    kind: WsKind,
    operation: string,
    data: KV
) => {
    return JSON.stringify(
        <WsMessage>{
            metadata: {
                kind: kind,
                timestamp: getDateTime(),
            },
            operation: operation,
            data: data,
        }
    );
}

const parseWsMessage = (msgObj: string) => {
    try {
        return <WsMessage>JSON.parse(msgObj);
    } catch (e) {
        console.error(`WsMessage parse error: ${e}`);
        return undefined;
    }
}