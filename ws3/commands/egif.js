const fs = require("fs");
const path = require("path");
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

      // Download and save the GIF
      const gifPath = path.resolve(__dirname, 'temp.gif');
      const response = await axios({
        url: gifUrl,
        method: 'GET',
        responseType: 'stream',
      });

      response.data.pipe(fs.createWriteStream(gifPath));

      response.data.on('end', async () => {
        await send({
          attachment: fs.createReadStream(gifPath),
        });
        send(`Here is your GIF for the emoji: ${emoji}`);
        
        // Optionally, delete the GIF after sending it
        fs.unlinkSync(gifPath);
      });

      response.data.on('error', (err) => {
        throw new Error(`Error while downloading the GIF: ${err.message}`);
      });

    } catch (error) {
      send(`Error while converting emoji to GIF. Please try again.\nDetails: ${error.message || error}`);
    }
  }
};
