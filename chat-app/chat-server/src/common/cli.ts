import program from "commander";
import { DEFAULT_PORT } from "../config/constants";

export interface CliParams {
  port: number;
}

class Cli {
  params: CliParams;

  // defaults
  constructor() {
    this.params = {
      port: parseInt(DEFAULT_PORT),
    };
  }

  // port parser
  private _parsePort(value: string) {
    return parseInt(value);
  }

  // parser (public)
  public parse() {
    program
      .option(
        "-p, --port <number>",
        `default: ${DEFAULT_PORT}`,
        this._parsePort
      )
      .parse(process.argv);

    // valid port or exit
    if (program.port) {
      if (isNaN(program.port)) {
        console.log(`invalid port number`);
        return process.exit(22);
      }

      this.params.port = program.port;
    }
    return this.params;
  }
}

export default new Cli();
