const levenshtein = require('leven')
const makeUnique = require('make-unique')
const isit = require('isit')

module.exports = (client, msg, operation, r, roles, possibleRoles) => {
  if (operation !== 'add' && operation !== 'remove') operation = 'add'
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

  const rolesToChange = []
  const rolesUnchanged = []
  const invalidRoles = []
  roles.forEach((e) => {
    const best = bestMatch(possibleRoles, removeSpecial(e))
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
      text.push(`you already did not have the \`${rolesUnchanged.map(element => element.name).join(' / ')}\` ${ru > 1 ? "roles, so they weren't changed" : "role, so it wasn't changed"}${isit('falsey', rtc) && operation === 'add' ? ` (to remove a role, you can do \`!role remove ${rolesUnchanged[0].name}\`)` : ''}`)
    }
    if (isit('truthy', ir)) {
      text.push(`the \`${invalidRoles.join(' / ')}\` ${ir > 1 ? "roles you specified don't exist or aren't self assignable" : "role you specified doesn't exist or isn't self assignable"}`)
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
      throw new Error('Error: failed to add one or more roles.')
    }
  } else {
    userReply()
  }

  msg.channel.stopTyping(true)
}
