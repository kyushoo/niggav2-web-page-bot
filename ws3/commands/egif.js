const axios = require("axios");
const name = "egif";

module.exports = {
  name,
  description: "Converts an emoji into a GIF",
  async run({ api, send, args }) {
    const emoji = args.join(" ");
    
    if (!emoji) {
      return send(`Usage: ${api.prefix + name} [emoji]`);
    }

    send("Converting your emoji into a GIF, please wait...");

    try {
      const { data } = await axios.get(`${api.api_josh}/emoji2gif`, {
        params: { q: emoji }
      });

      if (!data || !data.result || !data.result.gif) {
        throw new Error("Failed to retrieve GIF.");
      }

      const gifUrl = data.result.gif;

      await send({
        attachment: {
          type: "image",
          payload: {
            url: gifUrl,
            is_reusable: true
          }
        }
      });

      send(`Here is your GIF for the emoji: ${emoji}`);
      
    } catch (error) {
      send(`Error while converting emoji to GIF. Please try again.\nDetails: ${error.message || error}`);
    }
  }
}
