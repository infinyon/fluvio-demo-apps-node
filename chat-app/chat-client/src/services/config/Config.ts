// Webpack places files in .env into variables 'process.env.<name>'.
// Since they are strings not KVs, they must be matched as strings.
export class Config {
  static readonly ApiServer =
    process.env.API_SERVER_URL || "http://localhost:5050/api";
  static readonly WsServer = process.env.WS_SERVER_URL || "ws://localhost:5050";
  static readonly PublicUrl = process.env.PUBLIC_URL || "http://localhost:5051";
}
