var flvClient = require('@fluvio/client');
var stdin = process.openStdin();

function produceMessages() {

    flvClient.connect("0.0.0.0:9003").then((sc) => {
        console.log("Connected to SC: ", sc.addr());

        sc.leader("my-topic-1", 0).then((leader) => {

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