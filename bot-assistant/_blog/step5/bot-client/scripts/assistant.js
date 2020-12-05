window.onload = () => {
    var webSocket = null;

    // Create and attach Bot Assistant HTML elements
    function loadAssistant() {
        // Add assistant button
        var note = createElement("img", { "src": `img/assistant/note.svg` }),
            aButton = createElement("button", {}, note);

        // Append assistant dialog
        var bot = createElement("img", { "src": `img/assistant/bot.svg`, "class": "bot" }),
            title = createElement("span", {}, "Bot Assistant"),
            aDialogClose = createElement("img", { "src": `img/assistant/close.svg`, "class": "close" }),
            header = createElement("div", { "class": "header" }, [bot, title, aDialogClose]),
            msgBody = createElement("div", { "class": "msg-body" }),
            innerBody = createElement("div", { "class": "inner-body" }, msgBody),
            body = createElement("div", { "class": "body-wrapper" }, innerBody),
            userMsg = createElement("div", {
                "id": "user-msg",
                "class": "textareaElement",
                "placeholder": "Type here",
                "contenteditable": "false"
            }),
            footer = createElement("div", { "class": "footer" }, userMsg),
            aDialog = createElement("div", { "class": "chat" }, [header, body, footer]);

        // Attach event listeners
        aButton.addEventListener('click', onOpenDialog, false);
        aDialogClose.addEventListener('click', onCloseDialog, false);

        // Add to document
        document.querySelector(".assistant").appendChild(aButton);
        document.querySelector(".assistant").appendChild(aDialog);
    }

    // On open assistant dialog callback
    function onOpenDialog() {
        document.querySelector(".assistant button").style.display = "none";
        document.querySelector(".assistant .chat").style.display = "block";
        openWSConnection();
    }

    // On close assistant dialog callback
    function onCloseDialog() {
        document.querySelector(".assistant .chat").style.display = "none";
        document.querySelector(".assistant button").style.display = "block";
    }

    // Open WebSocket connection
    function openWSConnection() {
        try {
            if (webSocket != null) {
                return; // already connected
            }

            logOutput("Connecting to: ws://localhost:9998/");
            webSocket = new WebSocket("ws://localhost:9998/");

            webSocket.onopen = function (openEvent) {
                logOutput("Connected!");
            };

            webSocket.onclose = function (closeEvent) {
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

    // Make editor section editable
    function enableChatEditor() {
        var chatBox = document.getElementById("user-msg");
        chatBox.setAttribute("contenteditable", true);

        chatBox.addEventListener("keydown", onEditorKeys, false);
    }

    // Callback on chat editor user input (key press)
    function onEditorKeys(e) {
        var chatBox = document.getElementById("user-msg");

        if (e.code == 'Enter' && chatBox.textContent.length > 0) {
            e.preventDefault();

            const content = chatBox.textContent;
            webSocket.send(content);

            logOutput(`==> ${content}`);
            chatBox.innerHTML = '';
        }
    }

    // Log output in the "debugOutput" textarea (if available) and the console
    function logOutput(value) {
        var debugOutput = document.getElementById("debugOutput");
        if (debugOutput) {
            debugOutput.value += value + "\n\n";
            debugOutput.scrollTop = debugOutput.scrollHeight;
        }
        console.log(value);
    }

    // Create element utility function
    function createElement(element, attribute, inner) {
        if (typeof (element) === "undefined") { return false; }
        if (typeof (inner) === "undefined") { inner = ""; }

        var el = document.createElement(element);
        if (typeof (attribute) === 'object') {
            for (var key in attribute) {
                el.setAttribute(key, attribute[key]);
            }
        }
        if (!Array.isArray(inner)) {
            inner = [inner];
        }
        for (var k = 0; k < inner.length; k++) {
            if (inner[k].tagName) {
                el.appendChild(inner[k]);
            } else {
                el.innerHTML = inner[k];
            }
        }
        return el;
    }

    // Call main function
    loadAssistant();

    // TODO: Remove after testing
    enableChatEditor();
};