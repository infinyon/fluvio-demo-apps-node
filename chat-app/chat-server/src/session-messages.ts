export type UserName = string;
export type SID = string;
export type Token = string;

// Session Messages
export interface IUserOnline {
    kind: "UserOnline";
    content: {
        user: UserName;
    };
}

export interface IUserOffline {
    kind: "UserOffline";
    content: {
        user: UserName;
    };
}

// Websocket Messages
export interface IWsOnlineUsers {
    kind: "OnlineUsers";
    content: {
        users: Array<UserName>;
    };
}

// Fluvio Messages
export interface IFluvioSessionStarted {
    kind: "Started",
    content: {
        user: UserName,
        token: Token
        sid: SID,
    }
}

export interface IFluvioSessionEnded {
    kind: "Ended",
    content: {
        user: UserName,
        token: Token
        sid: SID,
    }
}

// Session APIs
export function buildUserOnline(user: UserName) {
    return <IUserOnline>{
        kind: "UserOnline",
        content: {
            user: user,
        }
    };
}

export function buildUserOffline(user: UserName) {
    return <IUserOffline>{
        kind: "UserOffline",
        content: {
            user: user,
        }
    };
}

// Websocket APIs
export function buildWsOnlineUsers(users: Array<UserName>) {
    return <IWsOnlineUsers>{
        kind: "OnlineUsers",
        content: {
            users: users,
        }
    };
}

// Fluvio APIs
export function buildFluvioSessionStarted(user: UserName, sid: SID) {
    return <IFluvioSessionStarted>{
        kind: "Started",
        content: {
            user: user,
            sid: sid,
        }
    };
}

export function buildFluvioSessionEnded(user: UserName, sid: SID) {
    return <IFluvioSessionEnded>{
        kind: "Ended",
        content: {
            user: user,
            sid: sid,
        }
    };
}

export function parseFluvioSession(fluvioMessage: string) {
    return JSON.parse(fluvioMessage);
}
