var flvClient = require('@fluvio/client');
const EventEmitter = require('events').EventEmitter;
const emitter = new EventEmitter();
const ConsumeCLI = require('./utils/cli').Cli;

function consumeMessages() {
    let cli = new ConsumeCLI();
    cli.parse();

    emitter.on('data', (msg) => {
        console.log(msg);
    })

    flvClient.connect(cli.server).then((sc) => {
        console.log("Connected to SC: ", sc.addr());

        sc.leader(cli.topic, cli.partition).then((leader) => {
            leader.consume(emitter.emit.bind(emitter));
        })

    });
};

consumeMessages();