const axios = require("axios");
const fs = require("fs");
const path = require("path");

const name = "fbcover";

module.exports = {
  name,
  description: "Generates a Facebook cover image and sends it as an attachment",
  async run({ api, send, args }) {
    // Parse arguments
    const [fullName, subName, phone, address, email, color = "Cyan"] = args.join(" ").split("|").map(arg => arg.trim());

    // Check if all necessary arguments are provided
    if (!fullName || !subName || !phone || !address || !email) {
      return send(`Usage: ${api.prefix + name} [Name] | [Subname] | [Phone] | [Address] | [Email] | [Color (optional)]`);
    }

    try {
      // Construct the API URL
      const url = `https://deku-rest-apis.ooguy.com/canvas/fbcover?name=${encodeURIComponent(fullName)}&subname=${encodeURIComponent(subName)}&sdt=${encodeURIComponent(phone)}&address=${encodeURIComponent(address)}&email=${encodeURIComponent(email)}&color=${encodeURIComponent(color)}&uid=4`;

      // Define the file path for saving the image
      const filePath = path.resolve(__dirname, "fbcover_image.jpg");

      // Fetch the image from the API
      const response = await axios({
        method: "get",
        url: url,
        responseType: "stream",
      });

      // Save the image to the file system
      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      // Wait until the file is completely written
      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      // Send the image as an attachment
      send({
        attachment: {
          type: "image",
          payload: {
            url: `file://${filePath}`
          }
        }
      });

      // Optionally delete the file after sending
      fs.unlinkSync(filePath);

    } catch (error) {
      // Error handling
      send("Error generating the Facebook cover. Please check your input and try again.\n" + (error.message || error));
    }
  }
};
