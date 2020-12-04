import WS from "ws";
import http from "http";

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
            WsProxy._wss.handleUpgrade(request, socket, head, function (ws: WS) {
                WsProxy._wss.emit("connection", ws, request);
            });
        });
    }

    private onConnection() {
        WsProxy._wss.on("connection", function (ws, req) {
            console.log("session opened");

            ws.on("close", function () {
                console.log("session closed");
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
}