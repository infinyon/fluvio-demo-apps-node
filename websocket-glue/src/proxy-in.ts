import WS from "ws";
import http from "http";
import crypto from 'crypto';
import { WsProxyOut } from "./proxy-out";

const COOKIE_NAME = "CookieName"

export class WsProxyIn {
    private static wss: WS.Server;
    private static proxyOut: WsProxyOut

    constructor(proxyOut: WsProxyOut) {
        WsProxyIn.wss = new WS.Server({ clientTracking: false, noServer: true });
        WsProxyIn.proxyOut = proxyOut;
    }

    public init(server: http.Server) {
        this.onUpgrade(server);
        this.onConnection();
    }

    private onUpgrade(server: http.Server) {
        server.on("upgrade", function (request, socket, head) {
            const session = WsProxyIn.parseCookie(COOKIE_NAME, request.headers.cookie);
            if (session) {
                request.headers.session = session;
            }

            WsProxyIn.wss.handleUpgrade(request, socket, head, function (ws: WS) {
                WsProxyIn.wss.emit("connection", ws, request);
            });
        });
    }

    private onConnection() {
        WsProxyIn.wss.on("headers", (headers: Array<string>, req) => {
            const session = WsProxyIn.parseCookie(COOKIE_NAME, req.headers.cookie);
            if (!session) {
                let session = crypto.randomBytes(20).toString("hex");
                req.headers.session = session;

                headers.push("Set-Cookie: " + COOKIE_NAME + "=" + session);
            }
        });

        WsProxyIn.wss.on("connection", function (ws, req) {
            const session_hdr = req.headers.session;
            const sid = ((Array.isArray(session_hdr)) ? session_hdr[0] : session_hdr) || "";

            WsProxyIn.proxyOut.addSession(sid, ws);
            console.log(`session opened: ${sid}`);

            ws.on("close", function () {
                WsProxyIn.proxyOut.closeSession(sid);
                console.log(`session closed: ${sid}`);
            });

            ws.on("message", (clientMsg: string) => {
                console.log(`<== ${clientMsg} from ${sid}`);

                var response = "ok";
                if (clientMsg == "ping") {
                    response = "pong";
                }

                WsProxyIn.proxyOut.sendMessage(sid, response);
                console.log("==> ", response);
            });
        });
    }

    private static parseCookie(cookieName: string, cookie_hdr?: string) {
        if (cookie_hdr) {
            const cookiePair = cookie_hdr.split(/; */).map((c: string) => {
                const [key, v] = c.split('=', 2);
                return [key, decodeURIComponent(v)];
            }).find(res =>
                (res[0] == cookieName)
            );

            if (Array.isArray(cookiePair) && cookiePair.length > 1) {
                return cookiePair[1];
            }
        }
        return undefined;
    }
}