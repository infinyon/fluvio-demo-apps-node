import * as React from 'react';
import { useMemo } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { MyChatEditor } from '../components/MyChatEditor';
import { ErrorAlert } from '../components/ErrorAlert';
import { getSiteToken, getColorCode } from '../middleware/SiteCookies';
import { Config } from '../config/Config';
import { buildWsChatMessage, ChatOperation } from '../wsProtocol';
import { getUserName } from '../middleware/SiteCookies';
import { getDateTime } from "../config/Utils";

export default function ChatEditor() {
    const socketUrl = `${Config.WsServer}/${getSiteToken()}`;
    const STATIC_OPTIONS = useMemo(() => ({
        share: true,
    }), []);
    const [sendMessage, _, readyState] = useWebSocket(socketUrl, STATIC_OPTIONS);

    const submitText = (text: string): void => {
        console.log(text);
        const message = {
            name: getUserName(),
            colorCode: getColorCode(),
            message: text,
            timestamp: getDateTime(),
        }

        sendMessage(buildWsChatMessage(
            ChatOperation.AddMessage,
            message
        ));
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

