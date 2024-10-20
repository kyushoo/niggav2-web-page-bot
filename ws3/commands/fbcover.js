const axios = require('axios');

module.exports = {
  name: "fbcover",
  description: "Generates a Facebook cover image",

  async run({ event, args, send }) {
    // Checking if user provided all necessary details
    if (args.length < 6) {
      await send("Please provide all necessary details in the format: fbcover name | subname | sdt | address | email | color", event.threadID, event.messageID);
      return;
    }

    const [name, subname, sdt, address, email, color] = args;

    try {
      // Construct the API URL
      const apiUrl = `https://deku-rest-apis.ooguy.com/canvas/fbcover?name=${encodeURIComponent(name)}&subname=${encodeURIComponent(subname)}&sdt=${encodeURIComponent(sdt)}&address=${encodeURIComponent(address)}&email=${encodeURIComponent(email)}&color=${encodeURIComponent(color)}`;

      // Requesting the image from the Canva API
      const response = await axios.get(apiUrl);
      const imageUrl = response.data;  // Assuming the API returns the image URL directly

      // Sending the image as an attachment
      await send({
        attachment: {
          type: "image",
          payload: {
            url: imageUrl  // Directly using the URL
          }
        }
      });

    } catch (error) {
      await send(`Failed to generate Facebook cover. Error: ${error.message || error}`);
    }
  }
};
