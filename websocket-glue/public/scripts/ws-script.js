const SERVER_HOST = "localhost:9998";

window.onload = () => {
    var webSocket = null;

    function init() {
        var connectBtn = document.getElementById("connect");
        var disconnectBtn = document.getElementById("disconnect");
        var sendMessageBtn = document.getElementById("sendMessage");
        var messageEditor = document.getElementById("message");

        connectBtn.onclick = onConnectClick;
        disconnectBtn.onclick = onDisconnectClick;
        sendMessageBtn.onclick = onSendMessageClick;

        messageEditor.addEventListener("keydown", onEditorKeys, false);
    }

    function openWSConnection() {
        try {
            if (webSocket != null) {
                return;
            }

            const server = "ws://" + SERVER_HOST;
            logOutput("Connecting to: " + server);

            webSocket = new WebSocket(server);

            webSocket.onopen = function (openEvent) {
                logOutput("Connected!");
            };

            webSocket.onclose = function (closeEvent) {
                webSocket = null;
                logOutput("Disconnected!");
            };

            webSocket.onerror = function (errorEvent) {
                logOutput(`Error: ${JSON.stringify(errorEvent)}`);
            };

            webSocket.onmessage = function (messageEvent) {
                var serverMsg = messageEvent.data;
                logOutput(`<== ${serverMsg}`);
            };

        } catch (exception) {
            logOutput(`error: ${JSON.stringify(exception)}`);
        }
    }

    function onConnectClick() {
        openWSConnection();
    }

    function onDisconnectClick() {
        if (webSocket) {
            webSocket.close();
        } else {
            logOutput(`Not Connected!`);
        }
    }

    function onSendMessageClick() {
        if (webSocket) {
            var message = document.getElementById("message").value || "ping";
            logOutput("==> " + message);
            webSocket.send(message);
        } else {
            logOutput(`Not Connected!`);
        }
    }

    function onEditorKeys(e) {
        if (e.code == 'Enter') {
            e.preventDefault();
            onSendMessageClick();
        }
    }

    function logOutput(value) {
        var debugOutput = document.getElementById("output");
        if (debugOutput) {
            debugOutput.value += value + "\n\n";
            debugOutput.scrollTop = debugOutput.scrollHeight;
        }
        console.log(value);
    }

    init();
};