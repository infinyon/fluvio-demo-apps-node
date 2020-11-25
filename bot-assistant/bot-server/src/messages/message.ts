///
/// Chat Protocol Message Definitions
///
export type SID = string;
export type TimeStamp = string;

export interface Message {
  sid: SID;
  from: From;
  payload?: any;
  timestamp: TimeStamp;
}

export type From =
  | "Client"
  | "Server";

/** 
 *  Package into message
 */
export const buildMessage = (sid: SID, from: From, payload?: any) => {
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