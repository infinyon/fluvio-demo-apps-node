import http from "http";
import express from "express";
import { fluvio } from "./test-fluvio";

process.on("uncaughtException", e => {
    console.log(e);
    process.exit(1);
});

process.on("unhandledRejection", e => {
    console.log(e);
    process.exit(1);
});

export const app = express();
const server = http.createServer(app);

server.listen(8008, () =>
    console.log(`Server is running http://localhost:8008...`)
);

fluvio();