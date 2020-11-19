import WS from "ws";
import { EventEmitter } from "events";
import { dataStreamingEvents } from "./data_streams";
import { Payload, SID } from "../messages";

class WsSessions {
  private _sessions: Map<SID, WS>;

  constructor() {
    this._sessions = new Map();
  }

  public add(sid: SID, ws: WS) {
    console.log(`++  Open-SESS ${sid}`);
    this._sessions.set(sid, ws);

    dataStreamingEvents.emit(dataStreamingEvents.PROXY_CONNECTED, sid);
  }

  public remove(sid: SID) {
    console.log(`-- Close-SESS ${sid}`);
    this._sessions.delete(sid);
  }

  public received_msg(sid: SID, payload_msg: string) {
    dataStreamingEvents.emit(dataStreamingEvents.CLIENT_MESSAGE, sid, payload_msg);
  }

  public send_msg(sid: SID, payload_msg: string) {
    const ws = this._sessions.get(sid);
    if (!ws) {
      return;
    }

    ws.send(payload_msg);
  }

  public show() {
    console.table(this._sessions, ["sid", "ws"]);
  }
}

/**
 * Session Events
 */
class WsSessionEvents extends EventEmitter {
  readonly FROM_SERVER = 'Server';
}
export const wsSessionEvents = new WsSessionEvents();

// Events from "Server"
exports.onServerMessages = wsSessionEvents.on(
  wsSessionEvents.FROM_SERVER,
  (sid: SID, payload: Payload) => {
    const payload_msg = JSON.stringify(payload);

    console.log(`-- WsSession <= [${wsSessionEvents.FROM_SERVER}] ${sid} ${payload_msg}`);

    WSS.send_msg(sid, payload_msg);
  }
);

// Websocket Sessions Singleton
const WSS = new WsSessions();
Object.freeze(WSS);

export default WSS;
