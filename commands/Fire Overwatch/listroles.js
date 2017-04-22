exports.run = async (client, msg) => {
  let roles;
  if (!client.funcs.confs.has(msg.guild)) client.configuration.insert(client, msg.guild);
  if (!client.funcs.confs.hasKey("roles")) {
    roles = ["Offense", "Defense", "Support", "Tank", "Flex", "EU", "NA", "Asia", "AUS", "PC", "XBOX", "PS4"];
    client.funcs.confs.addKey("roles", roles);
  } else {
    roles = msg.guildConf.roles;
  }
  let heroes;
  if (!client.funcs.confs.hasKey("heroes")) {
    heroes = (["Genji", "McCree", "Pharah", "Reaper", "Soldier", "Sombra", "Tracer", "Bastion", "Hanzo", "Junkrat", "Mei", "Torbjorn", "Widowmaker", "D.Va", "Orisa", "Reinhardt", "Roadhog", "Winston", "Zarya", "Ana", "Lucio", "Mercy", "Symmetra", "Zenyatta"]);
    client.funcs.confs.addKey("heroes", heroes);
  } else {
    heroes = msg.guildConf.heroes;
  }
  msg.reply(`Possible roles : \`${roles.join(", ")}\`\nPossible hero roles : \`${heroes.join(", ")}\``);
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
  name: "listroles",
  description: "Gives you a list of roles you can get with !role",
  usage: "",
  usageDelim: "",
  extendedHelp: "",
};
