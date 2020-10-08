import WS from "ws";
import url from "url";
import http from "http";
import Users from "../store/users";

type UserName = string;

class WebSocket {
  private _wss: WS.Server;
  private _connections: Map<UserName, WS>;

  constructor() {
    this._connections = new Map();
    this._wss = new WS.Server({ clientTracking: false, noServer: true });
  }

  public init(server: http.Server) {
    this.onUpgrade(server);
    this.onConnection();
  }

  public wss() {
    return this._wss;
  }

  public broadcast(message: string) {
    console.log(`broadcast ${message} to:`);
    for (const [name, ws] of this._connections.entries()) {
      console.log(`  ${name}`);
      ws.send(message);
    }
  }

  public toUserName(headers: http.IncomingHttpHeaders) {
    const userHeader = headers.userName;
    if (!userHeader) {
      console.log(`connection error ${JSON.stringify(headers)}`);
      return "";
    }

    const userName = Array.isArray(userHeader) ? userHeader[0] : userHeader;
    return userName || "";
  }

  private onUpgrade(server: http.Server) {
    server.on("upgrade", function (request, socket, head) {
      let token = (url.parse(request.url).pathname || "/").substring(1);
      let user = Users.getUserByToken(token);

      if (!user) {
        socket.destroy();
        console.log("invalid token - closing connection");
        return;
      }

      request.headers.userName = user.name;

      wsSingleton._wss.handleUpgrade(request, socket, head, function (ws: WS) {
        wsSingleton._wss.emit("connection", ws, request);
      });
    });
  }

  private onConnection() {
    this._wss.on("connection", function (ws, req) {
      const userName = wsSingleton.toUserName(req.headers);
      if (userName) {
        wsSingleton._connections.set(userName, ws);
        console.log(`ws: user ${userName} online`);

        ws.on("close", function () {
          wsSingleton._connections.delete(userName);
          console.log(`ws: user ${userName} offline`);
        });
      }
    });
  }

  public debugDump() {
    console.table(this._connections, ["name", "ws"]);
  }
}

const wsSingleton = new WebSocket();
Object.freeze(wsSingleton);

export default wsSingleton;
