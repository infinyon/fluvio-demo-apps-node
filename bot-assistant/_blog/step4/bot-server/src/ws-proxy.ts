import WS from "ws";
import http from "http";
import crypto from 'crypto';

const COOKIE_NAME = "Fluvio-Bot-Assistant"

export class WsProxy {
    private static _wss: WS.Server;

    constructor() {
        WsProxy._wss = new WS.Server({ clientTracking: false, noServer: true });
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
            const session = req.headers.session;
            console.log(`session opened - ${session}`);

            ws.on("close", function () {
                console.log(`session closed - ${session}`);
            });

            ws.on("message", (clientMsg: string) => {
                console.log(`<== ${clientMsg}`);

                if (clientMsg == "ping") {
                    ws.send("pong");
                    console.log("==> pong");
                }
            });
        });
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