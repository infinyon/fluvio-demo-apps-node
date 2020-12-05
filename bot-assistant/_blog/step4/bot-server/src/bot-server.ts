import http from "http";
import express from "express";
import { WsProxy } from "./ws-proxy";

const PORT = 9998;

// Provision Bot Assistant server
const startServer = async () => {
    const app = express();
    const Server = http.createServer(app);

    // Attach websocket to server
    const wsProxy = new WsProxy();
    wsProxy.init(Server);

    // Start server
    Server.listen(PORT, () => {
        console.log(
            `started bot assistant server at http://localhost:${PORT}...`
        );
    });
};

// Start Server
startServer();