import { WsProxy, wsProxyEvents } from "./ws-proxy";
import { FluvioLib, fluvioEvents } from "./fluvio-lib";
import { Message, SID, buildInitMessage, buildResponse, isRequest } from "../messages";

type Messages = Array<Message>;

export class StreamingController {
    private _dataStreams: Map<SID, Messages>;
    private _fluvio: FluvioLib;
    private _wsProxy: WsProxy;

    constructor() {
        this._dataStreams = new Map();
        this._fluvio = new FluvioLib();
    }

    public async init(topicName: string, wsProxy: WsProxy) {
        this._wsProxy = wsProxy;

        this.listenForEvents();

        await this._fluvio.init(topicName);
        console.log("after topic add");
        await this._fluvio.fetchMessages();
        console.log("after fetch");
        await this._fluvio.startConsumerStream();

        this.show();
    }

    public async messageFromClient(sid: SID, clientMsg: string) {
        const response = JSON.parse(clientMsg);
        const message = buildResponse(sid, response);

        await this._fluvio.produceMessage(JSON.stringify(message));
    }

    public sendToClient(message: Message) {
        if (message.payload) {
            const clientMessage = message.payload.message;
            this._wsProxy.sendMessage(message.sid, JSON.stringify(clientMessage));
        }
    }

    private append(message: Message) {
        const sid = message.sid;
        var messages = this._dataStreams.get(sid);
        if (!messages) {
            messages = new Array();
        }
        messages.push(message);
        this._dataStreams.set(sid, messages);
    }

    private show() {
        let table = new Map();
        for (let [key, value] of this._dataStreams) {
            table.set(key, value.length);
        }
        console.table(table, ["SID", "Messages"]);
    }

    private listenForEvents() {

        fluvioEvents.on(
            fluvioEvents.FLUVIO_MESSAGE,
            (msgObj: string) => {
                const message: Message = JSON.parse(msgObj);
                this.append(message);
                if (isRequest(message.payload)) {
                    this.sendToClient(message);
                }
            }
        );

        wsProxyEvents.on(
            wsProxyEvents.CONNECTION,
            async (sid: SID) => {
                const messages = this._dataStreams.get(sid);
                if (messages) {
                    messages.forEach(message => {
                        this.sendToClient(message);
                    });
                } else {
                    const message = buildInitMessage(sid);
                    await this._fluvio.produceMessage(JSON.stringify(message));
                }
            }
        );

        wsProxyEvents.on(
            wsProxyEvents.MESSAGE,
            async (sid: SID, clientMsg: string) => {
                const response = JSON.parse(clientMsg);
                const message = buildResponse(sid, response);

                await this._fluvio.produceMessage(JSON.stringify(message));
            }
        );
    }
}
