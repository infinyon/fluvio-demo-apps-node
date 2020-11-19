///
/// Fluvio APIs
///     Topic
///         - find      - find a topic
///         - create    - create a topic (and create if not found)
///     Producer        - produces a message
///     Consumer Fetch  - consumes all records from offset 0
///     Consumer Stream - start a data stream and emits latest record on "FLUVIO_MESSAGE"
///
import Fluvio, { Offset, OffsetFrom } from '@fluvio/client';
import { dataStreamingEvents } from './data_streams';

/**
 * Find a topic
 */
export async function findTopic(topicName: string) {
    const fluvio = new Fluvio();

    await fluvio.connect();
    const admin = await fluvio.admin();
    const topic = await admin.findTopic(topicName);

    return (topic != null);
}

/**
 * Create a topic
 */
export async function createTopic(topicName: string) {
    const fluvio = new Fluvio();

    await fluvio.connect();
    const admin = await fluvio.admin();
    await admin.createTopic(topicName);
}

/**
 * Create topic if does not exist
 */
export async function createTopicIfNotFound(topicName: string) {
    if (!await findTopic(topicName)) {
        await createTopic(topicName);
        await sleep(2000);
        console.log(`proxy: topic '${topicName}' created`);
    }
}

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

    console.log('proxy: listening for events ... ');

    consumer.stream(offset, (record: string) => {
        dataStreamingEvents.emit(
            dataStreamingEvents.FLUVIO_MESSAGE,
            record
        );
    })
}

/**
 *  Consumer Fetch - Fetch all messages from offset 0
 */
export async function fetchMessages(topicName: string) {
    const fluvio = new Fluvio();

    await fluvio.connect();

    const consumer = await fluvio.partitionConsumer(topicName, 0)
    const offset: Offset = new Offset()

    const fetched = await consumer.fetch(offset);
    if (fetched) {
        fetched.records.batches.forEach(batch => {
            batch.records.forEach(record => {
                dataStreamingEvents.emit(
                    dataStreamingEvents.FLUVIO_MESSAGE,
                    record.value
                );
            });
        });
    }

    console.log(`proxy: fetched ${fetched.highWatermark} messages`);
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