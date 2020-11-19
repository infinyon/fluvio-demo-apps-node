// Apache 2.0 License:
//
// Copyright (c) 2020, InfinyOn Inc.
//
const imgPath = "img/assistant";
const webSocketURL = "ws://localhost:9998/";

window.onload = () => {
    var sessionId = "";
    var webSocket = null;

    /**
     * Load external javascript libraries
     */
    loadScript("scripts/reconnecting-socket.js");

    /**
     * Load assistant button and dialog box
     */
    function loadAssistant() {
        // Append assistant button
        var note = createElement("img", { "src": `${imgPath}/note.svg` }),
            assistButton = createElement("button", {}, note);

        assistButton.addEventListener('click', onOpenAssistDialog, false);
        document.querySelector(".assistant").appendChild(assistButton);

        // Append assistant dialog box
        var status = createElement("div", { "id": "bot-status", "class": "status off" }),
            overlay = createElement("div", { "class": "overlay" }, status),
            bot = createElement("img", { "src": `${imgPath}/bot.svg`, "class": "bot" }),
            title = createElement("span", {}, "Virtual Assistant"),
            close = createElement("img", { "src": `${imgPath}/close.svg`, "class": "close" }),
            reset = createElement("img", { "src": `${imgPath}/redo.svg` }),
            header = createElement("div", { "class": "header" }, [bot, overlay, title, close, reset]),
            msg_body = createElement("div", { "class": "msg-body" }),
            inner_body = createElement("div", { "class": "inner-body" }, msg_body),
            body = createElement("div", { "class": "body-wrapper" }, inner_body),
            user_msg = createElement("div", {
                "id": "user-msg",
                "class": "textareaElement",
                "placeholder": "Choose an Option",
                "contenteditable": "false"
            }),
            footer = createElement("div", { "class": "footer" }, user_msg),
            assistDialog = createElement("div", { "class": "chat" },
                [header, body, footer]);

        reset.addEventListener('click', onResetSession, false);
        close.addEventListener('click', onCloseAssistDialog, false);
        document.querySelector(".assistant").appendChild(assistDialog);
    }

    /**
     * Open WS Connection and add handlers
     */
    function openWSConnection() {

        try {
            if (webSocket != null) {
                return; // already connected
            }

            logOutput(`Connecting to: ${webSocketURL}`);
            webSocket = new ReconnectingWebSocket(webSocketURL);

            webSocket.onopen = function (openEvent) {
                clearMessages();
                document.getElementById("bot-status").setAttribute("class", "status on");
                logOutput("Connected!");
            };

            webSocket.onclose = function (closeEvent) {
                document.getElementById("bot-status").setAttribute("class", "status off");
                logOutput("Disconnected!");
            };

            webSocket.onerror = function (errorEvent) {
                logOutput(`Error: ${JSON.stringify(errorEvent)}, try again ...`);
            };

            webSocket.onmessage = function (messageEvent) {
                var wsMsg = messageEvent.data;
                if (wsMsg.indexOf("error") > 0) {
                    logOutput(`error: ${wsMsg.error}`);
                    return;
                }
                onMessageFromServer(wsMsg);
            };

        } catch (exception) {
            logOutput(`error: ${JSON.stringify(exception)}`);
        }
    }

    /**
     * Close WS Connection
     */
    function closeWsConnection() {
        if (webSocket.open) {
            webSocket.close();
            webSocket = null;
        }
    }

    /**
     * On WS Connection
     */
    function onWsOnline() {

    }

    function onWsOffline() {
        var botStatus = document.getElementById("bot-status");
    }

    /**
     * On messages received from Websocket
     */
    function onMessageFromServer(value) {
        value = JSON.parse(value);

        switch (value.kind) {
            case "BotText":
                showBotText(value.content);
                break;
            case "UserText":
                showUserText(value.content);
                break;
            case "OperatorText":
                showOperatorText(value.name, value.content);
                break;
            case "ChoiceRequest":
                showBotText(value.question);
                showChoiceButtons(value.groupId, value.choices);
                break;
            case "ChoiceResponse":
                choicesToButton(value.groupId, value.content);
                break;
            case "StartChatSession":
                sessionId = value.sessionId;
                enableChatEditor(value.chatPrompt, value.chatText);
                break;
            case "EndChatSession":
                disableChatEditor();
                break;
        };
    }

    /**
     * Open Assistant dialog box
     */
    function onOpenAssistDialog() {
        document.querySelector(".assistant button").style.display = "none";
        document.querySelector(".assistant .chat").style.display = "block";
        openWSConnection();
    }

    /**
     * Close Assistant dialog box
     */
    function onCloseAssistDialog() {
        document.querySelector(".assistant .chat").style.display = "none";
        document.querySelector(".assistant button").style.display = "block";
    }

    /**
     * Clear the cookie and restart connection to create a new session.
     */
    function onResetSession() {
        document.cookie = "Fluvio-Chat-Assistant=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

        closeWsConnection();
        clearMessages();
        openWSConnection();
    }


    /**
     * Capture chat text from and send to WS server
     */
    function onEditorKeys(e) {
        var chatBox = document.getElementById("user-msg");

        if (e.code == 'Enter' && chatBox.textContent.length > 0) {
            e.preventDefault();

            chatBox.setAttribute("contenteditable", false);
            const content = chatBox.textContent;

            sendWsMessage(JSON.stringify({
                kind: "UserText",
                sessionId: sessionId,
                content: content,
            }));

            showUserText(content);
            chatBox.innerHTML = '';
        }
    }

    function showBotText(content) {
        if (content.length > 0) {
            removeDuplicateAvatar("bot");

            var img = createElement("img", { "src": `${imgPath}/bot.svg` }),
                avatar = createElement("div", { "class": "avatar", "id": "bot" }, img),
                msg = createElement("div", { "class": "msg" }, content),
                msgLeft = createElement("div", { "class": "msg-left" }, [msg, avatar]);

            document.querySelector(".msg-body").appendChild(msgLeft);
            scrollToBottom(".inner-body");
        }
    }

    function showUserText(content) {
        if (content.length > 0) {
            var msg = createElement("div", { "class": "msg" }, content),
                msgLeft = createElement("div", { "class": "msg-right" }, msg);

            document.querySelector(".msg-body").appendChild(msgLeft);
            scrollToBottom(".inner-body");
        }
    }

    function showOperatorText(name, content) {
        if (content.length > 0) {
            removeDuplicateAvatar("operator");

            var msg = createElement("div", { "class": "msg" }, content),
                operator = createElement("div", { "class": "operator", "id": "operator" },
                    name.charAt(0).toUpperCase()),
                msgLeft = createElement("div", { "class": "msg-left" }, [msg, operator]);

            document.querySelector(".msg-body").appendChild(msgLeft);
            scrollToBottom(".inner-body");
        }
    }

    function showChoiceButtons(groupId, choices) {
        if (choices.length > 0) {
            var buttons = [];

            choices.forEach(choice => {
                var button = createElement("div", { "class": "button" }, choice.content);
                button.addEventListener('click', function () {
                    pickChoice(groupId, choice.itemId, choice.content);
                }, false);

                buttons.push(createElement("div", { "class": "btn" }, button));
            });

            var msgRight = createElement("div", { "class": "msg-right", "id": groupId }, buttons);

            document.querySelector(".msg-body").appendChild(msgRight);
            scrollToBottom(".inner-body");
        }
    }

    function pickChoice(groupId, itemId, content) {
        choicesToButton(groupId, content);

        sendWsMessage(JSON.stringify({
            kind: "ChoiceResponse",
            groupId: groupId,
            itemId: itemId,
            content: content,
        }));
    }

    function choicesToButton(groupId, content) {
        document.getElementById(groupId).remove();

        var button = createElement("div", { "class": "button selected" }, content),
            btn = createElement("div", { "class": "btn" }, button),
            msgRight = createElement("div", { "class": "msg-right" }, btn);

        document.querySelector(".msg-body").appendChild(msgRight);
        scrollToBottom(".inner-body");
    }

    function removeDuplicateAvatar(id) {
        var messages = document.querySelector('.msg-body').children;
        if (messages.length > 0) {
            var lastMessage = messages[messages.length - 1];
            if (lastMessage.getAttribute("class") === 'msg-left') {
                if (lastMessage.lastChild.id == id) {
                    lastMessage.removeChild(lastMessage.lastChild);
                }
            }
        }
    }

    function enableChatEditor(chatPrompt, chatText) {
        if (chatText) {
            showBotText(chatText);
        }

        var chatBox = document.getElementById("user-msg");
        chatBox.setAttribute("contenteditable", true);
        chatBox.setAttribute("placeholder", chatPrompt || "Type question here ...");

        chatBox.addEventListener("keydown", onEditorKeys, false);
    }

    function disableChatEditor() {
        var chatBox = document.getElementById("user-msg");
        chatBox.addEventListener("keydown", {}, false);

        chatBox.setAttribute("contenteditable", false);
        chatBox.setAttribute("placeholder", "Choose an Option");
    }

    function scrollToBottom(tag) {
        var div = document.querySelector(tag);
        div.scrollTop = div.scrollHeight - div.clientHeight;
    }

    function clearMessages() {
        removeAllChildNodes(document.querySelector('.msg-body'));
    }

    function removeAllChildNodes(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    /*******************************
     *  Helper functions
     *******************************/

    /**
     *  Create DOM element
     */
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

    /**
     *  Load external javascript file to DOM
     */
    function loadScript(fileName) {
        var js_script = document.createElement('script');
        js_script.type = "text/javascript";
        js_script.src = fileName;
        js_script.async = false;
        document.getElementsByTagName('head')[0].appendChild(js_script);
    }

    /**
     * Send a message on WebSocket
     */
    function sendWsMessage(msg) {
        if (webSocket.readyState != WebSocket.OPEN) {
            logOutput("WebSocket is not connected: " + webSocket.readyState);
            return;
        }
        webSocket.send(msg);
    }

    /**
     * Log to console and debug window if enabled
     */
    function logOutput(value) {
        var debugOutput = document.getElementById("debugOutput");
        if (debugOutput) {
            debugOutput.value += value + "\n\n";
            debugOutput.scrollTop = debugOutput.scrollHeight;
        }
        console.log(value);
    }

    loadAssistant();
};
