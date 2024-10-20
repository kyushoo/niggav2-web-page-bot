const axios = require("axios");

module.exports = {
  name: "egif",
  description: "Converts an emoji into a GIF",
  async run({ api, send, args }) {
    const emoji = args.join(" ");

    if (!emoji) {
      return send(`Usage: ${api.prefix}egif [emoji]`);
    }

    try {
      const { data } = await axios.get(`${api.api_josh}/emoji2gif`, {
        params: { q: emoji },
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
          },
        },
      });

      send(`Here is your GIF for the emoji: ${emoji}`);
    } catch (error) {
      console.error(error);
      send(`Error while converting emoji to GIF. Please try again.\nDetails: ${error.message || error}`);
    }
  },
};
