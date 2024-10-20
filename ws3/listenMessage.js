const api = require('./api');

const getStarted = async (send) => send({
    attachment: {
        type: "template",
        payload: {
            template_type: "button",
            text: api.introduction,
            buttons: [
                {
                    type: "postback",
                    title: "Commands",
                    payload: "HELP"
                },
                {
                    type: "postback",
                    title: "Prefix",
                    payload: "PREFIX"
                }
            ]
        }
    }
});

const listenMessage = async (event, pageAccessToken) => {
    const senderID = event.sender.id;
    const message = event.message.text;
    if (!senderID || !message) return;

    const send = async text => api.sendMessage(senderID, typeof text === "object" ? text : { text }, pageAccessToken);

    const [command, ...args] = message.trim().toLowerCase().split(/\s+/).map(arg => arg.trim());
    const originalMessage = message.split(' ')[0];
    const admin = api.admin.some(id => id === senderID);

    const hasPrefix = api.prefix && message.startsWith(api.prefix);

    // Debugging log
    console.log(`Received message: "${message}"`);
    console.log(`Parsed command: "${command}", Args: "${args}"`);

    if (message.toLowerCase().trim() === "prefix") {
        if (!api.prefix) {
            return send(`I don't have a prefix. You can just type commands directly.`);
        } else {
            return send(`My prefix is: "${api.prefix}"`);
        }
    }

    switch (message.toLowerCase().trim()) {
        default: {
            if (!message) return;

            if (["hi", ".", "chilli", "yo", "get started", "hello", "bot"]
                .some(text => text === message.toLowerCase().trim())) {
                return getStarted(send);
            }

            // Allow both prefixed and unprefixed commands
            const commandToExecute = hasPrefix ? command.replace(api.prefix, '') : command;

            console.log(`Command to execute: "${commandToExecute}"`);

            if (api.commands.some(cmd => cmd === commandToExecute)) {
                const commandJs = require(api.cmdLoc + `/${commandToExecute}`);
                if (commandJs.admin && !admin) {
                    return send({
                        text: `❌ Command "${originalMessage}" is for admins only.`,
                        quick_replies: [
                            {
                                content_type: "text",
                                title: `help`,
                                payload: "HELP"
                            }
                        ]
                    });
                }

                await (commandJs.run || (() => {}))({
                    api,
                    event,
                    send,
                    admin,
                    args
                });
            } else {
                return send({
                    text: `❌ Command "${originalMessage}" doesn't exist! Type or click (below) help to see available commands.`,
                    quick_replies: [
                        {
                            content_type: "text",
                            title: `help`,
                            payload: "HELP"
                        }
                    ]
                });
            }
        }
    }
};

const listenPostback = async (event, pageAccessToken) => {
    const senderID = event.sender.id;
    const postbackPayload = event.postback.payload;
    const send = async text => api.sendMessage(senderID, typeof text === "object" ? text : { text }, pageAccessToken);
    const payload = postbackPayload.toLowerCase().trim();
    if (!senderID || !payload) return;

    switch (payload) {
        case "get_started": {
            return getStarted(send);
        }
        case "prefix": {
            if (!api.prefix) {
                return send(`I don't have a prefix. You can just type commands directly.`);
            } else {
                return send(`My prefix is: "${api.prefix}"`);
            }
        }
        default: {
            const admin = api.admin.some(id => id === senderID);
            if (payload && api.commands.some(cmd => cmd === payload)) {
                const commandJs = require(api.cmdLoc + `/${payload}`);
                if (commandJs.admin && !admin) {
                    return send("This command is for admins only.");
                }

                await (commandJs.run || (() => {}))({
                    api,
                    event,
                    send,
                    admin
                });
            } else return;
        }
    }
};

module.exports = async (event, pageAccessToken) => {
    if (event.message) listenMessage(event, pageAccessToken);
    else if (event.postback) listenPostback(event, pageAccessToken);
};
