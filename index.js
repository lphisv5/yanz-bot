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

// ===== Command Collection =====
client.commands = new Collection();

// ===== Load Commands =====
for (const folder of fs.readdirSync("./commands")) {
  const files = fs
    .readdirSync(`./commands/${folder}`)
    .filter(file => file.endsWith(".js"));

  for (const file of files) {
    const command = require(`./commands/${folder}/${file}`);
    if (!command.name || !command.execute) continue;
    client.commands.set(command.name, command);
  }
}

// ===== Load Events =====
for (const file of fs.readdirSync("./events").filter(f => f.endsWith(".js"))) {
  const event = require(`./events/${file}`);
  if (!event.name || !event.execute) continue;
  client.on(event.name, (...args) => event.execute(...args, client));
}

// ===== Express (Render Health Check) =====
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.status(200).send("Bot is running");
});

app.listen(PORT, () => {
  console.log(`Web server running on port ${PORT}`);
});

// ===== Discord Login =====
if (!process.env.TOKEN) {
  console.error("❌ TOKEN is missing in environment variables");
  process.exit(1);
}

client.login(process.env.TOKEN);
