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
    }

    public async produceMessage(msg: string) {
        const producer = await this._fluvio.topicProducer(this._topicName);
        producer.sendRecord(msg, 0);
    }

    public async startConsumerStream() {
        const consumer = await this._fluvio.partitionConsumer(this._topicName, 0);
        const offset: Offset = new Offset({ from: OffsetFrom.End, index: 0 })

        console.log('workflow: listening for events ... ');

        consumer.stream(offset, (record: string) => {
            fluvioEvents.emit(
                fluvioEvents.FLUVIO_MESSAGE,
                record
            );
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