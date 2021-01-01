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

    public sendMessage(sid: SID, message: string) {
        const ws = this.sessions.get(sid);
        if (ws) {
            ws.send(message);
        }
    }

    public broadcastMessage(message: string) {
        for (let ws of this.sessions.values()) {
            ws.send(message);
        }
    }

    public show() {
        console.log("Sessions");
        console.table(this.sessions);
    }
}
