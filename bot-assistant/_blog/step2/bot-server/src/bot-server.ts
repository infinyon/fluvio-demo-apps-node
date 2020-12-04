import http from "http";
import express from "express";

const PORT = 9998;

// Provision Bot Assistant Server
const startServer = async () => {
    const app = express();
    const Server = http.createServer(app);

    // Start server
    Server.listen(PORT, () => {
        console.log(
            `started bot assistant server at http://localhost:${PORT}...`
        );
    });
};

// Start Server
startServer();
