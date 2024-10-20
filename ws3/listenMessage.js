// Assuming 'api' is initialized earlier and has necessary values such as commands, prefix, admin list, etc.

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

    // Ensure message and sender are present
    if (!senderID || !message) return;

    const send = async text => api.sendMessage(senderID, typeof text === "object" ? text : { text }, pageAccessToken);

    // Handle command processing
    const [command, ...args] = message.trim().toLowerCase().split(/\s+/).map(arg => arg.trim());
    const originalMessage = message.split(' ')[0];
    const admin = api.admin.includes(senderID);
    const hasPrefix = api.prefix && message.startsWith(api.prefix);

    console.log(`Received message: "${message}"`);
    console.log(`Parsed command: "${command}", Args: "${args}"`);

    // Handle cases where prefix is required but not provided
    if (api.prefix && !hasPrefix) {
        return send(`This is a regular message, not a command. My prefix is: "${api.prefix}".`);
    }

    // Handle simple greetings or non-command phrases
    if (["hi", ".", "chilli", "yo", "get started", "hello", "bot"].includes(message.toLowerCase().trim())) {
        return getStarted(send);
    }

    // If a prefix exists, strip it from the command
    const commandToExecute = hasPrefix ? command.replace(api.prefix, '') : command;

    // Handle command execution if it exists in the api.commands
    if (api.commands.includes(commandToExecute)) {
        try {
            const commandJs = require(api.cmdLoc + `/${commandToExecute}`);
            if (commandJs.admin && !admin) {
                return send({
                    text: `❌ Command "${originalMessage}" is for admins only.`,
                    quick_replies: [{ content_type: "text", title: `help`, payload: "HELP" }]
                });
            }
            await (commandJs.run || (() => {}))({ api, event, send, admin, args });
        } catch (error) {
            console.error(`Error executing command "${commandToExecute}":`, error);
            return send(`❌ Failed to execute the command "${originalMessage}".`);
        }
    } else if (hasPrefix) {
        // Command not found
        return send({
            text: `❌ Command "${originalMessage}" doesn't exist! Type or click (below) help to see available commands.`,
            quick_replies: [{ content_type: "text", title: `help`, payload: "HELP" }]
        });
    }
};

// Postback handler remains the same
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
