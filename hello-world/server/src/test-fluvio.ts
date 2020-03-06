let addon = require('@fluvio/client');
const EventEmitter = require('events').EventEmitter;
const emitter = new EventEmitter();

export function fluvio() {
    emitter.on('data', (evt: any) => {
        console.log("received event", evt);
    })

    addon.connectSc("localhost:9003").then((sc: any) => {
        console.log("connect to sc at ", sc.addr());

        sc.findLeader("items", 0).then((leader: any) => {

            /*
            leader.produce("new message").then(len => {
                console.log("message send");
            });
            */

            leader.consume(emitter.emit.bind(emitter));

        })
    });
};