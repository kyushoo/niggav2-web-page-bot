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

      const apiUrl = `https://deku-rest-apis.ooguy.com/canvas/fbcover?name=${encodeURIComponent(name)}&subname=${encodeURIComponent(subname)}&sdt=${encodeURIComponent(sdt)}&address=${encodeURIComponent(address)}&email=${encodeURIComponent(email)}&color=${encodeURIComponent(color)}`;

      const response = await axios.get(apiUrl, { responseType: 'stream' }); 
      const imagePath = path.join(__dirname, 'fbcover.jpg'); 

      const writer = fs.createWriteStream(imagePath);
      response.data.pipe(writer);

      writer.on('finish', async () => {
        await send({
          attachment: {
            type: 'image',  // Specify the type as image
            payload: {
              url: imagePath  // Provide the path to the image
            }
          }
        }, event.threadID, event.messageID);

        fs.unlinkSync(imagePath);  // Clean up the saved image after sending
      });

      writer.on('error', async (err) => {
        await send(`Failed to save the image. Error: ${err.message || err}`);
      });

    } catch (error) {
      await send(`Failed to generate Facebook cover. Error: ${error.message || error}`);
    }
  }
};
