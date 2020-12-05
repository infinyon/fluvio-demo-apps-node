import http from "http";
import express from "express";
import { WsProxy } from "./ws-proxy";
import { StateMachine, loadStateMachine } from "./state-machine";

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

    // Initialize state machine
    let filePath = getFileName();
    const stateMachine: StateMachine = loadStateMachine(filePath);
    console.log(stateMachine);
};

// read state machine file from command line
function getFileName() {
    if (process.argv.length != 3) {
        console.log("Usage: node bot-server.js <state-machine.json>");
        process.exit(1);
    }
    return process.argv[2];
}

// Start Server
startServer();