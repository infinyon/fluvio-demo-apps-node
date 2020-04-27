//declare var require: any;
var flvClient = require("@fluvio/client");
const EventEmitter = require('events').EventEmitter;
import { EventCallback, Event, Stream } from '../types';

const FLUVIO_SC = "0.0.0.0:9003";

export const sendEventToStream = (
    stream: Stream,
    event: Event,
) => {
    let jsonEvent = JSON.stringify(event);
    try {
        flvClient.connect(FLUVIO_SC).then((sc: any) => {
            sc.replica(stream.topic, stream.partition).then((replica: any) => {
                replica.produce(jsonEvent).then(() => {
                    console.log(`>> sent to topic '${stream.topic}/${stream.partition}': ${jsonEvent}`);
                });
            });

        })
    } catch (e) {
        console.log(`Cannot send event ${e}`);
    }
}

export const subscribeToStream = (stream: Stream, offset: string, callback?: EventCallback) => {
    const emitter = new EventEmitter();

    emitter.on('data', (obj: string) => {
        console.log(`[flv] ${obj}`);
        let event: Event = JSON.parse(obj);
        if (callback) {
            callback(event);
        }
    })

    try {
        flvClient.connect(FLUVIO_SC).then((sc: any) => {

            sc.replica(stream.topic, stream.partition).then((replica: any) => {
                replica.consume({ offset: offset }, emitter.emit.bind(emitter));
            });

        })
    } catch (e) {
        console.log(`Event subscriber ${e}`);
    }
};