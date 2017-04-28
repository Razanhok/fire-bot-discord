const isit = require("isit");

/* eslint no-param-reassign: "off" */

exports.run = (client, msg, [operation, role, ...roles]) => {
  client.funcs.log("START OF COMMAND", "debug");
  if (!isit("non-empty string", operation)) operation = "add";
  let possibleRoles = [];
  // check if the role list is in config
  if (!client.funcs.confs.has(msg.guild)) client.configuration.insert(client, msg.guild);
  if (!client.funcs.confs.hasKey("heroes")) {
    possibleRoles = ["Genji", "McCree", "Pharah", "Reaper", "Soldier", "Sombra", "Tracer", "Bastion", "Hanzo", "Junkrat", "Mei", "Torbjorn", "Widowmaker", "D.Va", "Orisa", "Reinhardt", "Roadhog", "Winston", "Zarya", "Ana", "Lucio", "Mercy", "Symmetra", "Zenyatta"];
    client.funcs.confs.addKey("heroes", possibleRoles);
  } else {
    possibleRoles = msg.guildConf.heroes;
  }

  client.funcs.roleChangerFirebot(client, msg, operation, role, roles, possibleRoles);
};

exports.conf = {
  enabled: true,
  runIn: ["text"],
  aliases: ["heroes"],
  permLevel: 0,
  botPerms: ["MANAGE_ROLES"],
  requiredFuncs: ["roleChangerFirebot"],
  cooldowns: {
    scope: "user",
    time: 15000,
  },
};

exports.help = {
  name: "hero",
  description: "Manage your Hero roles. Usage is the same as !role.",
  usage: "[add|remove] <hero:str> [...]",
  usageDelim: " ",
  extendedHelp: "!listheroes gives you a list of possible roles",
};
