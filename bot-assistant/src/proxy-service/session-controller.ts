import WS from "ws";
import { WsProxyOut } from "./proxy-out";
import { TopicProducer, PartitionConsumer, Offset } from "@fluvio/client";
import { Message, SID, buildInitMessage, buildResponse, isRequest } from "../messages";

type Messages = Array<Message>;

export class SessionController {
    private sessionMessages: Map<SID, Messages>;
    private fluvioProducer: TopicProducer;
    private fluvioConsumer: PartitionConsumer;
    private proxyOut: WsProxyOut;

    constructor(
        proxyOut: WsProxyOut,
        fluvioProducer: TopicProducer,
        fluvioConsumer: PartitionConsumer
    ) {
        this.sessionMessages = new Map();

        this.proxyOut = proxyOut;
        this.fluvioProducer = fluvioProducer;
        this.fluvioConsumer = fluvioConsumer;
    }

    public async init() {
        (await this.fluvioConsumer.fetch(Offset.FromBeginning())).toRecords().forEach(msg => {
            this.addMessageToSession(JSON.parse(msg));
        });

        this.show();

        this.fluvioConsumer.stream(Offset.FromEnd(), (msg: string) => {
            this.processBotMessage(msg);
        });
    }

    public async sessionOpened(sid: SID, ws: WS) {
        console.log(`start session - ${sid}`);

        this.proxyOut.addSession(sid, ws);

        const messages = this.sessionMessages.get(sid);
        if (messages) {
            this.sendMessagesToClient(messages);
        } else {
            const message = buildInitMessage(sid);
            await this.fluvioProducer.sendRecord(JSON.stringify(message), 0);
        }
    }

    public async sessionClosed(sid: SID) {
        console.log(`end session - ${sid}`);

        this.proxyOut.closeSession(sid);
    }


    public async messageFromClient(sid: SID, clientMsg: string) {
        console.log(`${sid} <== ${clientMsg}`);

        const clientResponse = buildResponse(sid, JSON.parse(clientMsg));
        await this.fluvioProducer.sendRecord(JSON.stringify(clientResponse), 0);
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

    private processBotMessage(fluvioMsg: string) {
        const message: Message = JSON.parse(fluvioMsg);
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