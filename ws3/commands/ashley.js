const axios = require('axios');

module.exports = {
  name: "ashley",
  description: "Sends a message using the Ashley API",

  async run({ event, args, send }) {

    if (args.length < 1) {
      await send("Please provide a query for Ashley. Example: ashley hi", event.threadID, event.messageID);
      return;
    }

    const query = args.join(" "); 

    try {
      
      const apiUrl = `https://markdevs69v2-679r.onrender.com/new/api/ashley?query=${encodeURIComponent(query)}`;

  
      const response = await axios.get(apiUrl);
      const { result } = response.data;  

    
      await send(result);

    } catch (error) {
      await send(`Failed to get a response from Ashley. Error: ${error.message || error}`);
    }
  }
};
