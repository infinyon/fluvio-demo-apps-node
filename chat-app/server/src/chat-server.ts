var cors = require('cors');
import http from "http";
import express from "express";
import parser from "body-parser";
import cookieParser from "cookie-parser";
import Fluvio from '@fluvio/client';
import { AuthRouter } from "./auth-router";
import { UserController } from "./user-controller";
import { SessionController } from "./session-controller";
import { ChatController } from "./chat-controller";
import { WsProxyIn } from "./proxy-in";
import { WsProxyOut } from "./proxy-out";

const PORT = 5050;
const USERS_TOPIC = "chat-app-users";
const MESSAGES_TOPIC = "chat-app-messages";
const SESSIONS_TOPIC = "chat-app-sessions";

process.on("uncaughtException", (e) => { console.log(e); process.exit(1); });
process.on("unhandledRejection", (e) => { console.log(e); process.exit(1); });

const startServer = async () => {
  const fluvio = await Fluvio.connect();
  await checkTopics(fluvio);

  const userProducer = await fluvio.topicProducer(USERS_TOPIC);
  const userConsumer = await fluvio.partitionConsumer(USERS_TOPIC, 0);
  const messageProducer = await fluvio.topicProducer(MESSAGES_TOPIC);
  const messageConsumer = await fluvio.partitionConsumer(MESSAGES_TOPIC, 0);
  const sessionProducer = await fluvio.topicProducer(SESSIONS_TOPIC);
  const sessionConsumer = await fluvio.partitionConsumer(SESSIONS_TOPIC, 0);

  const app = express();
  app.use(cors({ credentials: true, origin: true }));
  app.use(parser.json());
  app.use(parser.urlencoded({ extended: true }));
  app.use(cookieParser());

  const proxyOut = new WsProxyOut();
  const userController = new UserController(proxyOut, userConsumer, sessionConsumer);
  const chatController = new ChatController(proxyOut, messageConsumer, sessionConsumer);
  const sessionController = new SessionController(proxyOut, userConsumer, sessionProducer, messageProducer);
  const wsProxyIn = new WsProxyIn(sessionController, userController);

  const authRouter = new AuthRouter(userProducer);
  app.use(authRouter.init(userController));

  await userController.init();
  await chatController.init();
  await sessionController.init();

  console.log("----")

  const Server = http.createServer(app);
  wsProxyIn.init(Server);

  Server.listen(PORT, () => {
    console.log(
      `Chat server is running at http://localhost:${PORT}...`
    );
  });
};

const checkTopics = async (fluvio: Fluvio) => {
  const admin = await fluvio.admin();
  if (!await admin.findTopic(USERS_TOPIC)
    || !await admin.findTopic(MESSAGES_TOPIC)
    || !await admin.findTopic(SESSIONS_TOPIC)
  ) {
    console.error("Error: Fluvio topic not found! Run `npm run setup`");
    process.exit(1);
  }
}

startServer();
