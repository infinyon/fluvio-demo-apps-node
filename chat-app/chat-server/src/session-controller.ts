import WS from "ws";
import { TopicProducer, PartitionConsumer, Record } from "@fluvio/client";
import { FromEnd } from "./fluvio-util";
import { WsProxyOut } from "./proxy-out";
import {
    buildUserOnline,
    buildUserOffline,
    buildWsOnlineUsers,
    buildFluvioSessionStarted,
    buildFluvioSessionEnded,
} from "./session-messages";
import { parseWsChatMessage, buildFluvioChatMessage } from "./chat-messages";
import { UserName, SID, Token, parseMessage } from "./user-messages";

interface Session {
    sid: SID,
    user: UserName,
    token: Token,
}

class Sessions {
    private sessions: Array<Session>;

    constructor() {
        this.sessions = new Array();
    }

    userCount(user: UserName) {
        return this.sessions.reduce((acc, cur) => cur.user === user ? ++acc : acc, 0);
    }

    byUser(user: UserName) {
        return this.sessions.filter((session) => session.user === user);
    }

    byToken(token: Token) {
        return this.sessions.filter((session) => session.token === token);
    }

    getUsers() {
        var users = new Map();
        this.sessions.forEach((session) => {
            users.set(session.user, "");
        });
        return Array.from(users.keys());
    }

    addSession(session: Session) {
        this.sessions.push(session);
    }

    removeSession(session: Session) {
        this.sessions.splice(this.sessions.findIndex((s) => {
            return (
                s.sid == session.sid &&
                s.user === session.user &&
                s.token == session.token);
        }), 1);
    }

    removeUser(user: UserName) {
        this.sessions = this.sessions.filter(session => session.user !== user);
    }

    removeToken(token: Token) {
        this.sessions = this.sessions.filter(session => session.token !== token);
    }
}

export class SessionController {
    private userConsumer: PartitionConsumer;
    private sessionProducer: TopicProducer;
    private messageProducer: TopicProducer;
    private proxyOut: WsProxyOut;
    private sessions: Sessions;

    constructor(
        proxyOut: WsProxyOut,
        userConsumer: PartitionConsumer,
        sessionProducer: TopicProducer,
        messageProducer: TopicProducer,
    ) {
        this.sessions = new Sessions();

        this.proxyOut = proxyOut;
        this.userConsumer = userConsumer;
        this.sessionProducer = sessionProducer;
        this.messageProducer = messageProducer;
    }

    // Public APIs

    public async init() {
        this.userConsumer.stream(FromEnd, (userMsg: Record) => {
            this.processUserMessage(userMsg.valueString());
        });
    }

    public async sessionOpened(user: UserName, token: Token, sid: SID, ws: WS) {
        console.log(`start session - ${user}, ${sid}`);

        this.proxyOut.addSession(sid, ws);
        this.sessions.addSession({ sid: sid, user: user, token: token });

        await this.NotifySessionStarted(user, sid);

        if (this.sessions.userCount(user) == 1) {
            await this.NotifyUserOnline(user, sid);
        }

        this.sendOnlineUsers(sid);
    }

    public async sessionClosed(user: UserName, token: Token, sid: SID) {
        console.log(`end session - ${user}, ${sid}`);

        this.proxyOut.closeSession(sid);
        await this.NotifySessionEnded(user, sid);
        this.sessions.removeSession({ sid: sid, user: user, token: token });

        if (this.sessions.userCount(user) == 0) {
            await this.NotifyUserOffline(user, sid);
        }
    }

    public async sessionMessage(sid: SID, message: string) {
        console.log(`${sid} <== ${message}`);

        const chatMessage = parseWsChatMessage(message);
        if (chatMessage) {
            const fluvioMessage = buildFluvioChatMessage(sid, chatMessage);
            await this.messageProducer.sendRecord(JSON.stringify(fluvioMessage), 0);
        }
    }

    // Private APIs

    private async NotifyUserOnline(user: UserName, sid: SID) {
        const sessionMessage = buildUserOnline(user);
        this.proxyOut.broadcastMessage(JSON.stringify(sessionMessage));

        await this.sessionProducer.sendRecord(JSON.stringify(sessionMessage), 0);
    }

    private async NotifyUserOffline(user: UserName, sid: SID) {
        const sessionMessage = buildUserOffline(user);
        this.proxyOut.broadcastMessage(JSON.stringify(sessionMessage));

        await this.sessionProducer.sendRecord(JSON.stringify(sessionMessage), 0);
    }

    private sendOnlineUsers(sid: SID) {
        const sessionMessage = buildWsOnlineUsers(this.sessions.getUsers());
        this.proxyOut.sendMessage(sid, JSON.stringify(sessionMessage));
    }

    private async NotifySessionStarted(user: UserName, sid: SID) {
        const sessionMessage = buildFluvioSessionStarted(user, sid);
        await this.sessionProducer.sendRecord(JSON.stringify(sessionMessage), 0);
    }

    private async NotifySessionEnded(user: UserName, sid: SID) {
        const sessionMessage = buildFluvioSessionEnded(user, sid);
        await this.sessionProducer.sendRecord(JSON.stringify(sessionMessage), 0);
    }

    private removeUser(user: UserName) {
        for (let session of this.sessions.byUser(user)) {
            this.proxyOut.closeSession(session.sid);
        }
    }

    private removeToken(token: Token) {
        for (let session of this.sessions.byToken(token)) {
            this.proxyOut.closeSession(session.sid);
        }
    }

    private processUserMessage(msgObj: string) {
        const message = parseMessage(msgObj);

        switch (message.kind) {
            case "RemoveUser":
                this.removeUser(message.content.user);
                break;

            case "RemoveToken":
                this.removeToken(message.content.token);
                break;
        }
    }
}
