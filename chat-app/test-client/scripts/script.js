const SERVER_HOST = "localhost:5050/";

window.onload = () => {
    var webSocket = null;

    function init() {
        var registerBtn = document.getElementById("register");
        var unregisterBtn = document.getElementById("unregister");
        var loginBtn = document.getElementById("login");
        var logoutBtn = document.getElementById("logout");
        var connectBtn = document.getElementById("connect");
        var disconnectBtn = document.getElementById("disconnect");
        var sendMessageBtn = document.getElementById("sendMessage");
        var messageEditor = document.getElementById("message");

        registerBtn.onclick = onRegisterClick;
        unregisterBtn.onclick = onUnregisterClick;
        loginBtn.onclick = onLoginClick;
        logoutBtn.onclick = onLogoutClick;
        connectBtn.onclick = onConnectClick;
        disconnectBtn.onclick = onDisconnectClick;
        sendMessageBtn.onclick = onSendMessageClick;

        messageEditor.addEventListener("keydown", onEditorKeys, false);
    }

    // Open WebSocket connection
    function openWSConnection() {

        try {
            if (webSocket != null) {
                return; // already connected
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

    // Register User
    function onRegisterClick() {
        var xhr = sendRequest("Register", "api/register", {
            user: getUserName(),
        });

        xhr.onload = function () {
            logOutput(`<== Register: (${this.status}) ${this.responseText}`);
        }
    }

    // Unregister User
    function onUnregisterClick() {
        var xhr = sendRequest("Unregister", "api/unregister");

        xhr.onload = function () {
            logOutput(`<== Unregister: (${this.status}) ${this.responseText}`);
        }
    }

    // Login User
    function onLoginClick() {
        var xhr = sendRequest("Login", "api/login", {
            user: getUserName(),
        });

        xhr.onload = function () {
            logOutput(`<== Login: (${this.status}) ${this.responseText}`);
        }
    }

    // Logout User
    function onLogoutClick() {
        var xhr = sendRequest("Logout", "api/logout");

        xhr.onload = function () {
            logOutput(`<== Logout: (${this.status}) ${this.responseText}`);
        }
    }

    // Connect user (after logged-in)
    function onConnectClick() {
        openWSConnection();
    }

    // Disconnect user
    function onDisconnectClick() {
        if (webSocket) {
            webSocket.close();
        } else {
            logOutput(`Not Connected!`);
        }
    }

    function onSendMessageClick() {
        if (webSocket) {
            var message = document.getElementById("message").value || "Hello World!";

            const chatMessage = JSON.stringify({
                kind: "ChatMessage",
                content: {
                    user: getUserName(),
                    message: message,
                    timestamp: getDateTime(),
                }
            });

            logOutput("==> " + chatMessage);
            webSocket.send(chatMessage);
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

    function sendRequest(label, api, message) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://" + SERVER_HOST + api, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.withCredentials = true;

        const request = JSON.stringify(message);
        logOutput(`==> ${label}: ${request || ''}`);

        xhr.send(request);
        return xhr;
    }

    function logOutput(value) {
        var debugOutput = document.getElementById("debugOutput");
        if (debugOutput) {
            debugOutput.value += value + "\n\n";
            debugOutput.scrollTop = debugOutput.scrollHeight;
        }
        console.log(value);
    }

    function getUserName() {
        return document.getElementById("userName").value || "alice";
    }

    init();
};

const getDateTime = () => {
    return new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, -1);
};