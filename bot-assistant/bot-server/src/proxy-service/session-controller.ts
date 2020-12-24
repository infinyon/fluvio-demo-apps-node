import WS from "ws";
import { WsProxyOut } from "./proxy-out";
import { ToRecords, FromStart, FromEnd } from "../fluvio-util";
import { TopicProducer, PartitionConsumer } from "@fluvio/client";
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
        ToRecords(await this.fluvioConsumer.fetch(FromStart)).forEach(sessionMsg => {
            this.appendMessageToSession(JSON.parse(sessionMsg));
        });

        this.show();

        this.fluvioConsumer.stream(FromEnd, (sessionMsg: string) => {
            this.processFluvioMessage(sessionMsg);
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


    public async sessionMessage(sid: SID, clientMsg: string) {
        console.log(`${sid} <== ${clientMsg}`);

        const message = buildResponse(sid, JSON.parse(clientMsg));
        await this.fluvioProducer.sendRecord(JSON.stringify(message), 0);
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

    private appendMessageToSession(message: Message) {
        const sid = message.sid;
        var messages = this.sessionMessages.get(sid);
        if (!messages) {
            messages = new Array();
        }
        messages.push(message);
        this.sessionMessages.set(sid, messages);
    }

    private processFluvioMessage(fluvioMsg: string) {
        const message: Message = JSON.parse(fluvioMsg);
        this.appendMessageToSession(message);

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