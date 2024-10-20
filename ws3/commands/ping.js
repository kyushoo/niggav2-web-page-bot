module.exports = {
  name: "ping", // Command name
  description: "Replies with pong when pinged", // Description of the command
  async run({
    api, // API object
    event, // Event object
    send // Function to send a message
  }) {
    send("pong"); // Responds with "pong"
  }
}
