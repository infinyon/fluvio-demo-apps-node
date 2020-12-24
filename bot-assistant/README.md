# Bot Assistant

This project provides an example on how to write you own Robot Assistant. The product uses Fluvio data streaming for storage, Typescript for the server, and Javascript for the client.

<p align="center"><img src="./bot-client/img/bot-assistant.png" alt="Bot Assistant" width="360"/></p>

**Note:**
The server uses Fluvio data streaming for storage and message exchanges. If you don't have Fluvio installed, checkout [Getting Started](https://fluvio.io/docs/getting-started).

## Building Bot Assistant

From `bot-assistant` directory, setup environment (create fluvio topic):

```bash
npm run setup
```

Then, build the project:

```bash
npm run build
```

This will run the `./build.sh` script, which will install the dependencies and build the robot client and server.

### Run Bot Server

Open a new terminal window, navigate to `bot-assistant` directory and start the server:

```bash
PARAMS=state-machine.json npm run start:server
```
The server connects to Fluvio creates a topic and listens for client messages. If if the server successfully started, you should see the following message:

```bash
...
┌───────────────────┬─────┬────────┐
│ (iteration index) │ Key │ Values │
├───────────────────┼─────┼────────┤
└───────────────────┴─────┴────────┘
started bot assistant server at http://localhost:9998...
```

### Run Bot Client

Open a new terminal window, navigate to `bot-assistant` directory and start the client:

```bash
npm run start:client
```

You should see the following message:

```bash
...
listening http://localhost:9999
```

The client runs on port `9999`, start a web browser to view.
