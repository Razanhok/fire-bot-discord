const levenshtein = require("fast-levenshtein");
const makeUnique = require("make-unique");
const ci = require("case-insensitive");
const isit = require("isit");
const sleep = require("system-sleep");

/* eslint no-param-reassign: "off" */

// collection.find but case insens
function collectionFindNoCase(roles, string) {
  return roles.find((item) => {
    return item.name.toLowerCase() === string.toLowerCase();
  });
}

// check if user has a role
function hasRole(member, role) {
  return member.roles.some((item) => {
    return item.id === role.id;
  });
}

// actual start ----------------------------

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

  // end of role list config marker ---------------

  // make roles be an array with all the roles the user wants
  if (roles[0] !== undefined) {
    roles.unshift(role);
  } else {
    roles[0] = role;
  }

  if (roles.length > 2) msg.channel.startTyping();

  // replace roles with an array of object with info about the requested role : name, discordRole, if it was fixed using levenshtein, if the user already has the role
  roles.forEach((element, index) => {
    client.funcs.log(`Argument number ${index} : ${roles[index]}`, "debug");
    // check if the role is in config
    if (!ci(possibleRoles).includes(element)) {
      client.funcs.log("Raw argument doesn't match a role", "debug");
      if (isit("empty", element)) {
        roles[index] = { invalid: true };
      } else if (!possibleRoles.some((possRole) => { // checks if the user made a small spelling mistake, and if he did put the corresponding role in the array normally but mention it was "fixed"
        client.funcs.log(`Levenshtein : ${possRole.toLowerCase()} <=> ${element.toLowerCase()} = ${levenshtein.get(possRole.toLowerCase(), element.toLowerCase())} Limit : ${possRole.length / 2.5}`, "debug");
        if (levenshtein.get(possRole.toLowerCase(), element.toLowerCase()) < (possRole.length / 2.5)) {
          client.funcs.log(`Levenshtein fix found : ${possRole.toLowerCase()} <=> ${element.toLowerCase()} = ${levenshtein.get(possRole.toLowerCase(), element.toLowerCase())}`, "debug");
          const foundRole = collectionFindNoCase(msg.guild.roles, possRole);
          roles[index] = { name: possRole, role: foundRole, fixed: true, hasAlready: hasRole(msg.member, foundRole) };
          if (!roles[index].role) {
            throw new Error(`Error : role '${roles[index].name}' from config doesn't exist in this guild. Contact an admin please.`);
          }
          return true;
        }
        return false;
      })) { // this is if we couldn't find a matching role
        client.funcs.log("Role invalid and no fix found", "debug");
        roles[index] = { name: element }; // roles[index] = { name: roles[index] };
      }
    } else { // this is if the user input matched a config role
      client.funcs.log("Role matched a role in config", "debug");
      const foundRole = collectionFindNoCase(msg.guild.roles, element);
      client.funcs.log("Continued after find role", "debug");
      client.funcs.log(`Found role : ${foundRole}`, "debug");
      roles[index] = { name: element, role: foundRole, fixed: false, hasAlready: hasRole(msg.member, foundRole) };
      if (!roles[index].role) {
        throw new Error(`Error : role '${element.name}' from config doesn't exist in this guild. Contact an admin please.`);
      }
    }
    client.funcs.log("------------------------------------------------------", "debug");
  });

  // removes duplicates and puts them in the duplicates array
  const duplicates = [];
  makeUnique(roles, (a, b) => {
    if (!a.role || !b.role) return false;
    else if (a.role.id === b.role.id) {
      duplicates.push(b);
      return true;
    }
    return false;
  });

  client.funcs.log("========================================================", "debug");
  const rolesChanged = [];
  const unknownArgs = [];
  const rolesUnchanged = [];

  // gives roles and stuff based on the roles array
  roles.forEach((element) => {
    if (!element.invalid) {
      client.funcs.log(`Role : ${element.name}`, "debug");
      if (isit("non-empty", element.role)) {
        if (operation === "add") {
          client.funcs.log("We have an existing role the user wants to add", "debug");
          if (isit("falsey", element.hasAlready)) {
            client.funcs.log("User doesn't have the role, adding role...", "debug");
            msg.member.addRole(element.role).then((nm) => {
              if (!hasRole(nm, element.role)) {
                msg.reply(`Somehow the ${element.role.name} role was actually not added and I have no idea why. Just try again or contact an admin.`);
              }
            }).catch((e) => {
              client.funcs.log(e, "debug");
              throw e;
            }); // replace with proper error handling
            rolesChanged.push(element.role.name);
            sleep(250);
          } else {
            client.funcs.log("User already had the role, nothing being done", "debug");
            rolesUnchanged.push(element.role.name);
          }
        } else if (operation === "remove") {
          client.funcs.log("We have an existing role the user wants to remove", "debug");
          if (isit("truthy", element.hasAlready)) {
            client.funcs.log("User has the role, removing role...", "debug");
            msg.member.removeRole(element.role).then((nm) => {
              if (hasRole(nm, element.role)) {
                msg.reply(`Somehow the ${element.role.name} role was actually not removed and I have no idea why. Just try again or contact an admin.`);
              }
            }).catch((e) => {
              client.funcs.log(e, "debug");
              throw e;
            }); // replace with proper error handling
            rolesChanged.push(element.role.name);
            sleep(250);
          } else {
            client.funcs.log("User didn't have the role, nothing being done", "debug");
            rolesUnchanged.push(element.role.name);
          }
        } else {
          throw new Error("The operation (add|remove) didn't match these 2 option...");
        }
      } else {
        client.funcs.log("This role doesn't exist, nothing being done", "debug");
        unknownArgs.push(element.name);
      }
      client.funcs.log("------------------------------------------------------", "debug");
    }
  });
  msg.channel.stopTyping(true);
  client.funcs.log(`Roles changed : ${rolesChanged}`, "debug");
  client.funcs.log(`Unknown args : ${unknownArgs}`, "debug");
  client.funcs.log(`Unchanged roles : ${rolesUnchanged}`, "debug");
  client.funcs.log("START OF USER RESPONSE", "debug");
  if (isit("non-empty array", rolesChanged)) { // roles.some((element) => { return operation === "add" ? !element.hasAlready : element.hasAlready; })
    msg.reply(`${operation === "add" ? "added" : "removed"} the \`${rolesChanged.join(", ")}\` role${rolesChanged.length > 1 ? "s" : ""}.${isit("non-empty array", rolesUnchanged) ? ` You ${operation === "add" ? "already had" : "already didn't have"} the ${rolesUnchanged.length > 1 ? `\`${rolesUnchanged.join(", ")}\` roles.` : `\`${rolesUnchanged[0]}\` role.`}` : ""}${isit("non-empty array", unknownArgs) ? ` I don't know what you meant by \`${unknownArgs.join(", ")}\` tho. You can do \`${msg.guildConf.prefix}listroles\` to get a list of possible roles.` : ""}`);
  } else {
    msg.reply(`${isit("non-empty array", unknownArgs) ? `The role${unknownArgs.length > 1 ? `s \`${unknownArgs.join(", ")}\` you provided are` : ` \`${unknownArgs[0]}\` you provided is`} not valid. You can do \`${msg.guildConf.prefix}listroles\` to get a list of possible roles. ${isit("non-empty array", rolesUnchanged) ? "Also, y" : ""}` : "Y"}${isit("non-empty array", rolesUnchanged) ? `ou ${operation === "add" ? "already had" : "already didn't have"} the ${rolesUnchanged.length > 1 ? `\`${rolesUnchanged.join(", ")}\` roles.` : `\`${rolesUnchanged[0]}\` role.`}` : ""}`);
  }

  client.funcs.log("END OF COMMAND", "debug");
  client.funcs.log("¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦", "debug");
};

exports.conf = {
  enabled: true,
  runIn: ["text"],
  aliases: ["heroes"],
  permLevel: 0,
  botPerms: ["MANAGE_ROLES"],
  requiredFuncs: [],
};

exports.help = {
  name: "hero",
  description: "Manage your Hero roles",
  usage: "[add|remove] <hero:str> [...]",
  usageDelim: " ",
  extendedHelp: "",
};
