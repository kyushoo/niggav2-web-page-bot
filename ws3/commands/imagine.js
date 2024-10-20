const axios = require("axios");

module.exports = {
  name: "imagine",
  description: "Generates an image based on your prompt using the new API",
  async run({ api, send, args }) {
    const chilli = args.join(" ");
    if (!chilli) 
      return send(`Usage: ${api.prefix + name} [your desired prompt]`);

    send("Generating image, please wait...");

    try {
      const apiUrl = `https://www.samirxpikachu.run.place/ArcticFL?prompt=${encodeURIComponent(chilli)}--styles+3`;

      const h = await axios.get(apiUrl, { responseType: 'stream' });

      await send({
        attachment: {
          type: 'image',
          payload: {
            url: h.data,
            is_reusable: true
          }
        }
      });

    } catch (error) {
      send("Error while generating your image. Please try again.\n" + (error.message || error));
    }
  }
}
