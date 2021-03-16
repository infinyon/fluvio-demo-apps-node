import { PartitionConsumer, Record } from "@fluvio/client";
import { ToRecords, FromStart, FromEnd } from "./fluvio-util";
import { WsProxyOut } from "./proxy-out";
import {
    SID,
    UserName,
    IChatMessage,
    parseFluvioChatMessage,
    buildWsChatMessage,
    buildWsChatMessages,
} from "./chat-messages";
import { parseFluvioSession } from "./session-messages";

class ChatMessage implements IChatMessage {
    user: UserName;
    message: string;
    timestamp: string;

    constructor(obj: Object) {
        Object.assign(this, obj);
    }
}

export class ChatController {
    private chatMessages: Array<ChatMessage>;
    private proxyOut: WsProxyOut;
    private messageConsumer: PartitionConsumer;
    private sessionConsumer: PartitionConsumer;

    constructor(
        proxyOut: WsProxyOut,
        messageConsumer: PartitionConsumer,
        sessionConsumer: PartitionConsumer,
    ) {
        this.chatMessages = new Array();
        this.proxyOut = proxyOut;
        this.messageConsumer = messageConsumer;
        this.sessionConsumer = sessionConsumer;
    }

    // Public APIs

    public async init() {
        ToRecords(await this.messageConsumer.fetch(FromStart)).forEach(message => {
            this.pushMessage(message);
        });
        this.show();

        this.sessionConsumer.stream(FromEnd, (message: Record) => {
            this.processSessionMessage(message.valueString());
        });
        this.messageConsumer.stream(FromEnd, (message: Record) => {
            this.processChatMessage(message.valueString());
        });
    }

    // Private APIs

    private async pushMessage(message: string) {
        const fluvioMessage = parseFluvioChatMessage(message);
        const chatMessage = new ChatMessage(fluvioMessage.message);
        this.chatMessages.push(chatMessage);
    }

    private sendAllMessages(sid: SID) {
        const messages = Array.from(this.chatMessages.values());
        if (messages.length > 0) {
            const wsChatMessages = buildWsChatMessages(messages);
            this.proxyOut.sendMessage(sid, JSON.stringify(wsChatMessages));
        }
    }

    private async addMessage(chatMessage: ChatMessage, sid: SID) {
        this.chatMessages.push(chatMessage);

        const wsChatMessage = buildWsChatMessage(chatMessage);
        this.proxyOut.broadcastMessage(JSON.stringify(wsChatMessage));
    }

    private show() {
        console.log("ChatMessages");
        console.table({
            messages: this.chatMessages.length,
        });
    }

    private processSessionMessage(msgObj: string) {
        const message = parseFluvioSession(msgObj);

        switch (message.kind) {
            case "Started":
                this.sendAllMessages(message.content.sid);
                break;
        }
    }

    private processChatMessage(message: string) {
        const fluvioMessage = parseFluvioChatMessage(message);
        const chatMessage = new ChatMessage(fluvioMessage.message);
        this.addMessage(chatMessage, fluvioMessage.sid);
    }
}
