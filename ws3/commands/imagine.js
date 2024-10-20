const axios = require("axios");
const fs = require("fs");
const path = require("path");
const name = "imagine";

module.exports = {
  name,
  description: "Generates an image based on your prompt using Chillit's API",
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
      const imagePath = path.join(__dirname, "generated_image.jpg");

      // Download the image and save it locally
      const imageResponse = await axios({
        url: imageUrl,
        method: 'GET',
        responseType: 'stream'
      });

      // Save the image to a local file
      const writer = fs.createWriteStream(imagePath);
      imageResponse.data.pipe(writer);

      // Wait for the download to complete
      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      // Send the image as an attachment
      await send({
        attachment: {
          type: "image",
          payload: {
            path: imagePath
          }
        }
      });

      // Optionally, delete the file after sending
      fs.unlinkSync(imagePath);
      
    } catch (error) {
      send("Error while generating your image. Please try again.\n" + (error.message || error));
    }
  }
}
