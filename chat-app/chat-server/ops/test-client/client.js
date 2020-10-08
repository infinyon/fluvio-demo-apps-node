const WebSocket = require("ws");

function getUsers() {
  return {
    metadata: {
      kind: "user",
      timestamp: getDateTime(),
    },
    operation: "getUsers",
    data: {},
  };
}

function newMessage(name, message) {
  return {
    metadata: {
      kind: "chat",
      timestamp: getDateTime(),
    },
    operation: "addMessage",
    data: {
      name: name,
      message: message,
      timestamp: getDateTime(),
    },
  };
}

function onOpen(evt) {
  console.log("CONNECTED");
}

function onClose(evt) {
  console.log("DISCONNECTED");
}

function onMessage(evt) {
  console.log(JSON.parse(evt.data));
}

function onError(evt) {
  console.log(`ERROR: ${evt.message}`);
}

function testWebSocket() {
  var args = process.argv.slice(2);
  const token = args[0];
  const name = args[1];
  const message = args[2];

  console.log(`connect with token ${token}`);

  const websocket = new WebSocket(`http://localhost:5050/${token}`);

  websocket.onopen = function (evt) {
    onOpen(evt);

    // Send message
    if (name && message) {
      websocket.send(JSON.stringify(newMessage(name, message)));
    }
  };

  websocket.onclose = function (evt) {
    onClose(evt);
  };

  websocket.onmessage = function (evt) {
    onMessage(evt);
  };

  websocket.onerror = function (evt) {
    onError(evt);
  };
}

const getDateTime = () => {
  return new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, -1);
};

testWebSocket();
