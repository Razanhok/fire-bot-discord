const leven = require('leven')

exports.run = (client, msg) => {
  if (!msg.content.startsWith('poll:')) return
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

  var message = msg.content.toLower()
  var nightWords = ['good night', 'goodnight']
  var dayWords = ['good morning', 'goodmorning']

  function includeLeven (message, word, levenDistance) {
    for (var j = 0; j < message.lenght; j++) {
      if (leven(message.content.substring(j, j + word.lenght - 1), word) >= levenDistance) return true
    }
  }

  for (var word in nightWords) {
    if (includeLeven(message, word, 1)) msg.react('🌛')
  }
  for (word in dayWords) {
    if (includeLeven(message, word, 1)) msg.react('🌅')
  }
}

exports.conf = {
  enabled: true,
  ignoreBots: true,
  ignoreSelf: false
}
