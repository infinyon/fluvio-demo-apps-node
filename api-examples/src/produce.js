var flvClient = require('@fluvio/client');
var stdin = process.openStdin();
const ProduceCLI = require('./utils/cli').Cli;

function produceMessages() {
    let cli = new ProduceCLI();
    cli.parse();

    flvClient.connect(cli.server).then((sc) => {
        console.log("Connected to SC: ", sc.serverAddress());

        sc.replica(cli.topic, cli.partition).then((replica) => {

            stdin.addListener("data", (data) => {
                let line = data.toString().trim();
                if (line.length == 0) {
                    return;
                }

                replica.produce(line).then(len => {
                    console.log("ok!");
                });
            });

        })
    });
};

produceMessages();