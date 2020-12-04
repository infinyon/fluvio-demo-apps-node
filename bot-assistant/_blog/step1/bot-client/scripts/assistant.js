window.onload = () => {

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
    }

    // On close assistant dialog callback
    function onCloseDialog() {
        document.querySelector(".assistant .chat").style.display = "none";
        document.querySelector(".assistant button").style.display = "block";
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
};