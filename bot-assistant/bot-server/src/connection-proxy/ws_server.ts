import WS from "ws";
import http from "http";
import crypto from 'crypto';
import Sessions from "./ws_sessions";

const COOKIE_NAME = "Fluvio-Chat-Assistant"

class WsServer {
  private _wss: WS.Server;

  constructor() {
    this._wss = new WS.Server({ clientTracking: false, noServer: true });
  }

  public init(server: http.Server) {
    this.onUpgrade(server);
    this.onConnection();
  }

  private onUpgrade(server: http.Server) {
    server.on("upgrade", function (request, socket, head) {

      // add session to headers
      const session = parseSessionFromCookie(request.headers.cookie);
      if (session) {
        request.headers.session = session;
      }

      // emit connection
      wsSingleton._wss.handleUpgrade(request, socket, head, function (ws: WS) {
        wsSingleton._wss.emit("connection", ws, request);
      });
    });
  }

  private onConnection() {

    // generate unique session and set to cookie (if doesn't exist)
    this._wss.on("headers", function (headers: Array<string>, req) {
      const session = parseSessionFromCookie(req.headers.cookie);

      if (!session) {
        let session = crypto.randomBytes(20).toString("hex");
        req.headers.session = session;

        // send session cookie to client
        headers.push("Set-Cookie: " + COOKIE_NAME + "=" + session);
      }

    });

    // process connection
    this._wss.on("connection", function (ws, req) {
      const session = req.headers.session;

      if (!session || Array.isArray(session)) {
        console.log(`Error! Cannot open connection - invalid session: ${session} - ignored`);
        return;
      }
      Sessions.add(session, ws);

      ws.on("close", function () {
        Sessions.remove(session);
      });

      ws.on("message", (msgObj: string) => {
        Sessions.received_msg(session, msgObj);
      });

    });
  }

}

// Parse session from cookie
function parseSessionFromCookie(cookie?: string) {
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

// Initialize Singleton
const wsSingleton = new WsServer();
Object.freeze(wsSingleton);

export default wsSingleton;
