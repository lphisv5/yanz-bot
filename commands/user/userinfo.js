const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Show information about a user")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("Select a user")
        .setRequired(false)
    ),

  async execute(interaction) {

    // ===== defer (แทน $botTyping) =====
    await interaction.deferReply({ ephemeral: false });

    const user =
      interaction.options.getUser("user") || interaction.user;

    if (!user) {
      return interaction.editReply("This user doesn't exist!");
    }

    // ===== fetch member =====
    const member = await interaction.guild.members.fetch(user.id);

    const color = member.displayHexColor || "#2f3136";

    const roles = member.roles.cache
      .filter(r => r.id !== interaction.guild.id)
      .map(r => r.toString())
      .join(", ") || "None";

    const perms = member.permissions.toArray().join(", ");

    // ===== acknowledgements =====
    const acknowledgements = [];

    if (member.permissions.has(PermissionsBitField.Flags.Administrator))
      acknowledgements.push("Server Admin");

    if (member.permissions.has(PermissionsBitField.Flags.ManageGuild))
      acknowledgements.push("Server moderator");

    if (member.permissions.has(PermissionsBitField.Flags.ManageMessages))
      acknowledgements.push("Helper");

    if (member.permissions.has(PermissionsBitField.Flags.ViewChannel))
      acknowledgements.push("Server member");

    // ===== badges / hypesquad =====
    const badges =
      user.flags?.toArray()
        .map(b =>
          b.replace("HypeSquadOnlineHouse1", "Hypesquad bravery")
           .replace("HypeSquadOnlineHouse2", "Hypesquad brilliance")
           .replace("HypeSquadOnlineHouse3", "Hypesquad balance")
        )
        .join(", ") || "None";

    const embed = new EmbedBuilder()
      .setAuthor({
        name: user.username,
        iconURL: user.displayAvatarURL({ dynamic: true })
      })
      .setTitle("User info")
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .setImage(user.bannerURL({ size: 1024 }))
      .setDescription(`<@${user.id}>`)
      .addFields(
        {
          name: "Username",
          value: `${user.username}#${user.discriminator}`
        },
        {
          name: "Badges",
          value: badges
        },
        {
          name: "Joined server on",
          value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:f>`
        },
        {
          name: "Joined discord on",
          value: `<t:${Math.floor(user.createdTimestamp / 1000)}:f>`
        },
        {
          name: "User acknowledgements",
          value: acknowledgements.join("\n") || "None"
        },
        {
          name: "User permissions",
          value: `\`${perms}\``
        },
        {
          name: "Roles",
          value: roles
        }
      )
      .setFooter({ text: `ID: ${user.id}` })
      .setColor(color)
      .setTimestamp();

    await interaction.editReply({
      embeds: [embed],
      allowedMentions: { repliedUser: false }
    });
  }
};
