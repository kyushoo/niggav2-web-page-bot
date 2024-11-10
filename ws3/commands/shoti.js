const axios = require('axios');

module.exports = {
  name: "shoti",
  description: "Nagpapadala ng random na shoti video",

  async run({ event, send }) {
    try {
      const response = await axios.get('https://betadash-shoti-yazky.vercel.app/shotizxx?apikey=shipazu');
      const { shotiurl: pogiurl, username: chilliName, nickname: pogiName, duration: pogiDuration } = response.data;

      await send(`Username: ${chilliName}\nNickname: ${pogiName}\nDuration: ${pogiDuration} seconds`);

      await send({
        attachment: {
          type: "video",
          payload: {
            url: pogiurl
          }
        }
      });

    } catch (error) {
      await send(`Nabigong kunin ang shoti video. Error: ${error.message || error}`);
    }
  }
};
