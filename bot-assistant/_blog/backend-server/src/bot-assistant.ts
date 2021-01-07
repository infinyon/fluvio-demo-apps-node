import http from "http";
import express from "express";
import path from 'path';
import { initBotAssistant } from "./bot-server";

const PORT = 9998;

const startServer = async () => {
    const app = express();
    const publicPath = path.join(__dirname, '..', 'public')

    app.get('/', (req, res) => {
        res.sendFile(path.join(publicPath, 'index.html'));
    });
    app.use("/scripts", express.static(path.join(publicPath, 'scripts')));
    app.use("/css", express.static(path.join(publicPath, 'css')));
    app.use("/img", express.static(path.join(publicPath, 'img')));

    const Server = http.createServer(app);
    initBotAssistant(Server);

    Server.listen(PORT, () => {
        console.log(
            `started bot assistant server at ws://localhost:${PORT}...`
        );
    });
};

process.on("uncaughtException", (e) => { console.log(e); process.exit(1); });
process.on("unhandledRejection", (e) => { console.log(e); process.exit(1); });

startServer();