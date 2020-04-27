import { toMetadata, sendEventToStream, Stream } from './sendEvent';
import { ChatMessage } from '../store/chat';

export enum ChatEvent {
    NEW_MESSAGE = "NewMessage",
}

export const sendNewMessageEvent = (stream: Stream, chatMessage: ChatMessage) => {
    sendEventToStream(
        stream,
        {
            metadata: toMetadata(chatMessage.name, ChatEvent.NEW_MESSAGE),
            params: chatMessage
        });
};