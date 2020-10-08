import WebSocket from "../../servers/webSocket";
import {
  buildWsUserMessage,
  UserOperation,
  ChatOperation,
  buildWsChatMessage,
} from "../../wsProtocol";
import { KV } from "../../common/utils";

// =====================================
// Proxy User Messages
// =====================================

export const broadcastAddUser = (userName: string, userKV: KV) => {
  const addUserMsg = buildWsUserMessage(UserOperation.AddUser, userKV);

  WebSocket.broadcast(addUserMsg);
};

export const broadcastRemoveUser = (userName: string) => {
  const removeUserMsg = buildWsUserMessage(UserOperation.RemoveUser, {
    userName: userName,
  });

  WebSocket.broadcast(removeUserMsg);
};

export const broadcastUserOnline = (userName: string) => {
  const onlineMsg = buildWsUserMessage(UserOperation.Online, {
    userName: userName,
  });

  WebSocket.broadcast(onlineMsg);
};

export const broadcastUserOffline = (userName: string) => {
  const offlineMsg = buildWsUserMessage(UserOperation.Offline, {
    userName: userName,
  });

  WebSocket.broadcast(offlineMsg);
};

// =====================================
// Proxy Chat Messages
// =====================================

export const broadcastNewMessage = (messageKV: KV) => {
  const newMsg = buildWsChatMessage(ChatOperation.NewMessage, messageKV);

  WebSocket.broadcast(newMsg);
};
