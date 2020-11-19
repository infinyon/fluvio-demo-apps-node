import { EventEmitter } from "events";
import { Message, Payload, SID, buildMessage, isInitPayload } from "../messages";
import { startConsumerStream, produceMessage, sleep } from "./fluvio";
import BotWorkflow from "./bot_workflow";

/**
 *   Fluvio Data Streams - local cache
 */
class BotAssistant {
  private static _topic: string;
  private static _locked: boolean;
  private static _send_queue: Array<{ sid: SID, payload: Payload }>;

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

  public enqueue(sid: SID, payload: Payload) {
    BotAssistant._send_queue.push({ sid: sid, payload: payload });
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
      const val = BAS.dequeue();
      if (val) {
        await sendResponse(val.sid, val.payload);

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

      if (isInitPayload(message.payload)) {
        BotWorkflow.nextMessages(message.sid);
      } else {
        BotWorkflow.nextMessages(message.sid, message.payload);
      }
    }
  }
);

// Events from "Bot" state machine
exports.onBotMessage = botAssistantEvents.on(
  botAssistantEvents.BOT_MESSAGE,
  async (sid: SID, payload: Payload) => {
    console.log(`-- BotAssist <= [${botAssistantEvents.BOT_MESSAGE}] ${JSON.stringify(payload)}`);

    BAS.enqueue(sid, payload);
    await BAS.flush();
  }
);

/**
 * Send response to Fluvio data stream
 *  @param sid - Session id
 *  @param payload - Response payload
 */
async function sendResponse(sid: SID, payload: Payload) {
  const response = buildMessage(sid, "Server", payload);
  const response_msg = JSON.stringify(response);
  await produceMessage(BAS.topic(), response_msg);
}


// Bot Assistant Singleton (DSS)
const BAS = new BotAssistant();
Object.freeze(BAS);
export default BAS;
