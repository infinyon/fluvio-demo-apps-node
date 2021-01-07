import { Server } from "http";
import { WsProxyIn } from "./proxy-service/proxy-in";
import { WsProxyOut } from "./proxy-service/proxy-out";
import { StateMachine, loadStateMachine } from "./workflow-service/state-machine";
import { WorkflowController } from "./workflow-service/workflow-controller";
import { SessionController } from "./proxy-service/session-controller";

export const initBotAssistant = (server: Server) => {

    const wsProxyOut = new WsProxyOut();
    const sessionController = new SessionController(wsProxyOut);
    const wsProxyIn = new WsProxyIn(sessionController);

    let filePath = getFileName();
    const stateMachine: StateMachine = loadStateMachine(filePath);
    const workflowController = new WorkflowController(stateMachine);

    sessionController.init(workflowController);
    workflowController.init(sessionController);

    wsProxyIn.init(server);
};

const getFileName = () => {
    if (process.argv.length != 3) {
        console.log("Usage: node bot-assistant.js <state-machine.json>");
        process.exit(1);
    }
    return process.argv[2];
}