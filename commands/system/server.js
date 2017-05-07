exports.run = (client, msg) => {
  let onlineMembers = "error";
  onlineMembers = msg.guild.members.filterArray((guildMember) => {
    if (guildMember.user.presence.status !== "offline") return true;
    return false;
  }).length;

  msg.channel.send("", { embed: {
    color: 39423,
    author: {
      name: msg.guild.name,
      icon_url: msg.guild.iconURL,
    },
    title: "Server stats",
    fields: [{
      name: "Members",
      value: msg.guild.memberCount,
      inline: true,
    },
    {
      name: "Members online",
      value: onlineMembers,
      inline: true,
    }],
  } });
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
  extendedHelp: `Stats are:
  Member count
  Members online count`,
};
