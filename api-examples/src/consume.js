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
        console.log("Connected to SC:", sc.serverAddress());

        sc.replica(cli.topic, cli.partition).then((replica) => {
            try {
                replica.consume({
                    offset: "earliest"
                },
                    emitter.emit.bind(emitter)
                );
            } catch (ex) {
                console.log(ex);
            }
        })

    });
};

consumeMessages();