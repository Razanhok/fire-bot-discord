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
        '🌅'
      ]
    }
  ]

  reactors.forEach((reactor) => {
    let found = false
    reactor.strings.some((search) => {
      let stringToFind = search
      let wordsToFind = search.split(' ')
      switch (reactor.type) {
        case 'startsWith':
          if (msg.content.toLowerCase().startsWith(stringToFind.toLowerCase())) {
            found = reactor
            break
          }
          // only finds perfect match
          break
        case 'includes':
          if (msg.content.toLowerCase().includes(stringToFind.toLowerCase())) {
            found = reactor
            break
          }
          msg.content.split(' ').some((word, index, arr) => {
            if (leven(wordsToFind[0].toLowerCase(), word.toLowerCase()) <= maxDistPercent) {
              let i = index
              if (wordsToFind.slice(1).every((w) => {
                i++
                if (leven(w.toLowerCase(), arr[i].toLowerCase()) / w.length <= maxDistPercent) return true
              })) found = reactor
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
