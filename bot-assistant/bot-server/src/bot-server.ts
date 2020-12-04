import http from "http";
import express from "express";
import { WsProxy } from "./proxy-service/ws-proxy";
import { DataStreams } from "./proxy-service/data-streams";
import { StateMachine, loadStateMachine } from "./workflow-service/state-machine";
import { WorkflowController } from "./workflow-service/workflow-controller";

const PORT = 9998;
const DATA_STREAM_TOPIC = "bot-assist-messages";

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

    // Initialize data streaming
    const dataStreams = new DataStreams();
    await dataStreams.init(DATA_STREAM_TOPIC, wsProxy);

    // Initialize workflow service
    let filePath = getFileName();
    const stateMachine: StateMachine = loadStateMachine(filePath);
    const workflowController = new WorkflowController();
    await workflowController.init(DATA_STREAM_TOPIC, stateMachine);
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
