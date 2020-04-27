import * as React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import ChatEditor from './ChatEditor';
import ChatView from './ChatView';
import {
    toolbarHeight,
    editorHeight,
    bkChatColor,
    editorBkColor
} from '../config/Constants';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        chatView: {
            display: "flex",
            background: bkChatColor,
            overflow: 'auto',
            marginTop: 10,
            paddingLeft: 15,
            paddingRight: 15,
            height: `calc(100vh - ${toolbarHeight + editorHeight + 10}px)`,
        },
        editorView: {
            background: editorBkColor,
            height: editorHeight,
        },
    }),
);


export default function ChatViewWrapper() {
    const classes = useStyles();

    return (
        <div>
            <Box className={classes.chatView}>
                <ChatView />
            </Box>
            <Box className={classes.editorView}>
                <ChatEditor />
            </Box>
        </div>
    );
}
