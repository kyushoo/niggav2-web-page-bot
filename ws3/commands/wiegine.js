const axios = require("axios");
const name = "wiegine";
module.exports = {
  name,
  description: "Interact with me!",
  async run({ api, send, args }){
    try {
    const user = args.join(" ");
    if (!user) throw new Error(`Usage: ${api.prefix + name} [your question]`);
    send("I will respond to your question right now sweetie 👩‍❤️‍💋‍👩👸");
    const aIpi = await axios.get(api.echavie + "/wiegine", {
      params: {
        q: user
      }
    });
    if (!aIpi || !aIpi.data.success) throw new Error(aIpi.data.error || aIpi.data);
    return send(aIpi.data.result);
    } catch (error) {
      return send("An error occured. Try again later or use another command.\n\n" + error.message || error);
    }
  }
}