const levenshtein = require("fast-levenshtein");
const makeUnique = require("make-unique");
const ci = require("case-insensitive");
const isit = require("isit");
/* eslint no-param-reassign: "off" */

module.exports = (client, msg, operation, role, roles, possibleRoles) => {
  function collectionFindNoCase(rls, string) {
    return rls.find((item) => {
      return item.name.toLowerCase() === string.toLowerCase();
    });
  }

  function hasRole(member, rl) {
    return member.roles.some((item) => {
      return item.id === rl.id;
    });
  }

  if (isit("non-empty array", roles)) {
    roles.unshift(role);
  } else {
    roles[0] = role;
  }

  if (roles.length > 2) msg.channel.startTyping();

  roles.forEach((element, index) => {
    element.replace(/[^a-zA-ZÀ-ö]/g, "");
    roles[index].replace(/[^a-zA-ZÀ-ö]/g, "");
    if (!ci(possibleRoles).includes(element)) {
      if (isit("empty", element)) {
        roles[index] = { invalid: true };
      } else if (!possibleRoles.some((possRole) => {
        if (levenshtein.get(possRole.toLowerCase(), element.toLowerCase()) < (possRole.length / 2.5)) {
          const foundRole = collectionFindNoCase(msg.guild.roles, possRole);
          if (!isit("non-empty object", foundRole)) {
            msg.channel.stopTyping(true);
            throw new Error(`role ${possRole} from config doesn't exist in this server.`);
          }
          roles[index] = { name: possRole, role: foundRole, fixed: true, hasAlready: hasRole(msg.member, foundRole) };
          if (!roles[index].role) {
            msg.channel.stopTyping(true);
            throw new Error(`role ${roles[index].name} from config doesn't exist in this server.`);
          }
          return true;
        }
        return false;
      })) {
        roles[index] = { name: element };
      }
    } else {
      const foundRole = collectionFindNoCase(msg.guild.roles, element);
      if (!isit("non-empty object", foundRole)) {
        msg.channel.stopTyping(true);
        throw new Error("role in config doesn't exist in this server");
      }
      roles[index] = { name: element, role: foundRole, fixed: false, hasAlready: hasRole(msg.member, foundRole) };
      if (!roles[index].role) {
        msg.channel.stopTyping(true);
        throw new Error(`Error : role '${element.name}' from config doesn't exist in this guild. Contact an admin please.`);
      }
    }
  });

  const duplicates = [];
  makeUnique(roles, (a, b) => {
    if (!a.role || !b.role) return false;
    else if (a.role.id === b.role.id) {
      duplicates.push(b);
      return true;
    }
    return false;
  });

  const rolesToAdd = [];
  const rolesToRemove = [];
  const unknownArgs = [];
  const rolesUnchanged = [];

  roles.forEach((element) => {
    if (!element.invalid) {
      if (isit("non-empty", element.role)) {
        if (operation === "add") {
          if (isit("falsey", element.hasAlready)) {
            rolesToAdd.push(element.role);
          } else {
            rolesUnchanged.push(element.role.name);
          }
        } else if (operation === "remove") {
          if (isit("truthy", element.hasAlready)) {
            rolesToRemove.push(element.role);
          } else {
            rolesUnchanged.push(element.role.name);
          }
        } else {
          msg.channel.stopTyping(true);
          throw new Error("The operation (add|remove) didn't match these 2 option...");
        }
      } else {
        unknownArgs.push(element.name);
      }
    }
  });

  const rolesChanged = [];


  function userReply() {
    msg.channel.stopTyping(true);
    if (isit("non-empty array", rolesChanged)) {
      const rlsChngd = rolesChanged.join(", ");
      const rlChngdmore1 = rolesChanged.length > 1;
      const rlsUnchngd = rolesUnchanged.join(", ");
      const rlsUnchngdmore1 = rolesUnchanged.length > 1;
      const rlsUnchngdNotEmpty = isit("non-empty array", rolesUnchanged);
      const oprtn = operation === "add" ? "added" : "removed";
      const isAdd = operation === "add";
      msg.reply(`${oprtn} the \`${rlsChngd}\` role${rlChngdmore1 ? "s" : ""}.${rlsUnchngdNotEmpty ? ` You ${isAdd ? "already had" : "already didn't have"} the ${rlsUnchngdmore1 ? `\`${rlsUnchngd}\` roles.` : `\`${rolesUnchanged[0]}\` role.`}` : ""}${isit("non-empty array", unknownArgs) ? ` I don't know what you meant by \`${unknownArgs.join(", ")}\`. You can do \`${msg.guildConf.prefix}listroles\` to get a list of possible roles.` : ""}`);
    } else {
      msg.reply(`${isit("non-empty array", unknownArgs) ? `The ${unknownArgs.length > 1 ? `\`${unknownArgs.join(", ")}\` roles you provided don't exist or are not self assignable` : ` \`${unknownArgs[0]}\` you provided doesn't exist or ins't self assignable`}. You can do \`${msg.guildConf.prefix}listroles\` to get a list of self assignable roles. ${isit("non-empty array", rolesUnchanged) ? "Also, y" : ""}` : "Y"}${isit("non-empty array", rolesUnchanged) ? `ou ${operation === "add" ? "already had" : "already didn't have"} the ${rolesUnchanged.length > 1 ? `\`${rolesUnchanged.join(", ")}\` roles.` : `\`${rolesUnchanged[0]}\` role.`}` : ""}`);
    }
  }

  // add roles
  if (isit("non-empty array", rolesToAdd)) {
    msg.member.addRoles(rolesToAdd).then(() => {
      /* if (!rolesToAdd.every((roleToAdd) => { return member.roles.some((r) => { return roleToAdd.id === r.id; }); })) {
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
  } else if (isit("non-empty array", rolesToRemove)) {
    msg.member.removeRoles(rolesToRemove).then(() => { // eslint-disable-line no-unused-vars
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
};
