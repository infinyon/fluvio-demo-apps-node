import { EventEmitter } from "events";
import { createTopicIfNotFound, fetchMessages, startConsumerStream, produceMessage } from "./fluvio";
import { wsSessionEvents } from "./ws_sessions";
import { Message, Payload, SID, buildMessage, isInitPayload } from "../messages";

type Messages = Array<Message>;

/**
 *   Fluvio Data Streams - local cache
 */
class DataStreams {
  private static _initialized: boolean;
  private static _topic: string;
  private _data_streams: Map<SID, Messages>;

  constructor() {
    DataStreams._initialized = false;

    this._data_streams = new Map();
  }

  // create topic & build internal cache
  public async init(topic: string) {
    DataStreams._topic = topic;

    await createTopicIfNotFound(topic);
    await fetchMessages(topic);

    DataStreams._initialized = true;
    this.show();

    startConsumerStream(topic);
  }

  public initialized() {
    return DataStreams._initialized;
  }

  public topic() {
    return DataStreams._topic;
  }

  // append session with a messages (create map if it does not exist)
  public append(message: Message) {
    const sid = message.sid;

    var messages = this._data_streams.get(sid);
    if (!messages) {
      messages = new Array();
    }
    messages.push(message);
    this._data_streams.set(sid, messages);
  }

  // check if no messages in this session
  public isEmpty(sid: SID) {
    return (this._data_streams.get(sid) == undefined)
  }

  // returns all messages for this session
  public getDataStream(sid: SID) {
    return this._data_streams.get(sid);
  }

  // show data streams in table format
  public show() {
    let table = new Map();
    for (let [key, value] of this._data_streams) {
      table.set(key, value.length);
    }
    console.table(table, ["SID", "Messages"]);
  }

}

/**
 * Data Streaming Events
 */
class DataStreamingEvents extends EventEmitter {
  readonly PROXY_CONNECTED = 'Proxy';
  readonly CLIENT_MESSAGE = 'Client';
  readonly FLUVIO_MESSAGE = 'Fluvio';
}
export const dataStreamingEvents = new DataStreamingEvents();

// Events from "Proxy"
dataStreamingEvents.on(
  dataStreamingEvents.PROXY_CONNECTED,
  async (sid: SID) => {

    console.log(`-- DataStream <= [${dataStreamingEvents.PROXY_CONNECTED}] ${sid}`);

    if (DSS.isEmpty(sid)) {
      await produceInit(sid);
    } else {
      await playbackDataStream(sid);
    }
  }
);

// Events from "Client"
dataStreamingEvents.on(
  dataStreamingEvents.CLIENT_MESSAGE,
  async (sid: SID, payload_msg: string) => {

    console.log(`-- DataStream <= [${dataStreamingEvents.CLIENT_MESSAGE}] ${sid} - ${payload_msg}`);

    const payload: Payload = JSON.parse(payload_msg);
    const message = buildMessage(sid, "Client", payload);
    await produceMessage(DSS.topic(), JSON.stringify(message));
  }
);

// Events from "Fluvio"
exports.onFluvioMessage = dataStreamingEvents.on(
  dataStreamingEvents.FLUVIO_MESSAGE,
  (msg: string) => {

    // Update internal cache
    const message: Message = JSON.parse(msg);
    DSS.append(message);

    if (DSS.initialized()) {

      // Reply to Client
      if (message.from == "Server") {
        console.log(`-- DataStream <= [${dataStreamingEvents.FLUVIO_MESSAGE}] ${msg}`);

        wsSessionEvents.emit(wsSessionEvents.FROM_SERVER, message.sid, message.payload);
      }
    }
  }
);

/**
 * Produce init payload and push to data stream
 *  @param sid - Session id
 */
async function produceInit(sid: SID) {
  const initPayload: Payload = {
    kind: "Init"
  }
  const message = buildMessage(sid, "Client", initPayload);

  await produceMessage(DSS.topic(), JSON.stringify(message));
}

/**
 * Playback data stream messages from local cache
 *  @param sid - Session id
 */
async function playbackDataStream(sid: SID) {
  const messages = DSS.getDataStream(sid);
  messages?.forEach(message => {
    if (!isInitPayload(message.payload)) {
      wsSessionEvents.emit(wsSessionEvents.FROM_SERVER, message.sid, message.payload);
    }
  });
}

// Data Streams Singleton (DSS)
const DSS = new DataStreams();
Object.freeze(DSS);
export default DSS;
