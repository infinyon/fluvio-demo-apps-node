var cli = require("commander");

class ConsumeProduceCLI {

    constructor() {
        this.server = '0.0.0.0:9003';
        this.topic = '';
        this.partition = 0;
    }

    parse() {
        cli
            .option('-s, --server <host:port>', 'default: 0.0.0.0:9003')
            .requiredOption('-t, --topic <name>', 'topic name')
            .requiredOption('-p, --partition <number>', 'partition index', parseInt)
            .parse(process.argv);

        // set server
        if (cli.server) {
            this.server = cli.server;
        }

        // set topic
        if (cli.topic) {
            this.topic = cli.topic;
        }

        // valid partition or exit
        if (cli.partition) {
            if (isNaN(cli.port)) {
                console.log(`invalid partition number`);
                return process.exit(22);
            }

            this.partition = cli.partition;
        }
    }
};

module.exports = {
    Cli: ConsumeProduceCLI
}