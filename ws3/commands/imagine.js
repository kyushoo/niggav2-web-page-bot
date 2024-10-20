const axios = require("axios");
const name = "imagine";

module.exports = {
  name,
  description: "Generates an image based on your prompt using the Chillit's API",
  async run({ api, send, args }) {
    const prompt = args.join(" ");
    if (!prompt) 
      return send(`Usage: ${api.prefix + name} [your desired prompt]`);

    send("Generating image, please wait...");

    try {
      const response = await axios.get("https://ccprojectapis.ddns.net/api/imagine", {
        params: { prompt }
      });

      if (!response.data || !response.data.result) throw new Error();

      const imageUrl = response.data.result.image;

      await send({
        attachment: {
          type: "image",
          payload: {
            url: imageUrl,
            is_reusable: true
          }
        }
      });

      send(`Your image based on the prompt "${prompt}" has been created successfully!\nImage link: ${imageUrl}`);
    } catch (error) {
      send("Error while generating your image. Please try again.\n" + (error.message || error));
    }
  }
}
