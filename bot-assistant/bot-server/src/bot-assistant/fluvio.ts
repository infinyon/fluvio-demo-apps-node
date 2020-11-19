///
/// Fluvio APIs
///     Producer        - produces a message
///     Consumer Stream - start a data stream and emits latest record on "FLUVIO_MESSAGE"
///
import Fluvio, { Offset, OffsetFrom } from '@fluvio/client';
import { botAssistantEvents } from './bot_assistant';

/**
 * Produce - produce a message
 */
export async function produceMessage(topicName: string, msg: string) {
    const fluvio = new Fluvio();

    await fluvio.connect();
    const producer = await fluvio.topicProducer(topicName);
    producer.sendRecord(msg, 0);
}

/**
 * Consumer Stream - Continuous fetch records from stream.
 */
export async function startConsumerStream(topicName: string) {
    const fluvio = new Fluvio();

    await fluvio.connect();

    const consumer = await fluvio.partitionConsumer(topicName, 0)
    const offset: Offset = new Offset({ from: OffsetFrom.End, index: 0 })

    console.log('bot: listening for events ... ');

    consumer.stream(offset, (record: string) => {
        botAssistantEvents.emit(
            botAssistantEvents.FLUVIO_MESSAGE,
            record
        );
    })
}

/**
 * Sleep API
 *   @param ms - number of miliseconds
 */
export async function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}