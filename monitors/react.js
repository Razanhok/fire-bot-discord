const leven = require('leven')
const maxDistPercent = 0.2

exports.run = (client, msg) => {
  const reactors = [
    {
      type: 'startsWith',
      strings: ['poll:'],
      custom: () => {
        let upDoot
        let downDoot
        msg.react('👍').then((reaction) => { upDoot = reaction })
        msg.react('👎').then((reaction) => { downDoot = reaction })

        const options = {
          maxUsers: 5
        }

        const updootsCollector = msg.createReactionCollector((reaction, user) => {
          return (!user.bot && reaction.emoji.name === '👍')
        }, options)
        const downdootsCollector = msg.createReactionCollector((reaction, user) => {
          return (!user.bot && reaction.emoji.name === '👎')
        }, options)

        updootsCollector.on('end', () => {
          upDoot.remove()
        })
        downdootsCollector.on('end', () => {
          downDoot.remove()
        })
      }
    },
    {
      type: 'includes',
      strings: ['good night', 'goodnight'],
      reactions: [
        '🌛'
      ]
    },
    {
      type: 'includes',
      strings: ['good morning', 'goodmorning'],
      reactions: [
        '🌛'
      ]
    }
  ]

  reactors.some((reactor) => {
    let found = false
    reactor.strings.some((search) => {
      let stringToFind = search
      let wordsToFind = search.split(' ')
      switch (reactor.type) {
        case 'startsWith':
          if (msg.content.startsWith(stringToFind)) {
            found = reactor
            break
          }
          break
        case 'includes':
          if (msg.content.includes(stringToFind)) {
            found = reactor
            break
          }
          msg.content.split(' ').some((word, index, arr) => {
            if (leven(wordsToFind[0], word) <= maxDistPercent) {
              let i = index
              wordsToFind.slice(1).some((w) => {
                i++
                if (leven(w, arr[i]) / w.length <= maxDistPercent) {
                  found = reactor
                  return true
                }
              })
              if (found) return true
            }
          })
          break
        default:
          throw new Error('Error: search type not recognized.')
      }
      if (found) return true
    })

    if (found) {
      client.funcs.log(found)
      if (found.reactions) {
        found.reactions.forEach((reactionEmoji) => {
          msg.react(reactionEmoji).catch((e) => {
            client.funcs.log("Error: couldn't add reaction", 'error')
          })
        })
      } else if (found.custom) {
        found.custom()
      }
    }
  })
}

exports.conf = {
  enabled: true,
  ignoreBots: true,
  ignoreSelf: true
}
