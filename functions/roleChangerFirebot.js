const levenshtein = require('leven')
const makeUnique = require('make-unique')
const isit = require('isit')

module.exports = (client, msg, operation, r, roles, possibleRoles) => {
  if (operation !== 'add' && operation !== 'remove') operation = 'add'
  client.funcs.log('Started role changer function')
  function findRole (collection, string) {
    return collection.find((item) => {
      return item.name.toLowerCase() === string.toLowerCase()
    })
  }

  function hasRole (member, rl) {
    return member.roles.some((item) => {
      return item.id === rl.id
    })
  }

  function isValidChar (text) {
    if (text) return /[0-9.]/.test(text)
    return false
  }

  function removeSpecial (text) {
    if (text) {
      const lower = text.toLowerCase()
      const upper = text.toUpperCase()
      let result = ''
      for (let i = 0; i < lower.length; i++) {
        if (isValidChar(text[i]) || (lower[i] !== upper[i]) || (lower[i].trim() === '')) result += text[i]
      }
      return result
    }
    return ''
  }

  function bestMatch (array, string) {
    const results = []
    array.forEach((element) => {
      const diff = levenshtein(element.toLowerCase(), string.toLowerCase())
      results.push({ string, element, diff })
    })
    results.sort((a, b) => {
      return a.diff - b.diff
    })
    return results[0]
  }

  if (isit('non-empty array', roles)) {
    roles.unshift(r)
  } else {
    roles[0] = r
  }

  if (roles.length > 2) msg.channel.startTyping()

  console.log(roles)

  const rolesToChange = []
  const rolesUnchanged = []
  const invalidRoles = []
  roles.forEach((e) => {
    const best = bestMatch(possibleRoles, removeSpecial(e))
    console.log(best)
    if (best.diff < (best.element.length / 4) + 1) {
      const foundRole = findRole(msg.guild.roles, best.element)
      if (!foundRole) throw new ReferenceError('Error: one or more roles in config do not exist on this server.')
      const needChange = hasRole(msg.member, foundRole) !== (operation === 'add')
      if (needChange) {
        rolesToChange.push(foundRole)
      } else {
        rolesUnchanged.push(foundRole)
      }
    } else {
      invalidRoles.push(e)
    }
  })
  // checkedRoles.push({ argument: best.string, role: foundRole, diff: best.diff, hasRole: hasR, hasToChange: needChange });

  makeUnique(rolesToChange, (a, b) => {
    if (!a.id || !b.id) return false
    if (a.id === b.id) return true
    return false
  })

  function userReply () {
    const text = []
    const rtc = rolesToChange.length
    const ru = rolesUnchanged.length
    const ir = invalidRoles.length
    if (isit('truthy', rtc)) {
      text.push(`${operation === 'add' ? 'added' : 'removed'} the \`${rolesToChange.map(element => element.name).join(' / ')}\` role${rtc > 1 ? 's' : ''}`)
    }
    if (isit('truthy', ru)) {
      text.push(`the \`${rolesUnchanged.map(element => element.name).join(' / ')}\` role${ru > 1 ? "s weren't" : " wasn't"} changed because you ${operation === 'add' ? `already have ${ru > 1 ? 'them' : 'it'}` : `already don't have ${ru > 1 ? 'them' : 'it'}`}${isit('falsey', rtc) && operation === 'add' ? `. To remove a role, you can do \`!role remove ${rolesUnchanged[0].name}\`` : ''}`)
    }
    if (isit('truthy', ir)) {
      text.push(`the \`${invalidRoles.join(' / ')}\` ${ru > 1 ? "roles you specified don't exist or aren't self assignable" : "role you specified doesn't exist or isn't self assignable"}`)
    }

    let formatedText = text.join(', ') + '.'
    msg.reply(formatedText)
  }

  if (isit('non-empty array', rolesToChange)) {
    try {
      if (operation === 'add') {
        msg.member.addRoles(rolesToChange).then(() => {
          userReply()
        })
      } else if (operation === 'remove') {
        msg.member.removeRoles(rolesToChange).then(() => {
          userReply()
        })
      }
    } catch (e) {
      client.funcs.log(e)
      throw new Error('Error: failed to add one or more roles.')
    }
  } else {
    userReply()
  }

  /*
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
    msg.reply(`${isit("non-empty array", unknownArgs) ? `The ${unknownArgs.length > 1 ? `\`${unknownArgs.join(", ")}\` roles you provided don't exist or are not self assignable` : ` \`${unknownArgs[0]}\` role you provided doesn't exist or ins't self assignable`}. You can do \`${msg.guildConf.prefix}listroles\` to get a list of self assignable roles. ${isit("non-empty array", rolesUnchanged) ? "Also, y" : ""}` : "Y"}${isit("non-empty array", rolesUnchanged) ? `ou ${operation === "add" ? "already had" : "already didn't have"} the ${rolesUnchanged.length > 1 ? `\`${rolesUnchanged.join(", ")}\` roles.` : `\`${rolesUnchanged[0]}\` role.`}` : ""}`);
  }
  */

  msg.channel.stopTyping(true)
}
