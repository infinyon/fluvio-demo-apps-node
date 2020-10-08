//declare var require: any;
import Fluvio, { OffsetFrom } from "@fluvio/client";
const EventEmitter = require("events").EventEmitter;
import { EventCallback, Event, Stream } from "../types";

const fluvio = new Fluvio({
  host: "127.0.0.1",
  port: 9003,
});

// Immediately setup fluvio connection;
(async () => {
  await fluvio.connect();
})();

export const sendEventToStream = async (stream: Stream, event: Event) => {
  let msg = JSON.stringify(event);
  try {
    const producer = await fluvio.topicProducer(stream.topic);
    await producer.sendRecord(msg, stream.partition);
  } catch (e) {
    console.log(`Cannot send event ${e}`);
  }
};

export const subscribeToStream = async (
  stream: Stream,
  offset: string,
  callback?: EventCallback
) => {
  try {
    const consumer = await fluvio.partitionConsumer(
      stream.topic,
      stream.partition
    );
    await consumer.stream(
      {
        index: 0,
        from: OffsetFrom.Beginning,
      },
      async (msg: string) => {
        console.log("Received msg: ", msg);
        if (callback) {
          callback(JSON.parse(msg) as Event);
        }
      }
    );
  } catch (error) {
    console.log(`Event subscriber ${error}`);
  }
};
