var cli = require("commander");
const FluvioProfile = require('./profile').FluvioProfile;

class ConsumeProduceCLI {

    constructor() {
        this.server = '0.0.0.0:9003';
        this.profile = 'default.toml';
        this.topic = '';
        this.partition = 0;
    }

    parse() {
        cli
            .option('-s, --server <host:port>', 'default: 0.0.0.0:9003')
            .option('-f, --profile <filename>', 'default: default.toml')
            .requiredOption('-t, --topic <name>', 'topic name')
            .requiredOption('-p, --partition <number>', 'partition index', parseInt)
            .parse(process.argv);

        // set server
        this._setServer(cli.server, cli.profile);

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

    // Server is computed in the following order of precedence:
    //     1) if --server is set, use:
    //          cli.server
    //     2) if --profile is set, lookup profile file
    //          cli.server = <server parsed from profile>
    //          => error if parsing failed
    //     3) if no profile is set, look-up default profile
    //          cli.server = <server parsed form default profile>
    //          => no error no error if no file is found
    //     4) use default server
    //          0.0.0.0:9003
    _setServer(cliServer, profileFileName) {
        let fluvioProfile = new FluvioProfile();

        if (cliServer) {
            this.server = cliServer;
            console.log(`SC server (from CLI): ${this.server} `);
        } else if (profileFileName) {
            let profile = fluvioProfile.getProfileExistOnError(profileFileName);
            this.server = `${profile['host']}:${profile['port']}`;
            console.log(`SC server (from profile - ${profileFileName}): ${this.server} `);
        } else {
            let profile = fluvioProfile.getProfileSilent(this.profile);
            if (profile) {
                this.server = `${profile.sc.host}:${profile.sc.port}`;
                console.log(`SC server (from profile - ${this.profile}): ${this.server} `);
            } else {
                console.log(`SC server (default): ${this.server} `);
            }
        }
    }
};

module.exports = {
    Cli: ConsumeProduceCLI
}