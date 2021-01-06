import { Server } from "http";
import { WsProxyIn } from "./proxy-service/proxy-in";
import { WsProxyOut } from "./proxy-service/proxy-out";
import { StateMachine, loadStateMachine } from "./workflow-service/state-machine";
import { WorkflowController } from "./workflow-service/workflow-controller";
import { SessionController } from "./proxy-service/session-controller";

// Provision Bot Assistant server
export const initBotAssistant = (server: Server) => {

    // Create proxy service
    const wsProxyOut = new WsProxyOut();
    const sessionController = new SessionController(wsProxyOut);
    const wsProxyIn = new WsProxyIn(sessionController);

    // Create workflow service
    let filePath = getFileName();
    const stateMachine: StateMachine = loadStateMachine(filePath);
    const workflowController = new WorkflowController(stateMachine);

    // Initialize service controllers
    sessionController.init(workflowController);
    workflowController.init(sessionController);

    // Create server
    wsProxyIn.init(server);
};

// Read state machine file from command line
const getFileName = () => {
    if (process.argv.length != 3) {
        console.log("Usage: node bot-assistant.js <state-machine.json>");
        process.exit(1);
    }
    return process.argv[2];
}