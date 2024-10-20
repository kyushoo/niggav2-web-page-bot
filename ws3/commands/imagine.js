const axios = require("axios");
const name = "imagine";

module.exports = {
  name,
  description: "Generates an image based on a prompt",
  async run({ api, send, args }) {
    const prompt = args.join(" ");
    if (!prompt) {
      return send(`Usage: ${api.prefix + name} [your desired prompt]`);
    }
    send("Generating the image, please wait...");

    try {
      const imageResponse = await axios.get("https://ccprojectapis.ddns.net/api/imgen", {
        params: { prompt }
      });

      // Directly using the response data in the payload
      await send({
        attachment: {
          type: "image",
          payload: {
            url: imageResponse.data,
            is_reusable: true
          }
        }
      });

      send(`Image for prompt "${prompt}" generated successfully!`);

    } catch (error) {
      send("Error generating image. Please try again or use a different prompt.\n" + error.message || error);
    }
  }
};
