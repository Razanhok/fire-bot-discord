exports.run = (client, msg) => {
  msg.reply("You can't invite Fire Bot to another guild.");
};

exports.help = {
  name: "invite",
  description: "Displays the join server link of the bot.",
  usage: "",
  usageDelim: "",
};

exports.conf = {
  enabled: false,
  runIn: ["text"],
  aliases: [],
  permLevel: 0,
  botPerms: [],
  requiredFuncs: [],
};
