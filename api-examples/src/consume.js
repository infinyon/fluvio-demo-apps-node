var flvClient = require('@fluvio/client');
const EventEmitter = require('events').EventEmitter;
const emitter = new EventEmitter();

function consumeMessages() {

    emitter.on('data', (msg) => {
        console.log(msg);
    })

    flvClient.connect("0.0.0.0:9003").then((sc) => {
        console.log("Connected to SC: ", sc.addr());

        sc.leader("my-topic-1", 0).then((leader) => {
            leader.consume(emitter.emit.bind(emitter));
        })

    });
};

consumeMessages();