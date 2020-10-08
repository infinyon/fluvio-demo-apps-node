import { toMetadata, sendEventToStream, Stream } from "./sendEvent";
import { User } from "../store/users";

export enum UserEvent {
  REGISTERED = "Registered",
  UNREGISTERED = "UnRegistered",
  TOKEN_UPDATED = "TokenUpdated",
  PASSWORD_UPDATED = "PasswordUpdated",
  ONLINE = "Online",
  OFFLINE = "Offline",
}

export const sendRegisteredEvent = (stream: Stream, user: User) => {
  sendEventToStream(stream, {
    metadata: toMetadata(user.name, UserEvent.REGISTERED),
    params: user,
  });
};

export const sendUnRegisteredEvent = (stream: Stream, userName: string) => {
  sendEventToStream(stream, {
    metadata: toMetadata(userName, UserEvent.UNREGISTERED),
    params: {},
  });
};

export const sendTokenUpdatedEvent = (
  stream: Stream,
  userName: string,
  token?: string
) => {
  sendEventToStream(stream, {
    metadata: toMetadata(userName, UserEvent.TOKEN_UPDATED),
    params: { token: token },
  });
};

export const sendPasswordUpdatedEvent = (
  stream: Stream,
  userName: string,
  pass: string
) => {
  sendEventToStream(stream, {
    metadata: toMetadata(userName, UserEvent.PASSWORD_UPDATED),
    params: { password: pass },
  });
};

export const sendOnlineEvent = (stream: Stream, userName: string) => {
  sendEventToStream(stream, {
    metadata: toMetadata(userName, UserEvent.ONLINE),
    params: {},
  });
};

export const sendOfflineEvent = (stream: Stream, userName: string) => {
  sendEventToStream(stream, {
    metadata: toMetadata(userName, UserEvent.OFFLINE),
    params: {},
  });
};
