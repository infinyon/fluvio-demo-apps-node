import { TOPIC_REPLICATION } from "../config/constants";
import { sleep } from "../common/utils";
import { broadcastNewMessage } from "../controllers/wsProxy/proxyController";
import {
  ChatEvent,
  Stream,
  Event,
  EventCallback,
  fluvioTopics,
  fluvioStreams,
  sendNewMessageEvent,
} from "../events";

// nsc => [n]ode [s]imple [c]hat"
const FLUVIO_CHAT_TOPIC = "nsc-chat-events";

//==============================
// ChatMessage Class
// =============================

export class ChatMessage {
  name: string;
  message: string;
  colorCode: string;
  timestamp: string;

  constructor(obj: Object) {
    Object.assign(this, obj);
  }

  public add() {
    sendNewMessageEvent(getChatEventStream(), this);
  }

  public toKV() {
    return {
      name: this.name,
      message: this.message,
      colorCode: this.colorCode,
      timestamp: this.timestamp,
    };
  }
}

//==============================
// Chat Class (a singleton)
// =============================

class Chat {
  private chatMessages: Array<ChatMessage>;
  private static init = true;

  public constructor() {
    this.chatMessages = new Array();
  }

  public initCompleted() {
    Chat.init = false;
    console.log(`Loaded (${this.chatMessages.length}) chat messages`);
  }

  public inInit() {
    return Chat.init;
  }

  // Load chat Messages from Fluvio topic
  public async loadChatMessages() {
    await createFluvioChatTopic();

    // initialize event stream emitter
    fluvioStreams.subscribeToStream(
      getChatEventStream(),
      "earliest",
      chatEventCallback
    );
  }

  public addMessage(chatMessageObj: Object) {
    let chatMessage = new ChatMessage(chatMessageObj);

    // add to local store (through event callback)
    chatMessage.add();
  }

  public getMessages() {
    return this.chatMessages;
  }

  // ------------------
  //  Fluvio Callbacks
  // ------------------
  public newChatMessageCallback(chatMessageObj: Object) {
    let chatMessage = new ChatMessage(chatMessageObj);
    this.chatMessages.push(chatMessage);
    console.log(
      `[s] chat => received '${chatMessage.message}' from ${chatMessage.name}`
    );

    if (!this.inInit()) {
      broadcastNewMessage(chatMessage.toKV());
    }
  }
}

//================================
// Fluvio Topic - chat events callback
// ===============================

const chatEventCallback: EventCallback = function (event: Event): void {
  console.log("--- S(chat) << E(chat) ---");
  console.log(`${JSON.stringify(event.metadata)}`);

  switch (event.metadata.type) {
    case ChatEvent.NEW_MESSAGE:
      chatSingleton.newChatMessageCallback(event.params);
      break;

    default:
      console.error(`Unknown chat event type ${event.metadata.type}`);
  }
  console.log("-------------------------");
};

//================================
// Fluvio - chat events topic
// ===============================

const createFluvioChatTopic = async () => {
  const topicName = FLUVIO_CHAT_TOPIC;

  // save to local store
  const created = await fluvioTopics.createTopicIfNotDefined(
    topicName,
    1,
    TOPIC_REPLICATION
  );

  // allow time to propagate
  if (created) {
    await sleep(500);
  }
};

export const getChatEventStream = () => {
  const stream: Stream = {
    topic: FLUVIO_CHAT_TOPIC,
    partition: 0,
  };
  return stream;
};

const chatSingleton = new Chat();
Object.freeze(chatSingleton);

export default chatSingleton;
