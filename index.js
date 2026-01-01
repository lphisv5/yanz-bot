const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const express = require("express");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.commands = new Collection();

// load commands
for (const folder of fs.readdirSync("./commands")) {
  for (const file of fs.readdirSync(`./commands/${folder}`).filter(f => f.endsWith(".js"))) {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.name, command);
  }
}

// load events
for (const file of fs.readdirSync("./events").filter(f => f.endsWith(".js"))) {
  const event = require(`./events/${file}`);
  client.on(event.name, (...args) => event.execute(...args, client));
}

// express (กัน sleep)
const app = express();
app.get("/", (req, res) => res.send("Bot alive"));
app.listen(3000);

client.login(process.env.TOKEN);
