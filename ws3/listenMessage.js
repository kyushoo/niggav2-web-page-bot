const api = require('./api');

const getStarted = async (send) => {
    return send({
        attachment: {
            type: "template",
            payload: {
                template_type: "button",
                text: api.introduction,
                buttons: [
                    { type: "postback", title: "Commands", payload: "HELP" },
                    { type: "postback", title: "Prefix", payload: "PREFIX" }
                ]
            }
        }
    });
};

const listenMessage = async (event, pageAccessToken) => {
    const senderID = event.sender.id;
    const message = event.message.text;

    if (!senderID || !message) return;

    const send = async text => api.sendMessage(senderID, typeof text === "object" ? text : { text }, pageAccessToken);
    const [command, ...args] = message.trim().toLowerCase().split(/\s+/).map(arg => arg.trim());
    const admin = api.admin.includes(senderID);
    const hasPrefix = api.prefix && message.startsWith(api.prefix);

    console.log(`Received message: "${message}"`);
    console.log(`Parsed command: "${command}", Args: "${args}"`);

    // Fix: Respond if there's a prefix or no prefix
    if (api.prefix && !hasPrefix) {
        return send(`You must use my prefix "${api.prefix}" to send commands.`);
    } else if (!api.prefix) {
        return send(`I don't have a prefix. You can type commands directly.`);
    }

    // Handle recognized bot greetings without a prefix
    if (["hi", ".", "chilli", "yo", "get started", "hello", "bot"].includes(message.toLowerCase().trim())) {
        return getStarted(send);
    }

    // Fix: Execute the command correctly, handle prefix
    const commandToExecute = hasPrefix ? message.slice(api.prefix.length).trim() : command;

    // Execute the command if it exists
    if (api.commands.includes(commandToExecute)) {
        const commandJs = require(api.cmdLoc + `/${commandToExecute}`);
        if (commandJs.admin && !admin) {
            return send({
                text: `❌ Command "${commandToExecute}" is for admins only.`,
                quick_replies: [{ content_type: "text", title: `help`, payload: "HELP" }]
            });
        }
        await (commandJs.run || (() => {}))({ api, event, send, admin, args });
    } else if (hasPrefix) {
        return send({
            text: `❌ Command "${commandToExecute}" doesn't exist! Type or click (below) help to see available commands.`,
            quick_replies: [{ content_type: "text", title: `help`, payload: "HELP" }]
        });
    }
};

const listenPostback = async (event, pageAccessToken) => {
    const senderID = event.sender.id;
    const postbackPayload = event.postback.payload;
    const send = async text => api.sendMessage(senderID, typeof text === "object" ? text : { text }, pageAccessToken);
    const payload = postbackPayload.toLowerCase().trim();

    if (!senderID || !payload) return;

    if (payload === "get_started") {
        return getStarted(send);
    } else if (payload === "prefix") {
        return api.prefix ? send(`My prefix is: "${api.prefix}"`) : send(`I don't have a prefix. You can type commands directly.`);
    } else {
        const admin = api.admin.includes(senderID);
        if (api.commands.includes(payload)) {
            const commandJs = require(api.cmdLoc + `/${payload}`);
            if (commandJs.admin && !admin) {
                return send("This command is for admins only.");
            }
            await (commandJs.run || (() => {}))({ api, event, send, admin });
        }
    }
};

module.exports = async (event, pageAccessToken) => {
    if (event.message) {
        return listenMessage(event, pageAccessToken);
    } else if (event.postback) {
        return listenPostback(event, pageAccessToken);
    }
};
