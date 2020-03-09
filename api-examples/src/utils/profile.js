var toml = require('toml');
var path = require('path');
const fs = require('fs');
const homedir = require('os').homedir();

// Lookup fluvio profile:
//     1) if $FLUVIO_HOME environment variable is set
//          $FLUVIO_HOME/.fluvio
//     2) else use $HOME path
//          $HOME/.fluvio
class FluvioProfile {

    _readProfileFile(profileFileName) {
        let basePath = this._lookupBasePath();
        var profileFile = path.join(
            basePath,
            '.fluvio',
            'profiles',
            profileFileName
        );

        return this._readTomlFile(profileFile);
    }

    _lookupBasePath() {
        if (process.env.FLUVIO_HOME) {
            return process.env.FLUVIO_HOME;
        } else {
            return process.env.HOME;
        }
    }

    _readTomlFile(fileTomlName) {
        var data = fs.readFileSync(fileTomlName, 'utf-8');
        return JSON.stringify(toml.parse(data));
    }

    getProfileExistOnError(profileFileName) {
        try {
            this._readProfileFile(profileFileName);
            let profile = JSON.parse(profileJson);
            if (!profile.sc) {
                console.log("Error: profile missing [sc] section");
                return process.exit(1);
            }
            if (!profile.sc.host) {
                console.log("Error: profile missing [sc] host");
                return process.exit(1);
            }
            if (!profile.sc.port) {
                console.log("Error: profile missing [sc] port");
                return process.exit(1);
            }
            return profile;
        } catch (err) {
            console.log(err.message);
            return process.exit(1);
        }
    }

    getProfileSilent(profileFileName) {
        try {
            let profileJson = this._readProfileFile(profileFileName);
            if (profileJson) {
                let profile = JSON.parse(profileJson);
                if (profile.sc &&
                    profile.sc.host &&
                    profile.sc.port) {
                    return profile;
                }
            }
            return undefined;
        } catch (err) {
            return undefined;
        }
    }
}

module.exports = {
    FluvioProfile: FluvioProfile
}

/*
var data = toml.parse(someTomlString);
console.dir(data);

try {
toml.parse(someCrazyKnuckleHeadedTrblToml);
} catch (e) {
console.error("Parsing error on line " + e.line + ", column " + e.column +
    ": " + e.message);
}
*/
