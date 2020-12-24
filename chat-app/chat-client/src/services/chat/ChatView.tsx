import * as React from 'react';
import { useContext, useRef, useEffect } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import MyChatMessage from '../components/MyChatMessage';
import { ChatContext } from '../context/ChatContext';
import { ChatMessage } from '../models/Messages';

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
    const chatContext = useContext(ChatContext);
    const messages = chatContext.messages.getMessages();
    const users = chatContext.users;
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
    useEffect(scrollToBottom, [chatContext]);

    const prevMessage = (messages: Array<ChatMessage>, index: number) => {
        return index > 0 ? messages[index - 1] : undefined;
    }

    return (
        <div>
            {messages.map((message, index) => (
                <div className={classes.root} key={"ts" + message.timestamp}>
                    <Box flexGrow={1} className={classes.row}>
                        <MyChatMessage
                            prevMessage={prevMessage(messages, index)}
                            message={message}
                            colorCode={users.getColorCode(message.user)}
                        />
                    </Box>
                </div>
            ))}
            <div ref={messagesEndRef} id="lastItem-xyz" />
        </div>
    );
}
