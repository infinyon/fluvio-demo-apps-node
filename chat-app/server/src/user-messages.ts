export type UserName = string;
export type SID = string;
export type Token = string;

// User
export interface IUser {
    user: UserName;
    colorCode: string;
    tokens: Array<Token>;
}

export interface IAddUser {
    kind: "AddUser";
    content: {
        user: UserName;
        colorCode: string;
    };
}

export interface IRemoveUser {
    kind: "RemoveUser";
    content: {
        user: UserName;
    };
}

// Websocket Messages
export interface IWsAllUsers {
    kind: "AllUsers";
    content: Array<{
        user: UserName;
        colorCode: string;
    }>;
}

// Fluvio Messages
export interface IFluvioAddToken {
    kind: "AddToken";
    content: {
        user: UserName;
        token: string;
    };
}

export interface IFluvioRemoveToken {
    kind: "RemoveToken";
    content: {
        user: UserName;
        token: string;
    };
}

// Error Message
export interface IError {
    kind: "Error",
    reason: string,
}

// Common APIs
export function buildAddUser(user: IUser) {
    return <IAddUser>{
        kind: "AddUser",
        content: {
            user: user.user,
            colorCode: user.colorCode,
        }
    };
}

export function buildRemoveUser(user: IUser) {
    return <IRemoveUser>{
        kind: "RemoveUser",
        content: {
            user: user.user,
        }
    };
}

// Websocket APIs
export function buildWsAllUsers(user: Array<IUser>) {
    const content = user.map((user) => {
        return {
            user: user.user,
            colorCode: user.colorCode,
        };
    });

    return <IWsAllUsers>{
        kind: "AllUsers",
        content: content,
    };
}

// Fluvio APIs
export function buildFluvioAddToken(user: UserName, token: Token) {
    return <IFluvioAddToken>{
        kind: "AddToken",
        content: {
            user: user,
            token: token,
        }
    };
}

export function buildFluvioRemoveToken(user: UserName, token: Token) {
    return <IFluvioRemoveToken>{
        kind: "RemoveToken",
        content: {
            user: user,
            token: token,
        }
    };
}

export function parseMessage(message: string) {
    return JSON.parse(message);
}

// Error API
export function buildError(reason: string) {
    return <IError>{
        kind: "Error",
        reason: reason,
    };
}