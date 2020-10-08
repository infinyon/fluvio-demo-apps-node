import http from "http";
import express from "express";
import middleware from "../middleware";
import errorHandlers from "../middleware/errorHandlers";
import routes from "../controllers/apiRoutes";
import { applyMiddleware, applyRoutes } from "../middleware/routeHandlers";
import WebSocket from "./webSocket";
import { onIncomingMessages as subscribeUserController } from "../controllers/users/wsController";
import { onIncomingMessages as subscribeChatController } from "../controllers/chat/wsController";

const app = express();
applyMiddleware(middleware, app);
applyRoutes(routes, app);
applyMiddleware(errorHandlers, app);

const Server = http.createServer(app);
WebSocket.init(Server);
subscribeUserController();
subscribeChatController();

export default Server;
