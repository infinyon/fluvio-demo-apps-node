import { fluvioStreams, Stream as FluvioStream, Event } from "../fluvio-lib";
import { getDateTime } from "../common/utils";

export type Stream = FluvioStream;

export const toMetadata = (key: string, eventType: any) => {
  return {
    type: eventType,
    key: key,
    timestamp: getDateTime(),
  };
};

export const toHeader = (event: Event) => {
  return `${event.metadata.key} - ${event.metadata.type}`;
};

export const sendEventToStream = (stream: Stream, event: Event) => {
  fluvioStreams.sendEventToStream(stream, event);
};
