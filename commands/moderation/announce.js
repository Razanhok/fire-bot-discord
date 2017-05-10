const request = require('request-promise-native')

exports.run = (client, msg, [channel, input]) => {
  if (input.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g)) {
    const url = input
    request(url)
    .then((resp) => {
      if (typeof resp !== 'string' || resp.length < 1 || resp.length > 2000) msg.reply('The content of the page you linked is not valid')
      else channel.send(resp).catch(() => { msg.reply("Error : can't send message") })
    }).catch((e) => {
      throw new Error(`Problem with link. Error : ${e.name} ${e.statusCode}`)
    })
  } else {
    const messageToSend = msg.content.slice(msg.content.indexOf(channel.toString()) + channel.toString().length)
    channel.send(messageToSend).catch(() => { throw new Error("Error: can't send message") })
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
  name: 'announce',
  description: 'Sends a message in a specific channel',
  usage: '<channel:channel> <content:string>',
  usageDelim: ' ',
  extendedHelp: 'Usage: Mention a channel and then put a raw text link or just your message'
}
