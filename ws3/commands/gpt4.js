const axios = require("axios");

const name = "gpt4";
const gothicFont = {
  A: "𝖠", B: "𝖡", C: "𝖢", D: "𝖣", E: "𝖤", F: "𝖥", G: "𝖦", H: "𝖧", I: "𝖨", J: "𝖩", K: "𝖪", L: "𝖫", M: "𝖬", N: "𝖭", O: "𝖮", P: "𝖯", Q: "𝖰", R: "𝖱",
  S: "𝖲", T: "𝖳", U: "𝖴", V: "𝖵", W: "𝖶", X: "𝖷", Y: "𝖸", Z: "𝖹", 
  a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂",
  j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆", n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋",
  s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
  0: "𝟢", 1: "𝟣", 2: "𝟤", 3: "𝟥", 4: "𝟦", 5: "𝟧", 6: "𝟨", 7: "𝟩", 8: "𝟪", 9: "𝟫"
};

const convertToGothic = (text) => {
  return text.split('').map(char => gothicFont[char] || char).join('');
};

const splitMessageIntoChunks = (message, chunkSize) => {
  const regex = new RegExp(`.{1,${chunkSize}}`, 'g');
  return message.match(regex);
};

module.exports = {
  name,
  description: "Interact with GPT-4 using a custom API and receive responses in Gothic font.",
  author: "Churchill",
  async run({ api, send, args }) {
    const prompt = args.join(" ");
    if (!prompt) return send(`Usage: ${api.prefix + name} [your question]`);

    send("Processing your request...");

    try {
      const response = await axios.get("https://betadash-api-swordslush.vercel.app/gpt-4-v2", {
        params: { ask: prompt }
      });

      const result = convertToGothic(response.data.message);
      const maxMessageLength = 2000;
      const delayBetweenMessages = 1000; // 1 second

      if (result.length > maxMessageLength) {
        const messages = splitMessageIntoChunks(result, maxMessageLength);

      
        send(messages[0]);

      
        messages.slice(1).forEach((message, index) => {
          setTimeout(() => send(message), (index + 1) * delayBetweenMessages);
        });
      } else {
        send(result);
      }

    } catch (error) {
      send("Error while processing your request. Please try again.\n" + (error.message || error));
    }
  }
};
