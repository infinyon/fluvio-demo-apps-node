import WebSocket from "../../servers/webSocket";
import Chat from "../../store/chat";
import {
    getWsChatMessage,
    buildWsChatMessage,
    ChatOperation
} from "../../wsProtocol";

// =====================================
// Chat Ws Controller
// =====================================

export const onIncomingMessages = () => {
    WebSocket.wss().on('connection', function (ws, req) {
        const userName = WebSocket.toUserName(req.headers);
        openConnectionHandler(ws, userName);

        ws.on('message', (msgObj: string) => {
            const userMsg = getWsChatMessage(msgObj);
            if (userMsg) {
                switch (userMsg.operation) {
                    case ChatOperation.AddMessage:
                        addMessageToStore(userName, userMsg.data);
                        break;
                    default:
                        console.error(`user: message handler missing (${userMsg.operation})`);
                        break;
                }
            }
        });

    })
}


// =====================================
// Chat Handlers
// =====================================

const openConnectionHandler = (ws: any, userName: string) => {
    console.log(`send '${ChatOperation.AllMessages}' => ${userName}`);

    ws.send(buildWsChatMessage(
        ChatOperation.AllMessages,
        Chat.getMessages()
    ));
}

const addMessageToStore = (userName: string, messageObj: Object) => {
    console.log(`received '${ChatOperation.AddMessage}' from ${userName}`);

    Chat.addMessage(messageObj);
}

