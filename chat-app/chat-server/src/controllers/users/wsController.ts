import WebSocket from "../../servers/webSocket";
import Users from "../../store/users";
import {
    getWsUserMessage,
    buildWsUserMessage,
    UserOperation
} from "../../wsProtocol";

// =====================================
// User WS Controller
// =====================================

export const onIncomingMessages = () => {
    WebSocket.wss().on('connection', function (ws, req) {
        const userName = WebSocket.toUserName(req.headers);
        openConnectionHandler(ws, userName);

        ws.on('close', function () {
            closeConnectionHandler(ws, userName);
        });

        ws.on('message', (msgObj: string) => {
            const userMsg = getWsUserMessage(msgObj);
            if (userMsg) {
                switch (userMsg.operation) {
                    case UserOperation.GetUsers:
                        sendUsersToClient(ws, userName);
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
    let user = Users.getUser(userName);
    if (user) {
        user.setOnline();
    }

    sendUsersToClient(ws, userName);
}

const closeConnectionHandler = (ws: any, userName: string) => {
    let user = Users.getUser(userName);
    if (user) {
        user.setOffline();
    }
}

const sendUsersToClient = (ws: any, userName: string) => {
    console.log(`send ''${UserOperation.AllUsers}'' => ${userName}`);

    ws.send(buildWsUserMessage(
        UserOperation.AllUsers,
        Users.getUsers()
    ));
}

