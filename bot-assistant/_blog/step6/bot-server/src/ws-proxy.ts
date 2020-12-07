import WS from "ws";
import http from "http";
import crypto from 'crypto';
import { SID } from './messages';
import { EventEmitter } from "events";

const COOKIE_NAME = "Fluvio-Bot-Assistant"

export class WsProxy {
    private static _wss: WS.Server;
    private static _sessions: Map<SID, WS>;

    constructor() {
        WsProxy._wss = new WS.Server({ clientTracking: false, noServer: true });
        WsProxy._sessions = new Map();
    }

    public init(server: http.Server) {
        this.onUpgrade(server);
        this.onConnection();
    }

    private onUpgrade(server: http.Server) {
        server.on("upgrade", function (request, socket, head) {
            const session = WsProxy.parseSessionFromCookie(request.headers.cookie);
            if (session) {
                request.headers.session = session;
            }

            WsProxy._wss.handleUpgrade(request, socket, head, function (ws: WS) {
                WsProxy._wss.emit("connection", ws, request);
            });
        });
    }

    private onConnection() {

        WsProxy._wss.on("headers", function (headers: Array<string>, req) {
            const session = WsProxy.parseSessionFromCookie(req.headers.cookie);

            if (!session) {
                let session = crypto.randomBytes(20).toString("hex");
                req.headers.session = session;

                headers.push("Set-Cookie: " + COOKIE_NAME + "=" + session);
            }
        });

        WsProxy._wss.on("connection", function (ws, req) {
            const session_hdr = req.headers.session;
            const session = ((Array.isArray(session_hdr)) ? session_hdr[0] : session_hdr) || "";
            console.log(`session opened - ${session}`);

            WsProxy._sessions.set(session, ws);

            wsProxyEvents.emit(wsProxyEvents.CONNECTION, session);

            ws.on("close", function () {
                console.log(`session closed - ${session}`);

                WsProxy._sessions.delete(session);
            });

            ws.on("message", (clientMsg: string) => {
                console.log(`<== ${clientMsg}`);

                wsProxyEvents.emit(wsProxyEvents.MESSAGE, session, clientMsg);
            });
        });
    }

    // Send message to client
    public sendMessage(session: string, clientMsg: string) {
        const ws = WsProxy._sessions.get(session);
        if (!ws) {
            return;
        }

        console.log(`==> ${clientMsg}`);
        ws.send(clientMsg);
    }

    // Parse session from cookie
    private static parseSessionFromCookie(cookie?: string) {
        if (cookie) {
            const cookiePair = cookie.split(/; */).map((c: string) => {
                const [key, v] = c.split('=', 2);
                return [key, decodeURIComponent(v)];
            }).find(res =>
                (res[0] == COOKIE_NAME)
            );

            if (Array.isArray(cookiePair) && cookiePair.length > 1) {
                return cookiePair[1];
            }
        }
    }
}

/* WebSocket Proxy Event Emitter */
class WsProxyEvents extends EventEmitter {
    readonly CONNECTION = 'WebSocket-Connection';
    readonly MESSAGE = 'WebSocket-Message';

    private static _instance = new WsProxyEvents();
    static get instance() {
        return this._instance;
    }
}
export const wsProxyEvents = WsProxyEvents.instance;