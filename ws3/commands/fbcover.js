const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: "fbcover",
  description: "Generates a Facebook cover image",

  async run({ event, args, send }) {
    const input = args.join(' ').trim();
    const userInputs = input.split('|').map(arg => arg.trim());

    if (userInputs.length < 6) {
      await send("Please provide all necessary details in the format: fbcover name | subname | sdt | address | email | color", event.threadID, event.messageID);
      return;
    }

    const [name, subname, sdt, address, email, color] = userInputs;

    try {
      await send("Generating your Facebook cover...", event.threadID, event.messageID);

      // Build the API URL
      const apiUrl = `https://deku-rest-apis.ooguy.com/canvas/fbcover?name=${encodeURIComponent(name)}&subname=${encodeURIComponent(subname)}&sdt=${encodeURIComponent(sdt)}&address=${encodeURIComponent(address)}&email=${encodeURIComponent(email)}&color=${encodeURIComponent(color)}`;

      // Define the local path to save the cover image
      const imgPath = path.resolve(__dirname, `${name}_fbcover.png`);
      const writer = fs.createWriteStream(imgPath);

      // Download the cover image
      const response = await axios({
        url: apiUrl,
        method: 'GET',
        responseType: 'stream',
      });

      // Pipe the response to save the image
      response.data.pipe(writer);

      // When the download finishes, send the image as an attachment
      writer.on('finish', async () => {
        const imageData = fs.readFileSync(imgPath);  // Read the file data

        // Send the image as an attachment without any extra reusable options
        await send({
          attachment: {
            type: "image"
          },
          file: imageData  // The image data as a file
        }, event.threadID, event.messageID);

        // Clean up: Delete the image file after sending
        fs.unlinkSync(imgPath);
      });

      writer.on('error', (error) => {
        send(`Error downloading the cover image: ${error.message}`);
      });

    } catch (error) {
      await send(`Failed to generate Facebook cover. Error: ${error.message || error}`);
    }
  }
};
