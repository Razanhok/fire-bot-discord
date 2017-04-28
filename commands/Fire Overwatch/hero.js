const levenshtein = require("fast-levenshtein");
const makeUnique = require("make-unique");
const ci = require("case-insensitive");
const isit = require("isit");

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

  // end of role list config marker / start of common part between role.js and hero.js ----------------------------

  // make roles be an array with all the roles the user wants
  if (isit("non-empty array", roles)) {
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
          if (!isit("non-empty object", foundRole)) {
            msg.channel.stopTyping(true);
            throw new Error("role in config doesn't exist in this server");
          }
          roles[index] = { name: possRole, role: foundRole, fixed: true, hasAlready: hasRole(msg.member, foundRole) };
          if (!roles[index].role) {
            msg.channel.stopTyping(true);
            throw new Error(`role ${roles[index].name} from config doesn't exist in this server.`);
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
      if (!isit("non-empty object", foundRole)) {
        msg.channel.stopTyping(true);
        throw new Error("role in config doesn't exist in this server");
      }
      client.funcs.log("Continued after find role", "debug");
      client.funcs.log(`Found role : ${foundRole}`, "debug");
      roles[index] = { name: element, role: foundRole, fixed: false, hasAlready: hasRole(msg.member, foundRole) };
      if (!roles[index].role) {
        msg.channel.stopTyping(true);
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
  const rolesToAdd = [];
  const rolesToRemove = [];
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
            client.funcs.log("User doesn't have the role, adding role to add list", "debug");
            rolesToAdd.push(element.role);
          } else {
            client.funcs.log("User already had the role, nothing being done", "debug");
            rolesUnchanged.push(element.role.name);
          }
        } else if (operation === "remove") {
          client.funcs.log("We have an existing role the user wants to remove", "debug");
          if (isit("truthy", element.hasAlready)) {
            client.funcs.log("User has the role, adding role to remove list", "debug");
            rolesToRemove.push(element.role);
          } else {
            client.funcs.log("User didn't have the role, nothing being done", "debug");
            rolesUnchanged.push(element.role.name);
          }
        } else {
          msg.channel.stopTyping(true);
          throw new Error("The operation (add|remove) didn't match these 2 option...");
        }
      } else {
        client.funcs.log("This role doesn't exist, nothing being done", "debug");
        unknownArgs.push(element.name);
      }
      client.funcs.log("------------------------------------------------------", "debug");
    }
  });

  const rolesChanged = [];

  client.funcs.log(`Roles to add ${rolesToAdd}`, "debug");
  client.funcs.log(`Roles to remove ${rolesToRemove}`, "debug");

  function userReply() {
    client.funcs.log(`Roles changed : ${rolesChanged}`, "debug");
    client.funcs.log(`Unknown args : ${unknownArgs}`, "debug");
    client.funcs.log(`Unchanged roles : ${rolesUnchanged}`, "debug");
    client.funcs.log("START OF USER RESPONSE", "debug");
    msg.channel.stopTyping(true);
    if (isit("non-empty array", rolesChanged)) { // roles.some((element) => { return operation === "add" ? !element.hasAlready : element.hasAlready; })
      const rlsChngd = rolesChanged.join(", ");
      const rlChngdmore1 = rolesChanged.length > 1;
      const rlsUnchngd = rolesUnchanged.join(", ");
      const rlsUnchngdmore1 = rolesUnchanged.length > 1;
      const rlsUnchngdNotEmpty = isit("non-empty array", rolesUnchanged);
      const oprtn = operation === "add" ? "added" : "removed";
      const isAdd = operation === "add";
      msg.reply(`${oprtn} the \`${rlsChngd}\` role${rlChngdmore1 ? "s" : ""}.${rlsUnchngdNotEmpty ? ` You ${isAdd ? "already had" : "already didn't have"} the ${rlsUnchngdmore1 ? `\`${rlsUnchngd}\` roles.` : `\`${rolesUnchanged[0]}\` role.`}` : ""}${isit("non-empty array", unknownArgs) ? ` I don't know what you meant by \`${unknownArgs.join(", ")}\`. You can do \`${msg.guildConf.prefix}listroles\` to get a list of possible roles.` : ""}`);
    } else {
      msg.reply(`${isit("non-empty array", unknownArgs) ? `The ${unknownArgs.length > 1 ? `\`${unknownArgs.join(", ")}\` roles you provided don't exist or are not self assignable` : ` \`${unknownArgs[0]}\` you provided doesn't exist or ins't self assignable`}. You can do \`${msg.guildConf.prefix}listroles\` to get a list of possible roles. ${isit("non-empty array", rolesUnchanged) ? "Also, y" : ""}` : "Y"}${isit("non-empty array", rolesUnchanged) ? `ou ${operation === "add" ? "already had" : "already didn't have"} the ${rolesUnchanged.length > 1 ? `\`${rolesUnchanged.join(", ")}\` roles.` : `\`${rolesUnchanged[0]}\` role.`}` : ""}`);
    }
  }

  // add roles
  if (isit("non-empty array", rolesToAdd)) {
    client.funcs.log("Adding roles", "debug");
    msg.member.addRoles(rolesToAdd).then((member) => { /* eslint-disable-line no-unsused-vars */
      /* client.funcs.log(`member.roles.size = ${member.roles.size}`, "debug");
      if (!rolesToAdd.every((roleToAdd) => { return member.roles.some((r) => { return roleToAdd.id === r.id; }); })) {
        msg.channel.stopTyping(true);
        throw new Error("Failed to add one or more roles.");
      } else {*/
      rolesChanged.push(rolesToAdd.map((element) => { return element.name; }));
      userReply();
      // }
    }).catch((e) => {
      msg.channel.stopTyping(true);
      throw e;
    });
  } else if (isit("non-empty array", rolesToRemove)) { // make remove like add
    client.funcs.log("Adding roles", "debug");
    msg.member.removeRoles(rolesToRemove).then((member) => {
      /* if (!rolesToRemove.every((roleToRemove) => { return member.roles.some((r) => { return roleToRemove.id === r.id; }); })) {
        msg.channel.stopTyping(true);
        throw new Error("Failed to add one or more roles.");
      } else {*/
      rolesChanged.push(rolesToRemove.map((element) => { return element.name; }));
      userReply();
      // }
    }).catch((e) => {
      msg.channel.stopTyping(true);
      throw e;
    });
  } else {
    userReply();
  }

  msg.channel.stopTyping(true);

  client.funcs.log("END OF COMMAND", "debug");
  client.funcs.log("¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦", "debug");

  // end of common part between role.js and hero.js ----------------------------
};

exports.conf = {
  enabled: true,
  runIn: ["text"],
  aliases: ["heroes"],
  permLevel: 0,
  botPerms: ["MANAGE_ROLES"],
  requiredFuncs: [],
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
