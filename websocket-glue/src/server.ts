import http from "http";
import express from "express";
import path from "path";
import { WsProxyIn } from "./proxy-in";
import { WsProxyOut } from "./proxy-out";

const PORT = 9998;

const startServer = async () => {
    const app = express();
    const Server = http.createServer(app);
    const publicPath = path.join(__dirname, '..', 'public');
    const proxyOut = new WsProxyOut();
    const wsProxyIn = new WsProxyIn(proxyOut);

    wsProxyIn.init(Server);

    app.get('/', (req, res) => {
        res.sendFile(path.join(publicPath, 'index.html'));
    });
    app.use("/scripts", express.static(path.join(publicPath, 'scripts')));

    Server.listen(PORT, () => {
        console.log(
            `started websocket server at ws://localhost:${PORT}...`
        );
    });
};

startServer();