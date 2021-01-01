import * as React from 'react';
import { useMemo } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { MyChatEditor } from '../components/MyChatEditor';
import { ErrorAlert } from '../components/ErrorAlert';
import { Config } from '../config/Config';
import { buildWsChatMessage, ChatMsg } from '../context/WsMessages';
import { getDateTime } from "../config/DateTime";
import { getLocalStorage } from '../middleware/LocalStorage';

export default function ChatEditor() {
    const socketUrl = `${Config.WsServer}`;
    const STATIC_OPTIONS = useMemo(() => ({
        share: true,
    }), []);
    const [sendMessage, _, readyState] = useWebSocket(socketUrl, STATIC_OPTIONS);
    const userParams = JSON.parse(getLocalStorage());

    const submitText = (text: string): void => {
        console.log(text);
        const chatMsg: ChatMsg = {
            user: userParams.user,
            message: text,
            timestamp: getDateTime(),
        }
        let chatMessage = buildWsChatMessage(chatMsg);
        sendMessage(JSON.stringify(chatMessage));
    }

    const handleKeyPress = (ev: any) => {
        if (ev.key === 'Enter') {
            ev.preventDefault();

            if (readyState == ReadyState.OPEN) {
                if (ev.target.value.length > 0) {
                    submitText(ev.target.value);
                    ev.target.value = "";
                }
            } else {
                ErrorAlert("Connection Error: Cannot send message.")
            }
        }
    }

    return (
        <MyChatEditor
            id="text"
            placeholder="Message for Channel"
            handleKeyPress={handleKeyPress}
        />
    );
}