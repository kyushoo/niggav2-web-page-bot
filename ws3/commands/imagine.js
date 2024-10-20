const axios = require("axios");
const name = "imagine";

module.exports = {
  name,
  test: true,
  description: "Generates an image based on a prompt",
  async run({ api, send, args }) {
    const prompt = args.join(" ");
    if (!prompt) {
      return send(`Usage: ${api.prefix + name} [your desired prompt]`);
    }
    send("Generating the image, please wait...");
    try {
      const imageUrl = `${api.jonel}/api/imgen?prompt=${encodeURIComponent(prompt)}`
      await send({
        attachment: {
          type: "image",
          payload: {
            url: imageUrl,
            is_reusable: true
          }
        }
      });
      return send(`Image for prompt "${prompt}" generated successfully!`);
    } catch (error) {
      send("Error generating image. Please try again or use a different prompt.\n" + error.message || error);
    }
  }
};
