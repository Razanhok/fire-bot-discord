const isit = require("isit");
/* eslint no-param-reassign: "off" */

exports.run = (client, msg, [operation, role, ...roles]) => {
  client.funcs.log("START OF COMMAND", "debug");
  if (!isit("non-empty string", operation)) operation = "add";
  let possibleRoles = [];
  // check if the role list is in config
  if (!client.funcs.confs.has(msg.guild)) client.configuration.insert(client, msg.guild);
  if (!client.funcs.confs.hasKey("roles")) {
    possibleRoles = ["Offense", "Defense", "Support", "Tank", "Flex", "EU", "NA", "Asia", "AUS", "PC", "XBOX", "PS4"];
    client.funcs.confs.addKey("roles", possibleRoles);
  } else {
    possibleRoles = msg.guildConf.roles;
  }
  if (!client.funcs.confs.hasKey("heroes")) {
    const heroes = (["Genji", "McCree", "Pharah", "Reaper", "Soldier", "Sombra", "Tracer", "Bastion", "Hanzo", "Junkrat", "Mei", "Torbjorn", "Widowmaker", "D.Va", "Orisa", "Reinhardt", "Roadhog", "Winston", "Zarya", "Ana", "Lucio", "Mercy", "Symmetra", "Zenyatta"]);
    client.funcs.confs.addKey("heroes", heroes);
    possibleRoles = possibleRoles.concat(heroes);
  } else {
    possibleRoles = possibleRoles.concat(msg.guildConf.heroes);
  }

  client.funcs.roleChangerFirebot(client, msg, operation, role, roles, possibleRoles);
};

exports.conf = {
  enabled: true,
  runIn: ["text"],
  aliases: ["roles"],
  permLevel: 0,
  botPerms: ["MANAGE_ROLES"],
  requiredFuncs: ["roleChangerFirebot"],
};

exports.help = {
  name: "role",
  description: "Manage your roles. Example: !roles pc eu flex support mercy. To remove do !role remove mercy.",
  usage: "[add|remove] <role:str> [...]",
  usageDelim: " ",
  extendedHelp: "!listroles gives you a list of possible roles",
};
