import http from "http";
import express from "express";
import Path from "path"
import WebSocket from "./connection-proxy/ws_server";
import DataStreams from "./connection-proxy/data_streams";
import BotWorkflow from "./bot-assistant/bot_workflow";
import BotAssistant from "./bot-assistant/bot_assistant";

const PORT = 9998;
const DATA_STREAM_TOPIC = "chat-assist-messages";

// Catch-all for Promise exceptions
process.on("uncaughtException", (e) => {
  console.log(e);
  process.exit(1);
});

process.on("unhandledRejection", (e) => {
  console.log(e);
  process.exit(1);
});

// Provision Chat Assistant Server
const startServer = async () => {
  const app = express();
  const Server = http.createServer(app);

  // Initialize data streaming
  await DataStreams.init(DATA_STREAM_TOPIC);

  // Attach Server to Websocket
  WebSocket.init(Server);

  // Start server
  Server.listen(PORT, () => {
    console.log(
      `started chat assistant server at http://localhost:${PORT}...`
    );
  });

  // Initialize work
  BotWorkflow.init(Path.join(__dirname, "..", "state-machine.json"));

  // Initialize bot assistant
  await BotAssistant.init(DATA_STREAM_TOPIC);

};

// Start Server
startServer();
