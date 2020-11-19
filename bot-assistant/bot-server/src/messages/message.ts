///
/// Chat Protocol Message Definitions
///
import { Payload } from "./payload";

export type SID = string;
export type TimeStamp = string;

export interface Message {
  sid: SID;
  from: From;
  payload: Payload;
  timestamp: TimeStamp;
}

export type From =
  | "Client"
  | "Server";

/** 
 *  Package into message
 */
export const buildMessage = (sid: SID, from: From, payload: Payload) => {
  return <Message>{
    sid: sid,
    from: from,
    payload: payload,
    timestamp: getDateTime(),
  };
};

/** 
 *  Private APIs
 */
const getDateTime = () => {
  return new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, -1);
};