const axios = require('axios');

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

      const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });  // Fetch as arraybuffer to handle binary data
      const imageBuffer = Buffer.from(response.data, 'binary');  // Convert the data to a buffer

      await send({
        attachment: {
          type: 'image',
          payload: {
            is_reusable: true  // Add if the platform supports reusable media, otherwise omit this
          },
          data: imageBuffer  // Send the buffer as image data
        }
      }, event.threadID, event.messageID);

    } catch (error) {
      await send(`Failed to generate Facebook cover. Error: ${error.message || error}`);
    }
  }
};
