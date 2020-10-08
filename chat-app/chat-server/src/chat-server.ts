import Cli from "./common/cli";
import Users from "./store/users";
import Chat from "./store/chat";
import Server from "./servers/apiServer";
import { getError } from "./common/otherErrors";
import { sleep } from "./common/utils";

const initAll = async () => {
  try {
    console.log("init users ...");
    await Users.loadUsers();
    await Chat.loadChatMessages();

    await sleep(1000); // hack until init is done

    Users.initCompleted();
    Chat.initCompleted();
    console.log("...init done");
  } catch (err) {
    console.error(`error: ${getError(err)}`);
    return process.exit(22);
  }
};

const startServer = async () => {
  await initAll();

  const cliParams = Cli.parse();
  Server.listen(cliParams.port, () => {
    console.log(
      `Chat server is running at http://localhost:${cliParams.port}...`
    );
  });
};

process.on("uncaughtException", (e) => {
  console.log(e);
  process.exit(1);
});
process.on("unhandledRejection", (e) => {
  console.log(e);
  process.exit(1);
});

startServer();
