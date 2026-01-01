module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (message.author.bot) return;
    const prefix = "!";

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();

    const command = client.commands.get(cmd);
    if (!command) return;

    try {
      await command.execute(message, args, client);
    } catch (err) {
      console.error(err);
      message.reply("Command error");
    }
  }
};
