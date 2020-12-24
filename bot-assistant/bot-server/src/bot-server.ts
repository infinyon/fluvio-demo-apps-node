import http from "http";
import express from "express";
import Fluvio from '@fluvio/client';
import { WsProxyIn } from "./proxy-service/proxy-in";
import { WsProxyOut } from "./proxy-service/proxy-out";
import { StateMachine, loadStateMachine } from "./workflow-service/state-machine";
import { WorkflowController } from "./workflow-service/workflow-controller";
import { SessionController } from "./proxy-service/session-controller";

const PORT = 9998;
const BOT_ASSIST_MESSAGES = "bot-assist-messages";

// Exit on exceptions
process.on("uncaughtException", (e) => { console.log(e); process.exit(1); });
process.on("unhandledRejection", (e) => { console.log(e); process.exit(1); });

// Provision Bot Assistant server
const startServer = async () => {

    // Fluvio: connect, check topic, and create producer/consumer
    const fluvio = await Fluvio.connect();
    await checkTopic(fluvio);
    const fluvioProducer = await fluvio.topicProducer(BOT_ASSIST_MESSAGES);
    const fluvioConsumer = await fluvio.partitionConsumer(BOT_ASSIST_MESSAGES, 0);

    // Create proxy service
    const wsProxyOut = new WsProxyOut();
    const sessionController = new SessionController(wsProxyOut, fluvioProducer, fluvioConsumer);
    const wsProxyIn = new WsProxyIn(sessionController);

    // Create workflow service
    let filePath = getFileName();
    const stateMachine: StateMachine = loadStateMachine(filePath);
    const workflowController = new WorkflowController(stateMachine, fluvioProducer, fluvioConsumer);

    // Initialize service controllers
    await sessionController.init();
    await workflowController.init();

    // Create server
    const app = express();
    const Server = http.createServer(app);
    wsProxyIn.init(Server);

    // Start server
    Server.listen(PORT, () => {
        console.log(
            `started bot assistant server at http://localhost:${PORT}...`
        );
    });
};

// Ensure topic exits
const checkTopic = async (fluvio: Fluvio) => {
    const admin = await fluvio.admin();
    if (!await admin.findTopic(BOT_ASSIST_MESSAGES)) {
        console.error("Error: Fluvio topic not found! Run `npm run setup`");
        process.exit(1);
    }
}

// Read state machine file from command line
const getFileName = () => {
    if (process.argv.length != 3) {
        console.log("Usage: node bot-server.js <state-machine.json>");
        process.exit(1);
    }
    return process.argv[2];
}

// Start Server
startServer();