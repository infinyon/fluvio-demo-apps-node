import { EventEmitter } from "events";
import Fluvio, { Offset, OffsetFrom } from '@fluvio/client';

// Fluvio Library
export class FluvioLib {
    private _fluvio: Fluvio;
    private _topicName: string;

    public async init(topicName: string) {
        this._topicName = topicName;
        this._fluvio = new Fluvio();

        await this._fluvio.connect();
        await this.createTopicIfNotFound(topicName);
    }

    public async produceMessage(msg: string) {
        const producer = await this._fluvio.topicProducer(this._topicName);
        producer.sendRecord(msg, 0);
    }

    public async fetchMessages() {
        this._fluvio = new Fluvio();
        await this._fluvio.connect();

        const consumer = await this._fluvio.partitionConsumer(this._topicName, 0)
        const offset: Offset = new Offset()

        const fetched = await consumer.fetch(offset);
        if (fetched) {
            fetched.records.batches.forEach(batch => {
                batch.records.forEach(record => {
                    fluvioEvents.emit(
                        fluvioEvents.FLUVIO_MESSAGE,
                        record.value
                    );
                });
            });
        }

        console.log(`proxy: fetched ${fetched.highWatermark} messages`);
    }

    public async startConsumerStream() {
        const consumer = await this._fluvio.partitionConsumer(this._topicName, 0);
        const offset: Offset = new Offset({ from: OffsetFrom.End, index: 0 })

        console.log('proxy: listening for events ... ');

        consumer.stream(offset, (record: string) => {
            fluvioEvents.emit(
                fluvioEvents.FLUVIO_MESSAGE,
                record
            );
        })
    }

    private async createTopicIfNotFound(topicName: string) {
        const admin = await this._fluvio.admin();
        const topic = await admin.findTopic(topicName);

        if (!topic) {
            await admin.createTopic(topicName);
            console.log(`topic: '${topicName}' created`);
            await this.sleep(2000);
        }
    }

    private async sleep(ms: number) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms)
        })
    }
}

/* Fluvio Event Emitter */
class FluvioEvents extends EventEmitter {
    readonly FLUVIO_MESSAGE = 'Fluvio-Message';

    private static _instance = new FluvioEvents();
    static get instance() {
        return this._instance;
    }
}
export const fluvioEvents = FluvioEvents.instance;