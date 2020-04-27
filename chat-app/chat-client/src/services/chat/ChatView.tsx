import * as React from 'react';
import { useState, useEffect, useMemo, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import MyChatMessage from '../components/MyChatMessage';
import { getSiteToken } from '../middleware/SiteCookies';
import { Config } from '../config/Config';
import { getWsChatMessage, ChatOperation } from '../wsProtocol';

export interface Message {
    name: string;
    message: string;
    colorCode: string;
    timestamp: string
}

export interface ChatState {
    messages: Array<Message>,
}

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: '100%',
        },
        row: {}
    }),
);

export default function ChatView() {
    const classes = useStyles();
    const socketUrl = `${Config.WsServer}/${getSiteToken()}`;
    const [chatState, setChatState] = useState({ messages: [] });
    const STATIC_OPTIONS = useMemo(() => ({
        share: true,
        shouldReconnect: () => true,
    }), []);
    const [_, lastMessage, readyState] = useWebSocket(socketUrl, STATIC_OPTIONS);
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }

    const addMessages = (newMessages: Message[]) => {
        console.log(`init all messages`);
        setChatState({ messages: newMessages });
    }

    const addMessage = (newMessage: Message) => {
        console.log(`add message from ${newMessage.message}`);
        var messages = chatState.messages;
        messages.push(newMessage);
        setChatState({ messages: messages });
    }

    useEffect(() => {
        if (lastMessage !== null) {
            const chatMsg = getWsChatMessage(lastMessage.data);
            if (chatMsg) {
                switch (chatMsg.operation) {
                    case ChatOperation.AllMessages:
                        addMessages(chatMsg.data as Message[]);
                        break;
                    case ChatOperation.NewMessage:
                        addMessage(chatMsg.data as Message);
                        break;
                    default:
                        console.error(`chat: message handler missing (${chatMsg.operation})`);
                        break;
                }
            }
        }
    }, [lastMessage]);

    useEffect(scrollToBottom, [chatState]);

    useEffect(() => {
        switch (readyState) {
            case ReadyState.CLOSED:
                console.log("lost connection to server");
                break;
            default: // ignored
                break;
        }
    }, [readyState]);

    const prevMessage = (index: number) => {
        return index > 0 ? chatState.messages[index - 1] : undefined;
    }

    return (
        <div>
            {chatState.messages.map((message, index) => (
                <div className={classes.root} key={"ts" + message.timestamp}>
                    <Box flexGrow={1} className={classes.row}>
                        <MyChatMessage prevMessage={prevMessage(index)} message={message} />
                    </Box>
                </div>
            ))}
            <div ref={messagesEndRef} id="lastItem-xyz" />
        </div>
    );
}
