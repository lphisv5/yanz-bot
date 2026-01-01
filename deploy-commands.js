const { REST, Routes } = require("discord.js");
const fs = require("fs");

const commands = [];

for (const folder of fs.readdirSync("./commands")) {
  for (const file of fs.readdirSync(`./commands/${folder}`).filter(f => f.endsWith(".js"))) {
    const command = require(`./commands/${folder}/${file}`);
    if (command.data) commands.push(command.data.toJSON());
  }
}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Registering slash commands...");
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log("Slash commands registered");
  } catch (err) {
    console.error(err);
  }
})();
