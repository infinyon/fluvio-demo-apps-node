import WS from "ws";
import { WsProxyOut } from "./proxy-out";
import {
    SID,
    Message,
    buildInitMessage,
    buildResponse,
    isRequest
} from "../messages";
import { WorkflowController } from "../workflow-service/workflow-controller";

type Messages = Array<Message>;

export class SessionController {
    private sessionMessages: Map<SID, Messages>;
    private proxyOut: WsProxyOut;
    private workflowController: WorkflowController;

    constructor(
        proxyOut: WsProxyOut,
    ) {
        this.sessionMessages = new Map();
        this.proxyOut = proxyOut;

        this.workflowController = Object();
    }

    public init(workflowController: WorkflowController) {
        this.workflowController = workflowController;

        this.show();
    }

    public sessionOpened(sid: SID, ws: WS) {
        console.log(`start session - ${sid}`);

        this.proxyOut.addSession(sid, ws);

        const messages = this.sessionMessages.get(sid);
        if (messages) {
            this.sendMessagesToClient(messages);
        } else {
            const message = buildInitMessage(sid);
            this.workflowController.processProxyMessage(JSON.stringify(message));
        }
    }

    public sessionClosed(sid: SID) {
        console.log(`end session - ${sid}`);

        this.proxyOut.closeSession(sid);
    }


    public messageFromClient(sid: SID, clientMsg: string) {
        console.log(`${sid} <== ${clientMsg}`);

        const clientResponse = buildResponse(sid, JSON.parse(clientMsg));
        this.workflowController.processProxyMessage(JSON.stringify(clientResponse));
    }

    public sendMessagesToClient(messages: Messages) {
        messages.forEach(message => {
            this.sendMessageToClient(message);
        });
    }

    public sendMessageToClient(message: Message) {
        if (message.payload) {
            const clientMessage = message.payload.message;
            this.proxyOut.sendMessage(message.sid, JSON.stringify(clientMessage));
        }
    }

    private addMessageToSession(message: Message) {
        const sid = message.sid;
        var messages = this.sessionMessages.get(sid);
        if (!messages) {
            messages = new Array();
        }
        messages.push(message);
        this.sessionMessages.set(sid, messages);
    }

    public processBotMessage(botMessage: string) {
        const message: Message = JSON.parse(botMessage);
        this.addMessageToSession(message);

        if (isRequest(message.payload)) {
            this.sendMessageToClient(message);
        }
    }

    private show() {
        let table = new Map();
        for (let [sid, value] of this.sessionMessages) {
            table.set(sid, value.length);
        }
        console.table(table, ["SID", "Messages"]);
    }
}