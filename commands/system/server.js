const Discord = require("discord.js");
const moment = require("moment");

exports.run = (client, msg) => {
  const embed = new Discord.RichEmbed();
  if (msg.guild.iconURL !== null) embed.setThumbnail(msg.guild.iconURL);
  embed.setColor(39423);
  embed.addField(msg.guild.name, "Server stats");
  embed.addField("Members", msg.guild.memberCount, true);
  let onlineMembers = "error";
  onlineMembers = msg.guild.members.filterArray((guildMember) => {
    if (guildMember.user.presence.status !== "offline") return true;
    return false;
  }).length;
  embed.addField("Members online", onlineMembers, true);
  embed.setFooter(`Stats from ${moment().format("MMMM Do YYYY, h:mm:ss a")}`);
  msg.channel.sendEmbed(embed);
};

exports.conf = {
  enabled: true,
  runIn: ["text"],
  aliases: ["sstats", "s"],
  permLevel: 0,
  botPerms: [],
  requiredFuncs: [],
};

exports.help = {
  name: "server",
  description: "Displays stats about the server",
  usage: "",
  usageDelim: "",
  extendedHelp: "Stats are:\nMember count\nMembers online count",
};
