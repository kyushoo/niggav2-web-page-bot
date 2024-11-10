module.exports = {
  description: "See available commands",
  async run({ api, send, admin }) {
    const quick_replies = [];
    let commandsList = "🤖 | These are the available commands for KYLE'S BOT:\n\n";
    
    // Generate quick replies and command list
    api.commands.forEach((name) => {
      quick_replies.push({
        content_type: "text",
        title: api.prefix + name,
        payload: name.toUpperCase()
      });
      commandsList += `🔹 ${api.prefix}${name}\n`;
    });

    try {
      send({
        quick_replies,
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text: `${commandsList}\n🔎 | Click every command to see the usage or contact the admin below.`,
            buttons: [
              {
                type: "web_url",
                url: "https://www.facebook.com/kylepogiv20",
                title: "Contact Admin"
              }
            ]
          }
        }
      });
    } catch (err) {
      return send(err.message || err);
    }
  }
};
