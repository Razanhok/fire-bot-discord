const request = require("request-promise-native");

exports.run = (client, msg, [channel, url]) => {
  client.funcs.log(url, "debug");
  request(url)
    .then((resp) => {
      client.funcs.log(resp);
      if (typeof resp !== "string" || resp.length < 1 || resp.length > 2000) msg.reply("The content of the page you linked is not valid");
      else channel.send(resp).catch(() => { msg.reply("Error : can't send message"); });
    }).catch((e) => {
      throw new Error(`Problem with link. Error : ${e.name} ${e.statusCode}`);
    });
};

exports.conf = {
  enabled: true,
  runIn: ["text"],
  aliases: [],
  permLevel: 2,
  botPerms: [],
  requiredFuncs: [],
};

exports.help = {
  name: "announce",
  description: "Sends a message in a specific channel",
  usage: "<channel:channel> <content:url>",
  usageDelim: " ",
  extendedHelp: "Usage : Mention a channel and then put a raw text link",
};
