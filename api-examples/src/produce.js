var flvClient = require('@fluvio/client');
var stdin = process.openStdin();
const ProduceCLI = require('./cli/consumeProduce').Cli;

function produceMessages() {
    let cli = new ProduceCLI();
    cli.parse();

    flvClient.connect(cli.server).then((sc) => {
        console.log("Connected to SC: ", sc.addr());

        sc.leader(cli.topic, cli.partition).then((leader) => {

            stdin.addListener("data", (data) => {
                let line = data.toString().trim();
                if (line.length == 0) {
                    return;
                }

                leader.produce(line).then(len => {
                    console.log("ok!");
                });
            });

        })
    });
};

produceMessages();