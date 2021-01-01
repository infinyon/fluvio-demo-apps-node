import { getDateTime } from '../config/DateTime';

export type UserName = string;

export const enum Operation {
  AllUsers = "AllUsers",
  AddUser = "AddUser",
  RemoveUser = "RemoveUser",
  UserOnline = "UserOnline",
  UserOffline = "UserOffline",
  OnlineUsers = "OnlineUsers",
  ChatMessages = "ChatMessages",
  ChatMessage = "ChatMessage",
  Error = "Error",
}

export type WsMessages =
  | IAllUsers
  | IAddUser
  | IRemoveUser
  | IUserOnline
  | IUserOffline
  | IOnlineUsers
  | IChatMessage
  | IChatMessages
  | IError;

export interface UserMsg {
  user: UserName;
  colorCode: string;
}

export interface ChatMsg {
  user: string;
  message: string;
  timestamp: string
}


export interface IAllUsers {
  kind: Operation.AllUsers;
  content: Array<UserMsg>;
}

export interface IAddUser {
  kind: Operation.AddUser;
  content: UserMsg;
}

export interface IRemoveUser {
  kind: Operation.RemoveUser;
  content: {
    user: UserName;
  };
}

export interface IUserOnline {
  kind: Operation.UserOnline;
  content: {
    user: UserName;
  };
}

export interface IUserOffline {
  kind: Operation.UserOffline;
  content: {
    user: UserName;
  };
}

export interface IOnlineUsers {
  kind: Operation.OnlineUsers;
  content: {
    users: Array<UserName>;
  };
}

export interface IChatMessage {
  kind: Operation.ChatMessage;
  content: ChatMsg;
}

export interface IChatMessages {
  kind: Operation.ChatMessages,
  content: Array<ChatMsg>,
}

export interface IError {
  kind: Operation.Error,
  reason: string,
}

// APIs

export function buildWsChatMessage(chatMsg: ChatMsg) {
  return <IChatMessage>{
    kind: Operation.ChatMessage,
    content: chatMsg,
  };
}

export function parseWsMessage(message: string) {
  return <WsMessages>JSON.parse(message);
}
