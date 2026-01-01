module.exports = {
  name: "ready",
  execute(client) {
    console.log(`Online as ${client.user.tag}`);
  }
};
