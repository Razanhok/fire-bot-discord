const request = require('request-promise-native')

exports.run = (client, msg, [targetMsg, input]) => {
  if (targetMsg.author.id !== client.user.id) throw new Error("I can't edit this message")

  if (input.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g)) {
    const url = input
    request(url)
    .then((resp) => {
      if (typeof resp !== 'string' || resp.length < 1 || resp.length > 2000) msg.reply('The content of the page you linked is not valid')
      else targetMsg.edit(resp).catch(() => { msg.reply("Error : can't edit message") })
    }).catch((e) => {
      throw new Error(`Problem with link. Error : ${e.name} ${e.statusCode}`)
    })
  } else {
    const messageToSend = msg.content.slice(msg.content.indexOf(targetMsg.toString()) + targetMsg.toString().length)
    targetMsg.edit(messageToSend).catch(() => { throw new Error("Error: can't edit message") })
  }
}

exports.conf = {
  enabled: true,
  runIn: ['text'],
  aliases: [],
  permLevel: 2,
  botPerms: [],
  requiredFuncs: []
}

exports.help = {
  name: 'edit',
  description: 'Edits one of my mesages',
  usage: '<message:message> <content:string>',
  usageDelim: ' ',
  extendedHelp: 'Usage : put a message ID (only my messages tho) and then put a raw text link'
}
