const leven = require('leven')

exports.run = (client, msg) => {
  var message = msg.content.toLowerCase()
  var nightWords = ['good night', 'goodnight']
  var dayWords = ['good morning', 'goodmorning']
  function includeLeven (message, word, levenDistance) {
    console.log('debug')
    for (var j = 0; j < message.length; j++) {
      console.log(leven(message.substring(j, j + word.length - 1), word))
      if (leven(message.substring(j, j + word.length - 1), word) <= levenDistance) return true
    }
    return false
  }
  nightWords.forEach((word) => {
    console.log(word)
    if (includeLeven(message, word, 1)) msg.react('🌛')
  })
  dayWords.forEach((word) => {
    console.log(word)
    if (includeLeven(message, word, 1)) msg.react('🌅')
  })
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
}

exports.conf = {
  enabled: true,
  ignoreBots: true,
}
