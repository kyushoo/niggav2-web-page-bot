const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: "tiksearch",
  description: "Search videos on TikTok and send the video as an attachment",
  async run({ api, event, send }) {
    const query = event.body.slice(10); // Assume the command is triggered with 'tiksearch <query>'
    
    if (!query) {
      return send("Please provide a search query.");
    }

    try {
      // Fetch search results from the TikTok API
      const response = await axios.get(`https://markdevs69v2-679r.onrender.com/new/api/tiksearch?search=${encodeURIComponent(query)}`);
      
      const data = response.data;
      
      if (data.code !== 0 || !data.data || !data.data.videos || data.data.videos.length === 0) {
        return send("No videos found for the search query.");
      }

      // Take the first video from the response
      const video = data.data.videos[0];
      const videoUrl = video.play;

      // Download the video locally
      const videoPath = path.join(__dirname, 'temp_video.mp4');
      const videoStream = fs.createWriteStream(videoPath);
      
      const downloadResponse = await axios({
        method: 'GET',
        url: videoUrl,
        responseType: 'stream',
      });

      downloadResponse.data.pipe(videoStream);

      videoStream.on('finish', async () => {
        // Send the video as an attachment
        await send({
          attachment: {
            type: "video",
            payload: {
              url: videoPath // Path to the downloaded video
            }
          }
        });

        // Optionally, delete the video after sending
        fs.unlinkSync(videoPath);
      });

    } catch (error) {
      // Handle any errors during the request
      console.error(error);
      send("An error occurred while searching for TikTok videos.");
    }
  }
};
