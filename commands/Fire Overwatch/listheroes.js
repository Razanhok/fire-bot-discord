exports.run = async (client, msg) => {
  if (!client.funcs.confs.has(msg.guild)) client.configuration.insert(client, msg.guild);
  if (!client.funcs.confs.hasKey("heroes")) {
    const heroes = ["Genji", "McCree", "Pharah", "Reaper", "Soldier", "Sombra", "Tracer", "Bastion", "Hanzo", "Junkrat", "Mei", "Torbjorn", "Widowmaker", "D.Va", "Orisa", "Reinhardt", "Roadhog", "Winston", "Zarya", "Ana", "Lucio", "Mercy", "Symmetra", "Zenyatta"];
    client.funcs.confs.addKey("heroes", heroes);
    msg.reply(`Possible heroes : \`${heroes.join(", ")}\``);
  } else {
    msg.reply(`Possible heroes : \`${msg.guildConf.heroes.join(", ")}\``);
  }
};

exports.conf = {
  enabled: true,
  runIn: ["text"],
  aliases: [],
  permLevel: 0,
  botPerms: [],
  requiredFuncs: [],
};

exports.help = {
  name: "listheroes",
  description: "Gives you a list of Hero roles you can get with !hero",
  usage: "",
  usageDelim: "",
  extendedHelp: "",
};
