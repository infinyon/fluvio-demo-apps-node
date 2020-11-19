# Bot Assistant

This project provides an example on how to write you own Robot Assistant. The product uses Fluvio data streaming for storage, Typescript for the server, and Javascript for the client.

![Bot Assistant](./bot-client/img/bot-assistant.png)

**Note:**
The server uses Fluvio data streaming for storage and message exchanges. If you don't have Fluvio installed, checkout [Getting Started](https://fluvio.io/docs/getting-started).

## Building Bot Assistant

From `bot-assistant` directory, run build command:

```bash
npm run build
```

This will run the `./build.sh` script, which will install the dependencies and build the robot client and server.

### Run Bot Server

Open a new terminal window, navigate to `bot-assistant` directory and start the server:

```bash
npm run start:server
```
The server connects to Fluvio creates a topic and listens for client messages. If if the server successfully started, you should see the following message.

```bash
proxy: topic 'chat-assist-messages' created
proxy: fetched 0 messages
┌───────────────────┬─────┬────────┐
│ (iteration index) │ Key │ Values │
├───────────────────┼─────┼────────┤
└───────────────────┴─────┴────────┘
started chat assistant server at http://localhost:9998...
proxy: listening for events ... 
bot: listening for events ... 
```

### Run Bot Client

Open a new terminal window, navigate to `bot-assistant` directory and start the client:

```bash
npm run start:client
...
listening http://localhost:9999
```

The client runs on port `9999`, start a web browser to view.
