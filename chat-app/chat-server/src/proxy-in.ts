import crypto from 'crypto';
import WS from "ws";
import http from "http";
import { SessionController } from "./session-controller";
import { UserController } from "./user-controller";
import { buildError } from './user-messages';

const TOKEN_COOKIE = "Fluvio-Simple-Chat-Token";
const SESSION_COOKIE = "Fluvio-Simple-Session";

export class WsProxyIn {
    private static _wss: WS.Server;
    private static _sessionController: SessionController;
    private static _userController: UserController;

    constructor(sessionController: SessionController, userController: UserController) {
        WsProxyIn._wss = new WS.Server({ clientTracking: false, noServer: true });
        WsProxyIn._sessionController = sessionController;
        WsProxyIn._userController = userController;
    }

    public init(server: http.Server) {
        this.onUpgrade(server);
        this.onConnection();
    }

    private onUpgrade(server: http.Server) {
        server.on("upgrade", (request, socket, head) => {
            const session = WsProxyIn.parseCookie(SESSION_COOKIE, request.headers.cookie);
            if (session) {
                request.headers.session = session;
            }

            WsProxyIn._wss.handleUpgrade(request, socket, head, function (ws: WS) {
                WsProxyIn._wss.emit("connection", ws, request);
            });
        });
    }

    private onConnection() {
        WsProxyIn._wss.on("headers", (headers: Array<string>, req) => {
            const session = WsProxyIn.parseCookie(SESSION_COOKIE, req.headers.cookie);
            if (!session) {
                let session = crypto.randomBytes(16).toString("hex");
                req.headers.session = session;
                headers.push("Set-Cookie: " + SESSION_COOKIE + "=" + session);
            }
        });

        WsProxyIn._wss.on("connection", async (ws, req) => {
            const cookie = WsProxyIn.parseCookie(TOKEN_COOKIE, req.headers.cookie);
            if (!cookie) {
                ws.send(JSON.stringify(buildError('cannot find user')));
                ws.close();
                return;
            }

            const [userName, token] = cookie.split(",");
            if (!WsProxyIn._userController.getUser(userName)) {
                ws.send(JSON.stringify(buildError('not logged in')));
                ws.close();
                return;
            }

            const session_hdr = req.headers.session;
            const sid = ((Array.isArray(session_hdr)) ? session_hdr[0] : session_hdr) || "";
            await WsProxyIn._sessionController.sessionOpened(userName, token, sid, ws);

            ws.on("close", async () => {
                await WsProxyIn._sessionController.sessionClosed(userName, token, sid);
            });

            ws.on("message", async (userMsg: string) => {
                await WsProxyIn._sessionController.sessionMessage(sid, userMsg);
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
