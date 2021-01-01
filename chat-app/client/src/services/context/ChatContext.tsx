import * as React from 'react';
import { useState, useEffect, useMemo, createContext } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { Redirect } from 'react-router-dom'
import { Config } from '../config/Config';
import { ChatMessages } from '../models/Messages';
import { Users } from '../models/Users';
import { UserStatus } from '../models/Status';
import {
    WsMessages,
    Operation,
    UserName,
    UserMsg,
    ChatMsg,
    parseWsMessage
} from './WsMessages';

export interface ChatState {
    users: Users,
    messages: ChatMessages,
    status: UserStatus,
}

interface Props {
    children: any,
};

export const ChatContextProvider = (props: Props) => {
    const socketUrl = `${Config.WsServer}`;
    const [chatState, setChatState] = useState({
        users: new Users(),
        messages: new ChatMessages(),
        status: new UserStatus(),
    });
    const [redirect, setRedirect] = useState(false);
    const STATIC_OPTIONS = useMemo(() => ({
        share: true,
    }), []);
    const [_, lastMessage, readyState] = useWebSocket(socketUrl, STATIC_OPTIONS);

    const allUsers = (userMsgs: Array<UserMsg>) => {
        console.log(`all users: (${userMsgs.length})`);

        setChatState(prevState => {
            let chatState = Object.assign({}, prevState);
            chatState.users = new Users(userMsgs);
            return chatState;
        });
    }

    const addUser = (userMsg: UserMsg) => {
        console.log(`add user: ${userMsg.user}`);

        setChatState(prevState => {
            let chatState = Object.assign({}, prevState);
            chatState.users.add(userMsg);
            return chatState;
        });
    }

    const removeUser = (userName: string) => {
        console.log(`remove user: ${userName}`);

        setChatState(prevState => {
            let chatState = Object.assign({}, prevState);
            chatState.users.remove(userName);
            return chatState;
        });
    }

    const setOnline = (userName: string) => {
        console.log(`user online: ${userName}`);

        setChatState(prevState => {
            let chatState = Object.assign({}, prevState);
            chatState.status.setOnline(userName);
            return chatState;
        });
    }

    const setOffline = (userName: string) => {
        console.log(`user offline: ${userName}`);

        setChatState(prevState => {
            let chatState = Object.assign({}, prevState);
            chatState.status.setOffline(userName);
            return chatState;
        });
    }

    const onlineUsers = (onlineUsers: Array<UserName>) => {
        console.log(`online users: (${onlineUsers.length})`);

        setChatState(prevState => {
            let chatState = Object.assign({}, prevState);
            chatState.status.initUsers(chatState.users.getUserNames(), onlineUsers);
            return chatState;
        });
    }

    const chatMessages = (chatMsgs: Array<ChatMsg>) => {
        console.log(`chat messages: (${chatMsgs.length})`);

        setChatState(prevState => {
            let chatState = Object.assign({}, prevState);
            chatState.messages = new ChatMessages(chatMsgs);
            return chatState;
        });
    }

    const chatMessage = (chatMsg: ChatMsg) => {
        console.log(`add chat message: (${chatMsg.message})`);

        setChatState(prevState => {
            let chatState = Object.assign({}, prevState);
            chatState.messages.add(chatMsg);
            return chatState;
        });
    }

    const reRoute = () => {
        return <Redirect to='/logout' />;
    }

    useEffect(() => {
        if (lastMessage !== null) {
            const message: WsMessages = parseWsMessage(lastMessage.data);
            switch (message.kind) {
                case Operation.AllUsers:
                    allUsers(message.content);
                    break;
                case Operation.AddUser:
                    addUser(message.content);
                    break;
                case Operation.RemoveUser:
                    removeUser(message.content.user);
                    break;
                case Operation.UserOnline:
                    setOnline(message.content.user);
                    break;
                case Operation.UserOffline:
                    setOffline(message.content.user);
                    break;
                case Operation.OnlineUsers:
                    onlineUsers(message.content.users);
                    break;
                case Operation.ChatMessages:
                    chatMessages(message.content);
                    break;
                case Operation.ChatMessage:
                    chatMessage(message.content);
                    break;
                case Operation.Error:
                    alert(message.reason);
                    break;
                default:
                    console.error(`Message handler missing (${lastMessage.data})`);
                    break;
            }
        }
    }, [lastMessage]);

    const setUsersStatusToUnknown = () => {
        let newState = Object.assign({}, chatState);
        newState.status.setUnknown();
        setChatState(newState);
    }

    useEffect(() => {
        switch (readyState) {
            case ReadyState.CLOSED:
                console.log("lost connection to server");
                setUsersStatusToUnknown();
                break;
            default: // ignored
                break;
        }
    }, [readyState]);

    return (
        <ChatContext.Provider value={chatState}>
            {props.children}
        </ChatContext.Provider>
    );
}

export const ChatContext = createContext<ChatState | null>(null);
export const ChatContextConsumer = ChatContext.Consumer;