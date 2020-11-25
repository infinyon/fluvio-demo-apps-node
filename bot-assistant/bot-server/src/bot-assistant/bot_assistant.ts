import { EventEmitter } from "events";
import { Message, Payload, SID, buildMessage } from "../messages";
import { startConsumerStream, produceMessage, sleep } from "./fluvio";
import BotWorkflow from "./bot_workflow";

/**
 *   Fluvio Data Streams - local cache
 */
class BotAssistant {
  private static _topic: string;
  private static _locked: boolean;
  private static _send_queue: Array<string>;

  // create topic & start consumer
  public async init(topic: string) {
    BotAssistant._topic = topic;
    BotAssistant._locked = false;
    BotAssistant._send_queue = [];

    startConsumerStream(topic);
  }

  public topic() {
    return BotAssistant._topic;
  }

  public enqueue(msg: string) {
    BotAssistant._send_queue.push(msg);
  }

  public dequeue() {
    return BotAssistant._send_queue.shift();
  }

  public async flush() {
    while (BotAssistant._locked) {
      await sleep(100);
    }

    while (BotAssistant._send_queue.length) {
      BotAssistant._locked = true;
      const msg = BAS.dequeue();
      if (msg) {
        await sendResponse(msg);

      }
      BotAssistant._locked = false;
    }
  }
}

/**
 * Bot assistant Events
 */
class BotAssistantEvents extends EventEmitter {
  readonly FLUVIO_MESSAGE = 'Fluvio';
  readonly BOT_MESSAGE = 'Workflow';
}
export const botAssistantEvents = new BotAssistantEvents();

// Events from "Fluvio"
exports.onFluvioMessage = botAssistantEvents.on(
  botAssistantEvents.FLUVIO_MESSAGE,
  async (msg: string) => {
    const message: Message = JSON.parse(msg);
    if (message.from == "Client") {
      console.log(`-- BotAssist <= [${botAssistantEvents.FLUVIO_MESSAGE}] ${msg}`);

      if (message.payload) {
        BotWorkflow.nextMessages(message.sid, message.payload);
      } else {
        BotWorkflow.nextMessages(message.sid);
      }
    }
  }
);

// Events from "Bot" state machine
exports.onBotMessage = botAssistantEvents.on(
  botAssistantEvents.BOT_MESSAGE,
  async (sid: SID, payload: Payload) => {
    console.log(`-- BotAssist <= [${botAssistantEvents.BOT_MESSAGE}] ${JSON.stringify(payload)}`);

    const msg_obj = buildMessage(sid, "Server", payload);
    const msg = JSON.stringify(msg_obj);

    BAS.enqueue(msg);
    await BAS.flush();
  }
);

/**
 * Send response to Fluvio data stream
 *  @param msg - Response message
 */
async function sendResponse(msg: string) {
  await produceMessage(BAS.topic(), msg);
}


// Bot Assistant Singleton (DSS)
const BAS = new BotAssistant();
Object.freeze(BAS);
export default BAS;
