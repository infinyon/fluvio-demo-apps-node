import { ChatMsg } from '../context/WsMessages';

export interface ChatMessage {
    user: string;
    message: string;
    timestamp: string
}

export class ChatMessages {
    private messages: Array<ChatMessage>;

    constructor(chatMsgs?: Array<ChatMsg>) {
        this.messages = this.toChatMessages(chatMsgs);
    }

    public getMessages() {
        return this.messages;
    }

    public add(chatMsg: ChatMsg) {
        this.messages.push(this.toChatMessage(chatMsg));
    }

    private toChatMessage(chatMsg: ChatMsg) {
        return <ChatMessage>Object.assign({}, chatMsg);
    }

    private toChatMessages(chatMsgs?: Array<ChatMsg>) {
        var messages = new Array();
        if (chatMsgs) {
            chatMsgs.forEach(chatMsg => {
                messages.push(this.toChatMessage(chatMsg));
            });
        }
        return messages;
    }
}