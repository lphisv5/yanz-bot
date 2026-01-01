const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// Load Commands
client.commands = new Collection();
for (const folder of fs.readdirSync("./commands")) {
  for (const file of fs.readdirSync(`./commands/${folder}`).filter(f => f.endsWith(".js"))) {
    const cmd = require(`./commands/${folder}/${file}`);
    client.commands.set(cmd.data.name, cmd);
  }
}

// Load Interactions
for (const file of fs.readdirSync("./events").filter(f => f.endsWith(".js"))) {
  const event = require(`./events/${file}`);
  client.on(event.name, (...args) => event.execute(...args, client));
}

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.login(process.env.TOKEN);
