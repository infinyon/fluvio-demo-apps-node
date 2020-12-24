import WS from "ws";
type SID = string;

export class WsProxyOut {
    private sessions: Map<SID, WS>;

    constructor() {
        this.sessions = new Map();
    }

    public addSession(sid: SID, ws: WS) {
        this.sessions.set(sid, ws);
    }

    public getSession(sid: SID) {
        this.sessions.get(sid);
    }

    public closeSession(sid: SID) {
        const ws = this.sessions.get(sid);
        if (ws) {
            ws.close();
        }
        this.sessions.delete(sid);
    }

    public broadcastMessage(message: string, sid?: SID) {
        for (let [session, ws] of this.sessions) {
            if (!sid || sid !== session) {
                ws.send(message);
            }
        }
    }

    public sendMessage(message: string, sid: SID) {
        const ws = this.sessions.get(sid);
        if (ws) {
            ws.send(message);
        }
    }

    public show() {
        console.log("Sessions");
        console.table(this.sessions);
    }
}
