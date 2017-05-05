const request = require("request-promise-native");

exports.run = (client, msg, [targetMsg, url]) => {
  if (targetMsg.author.id !== client.user.id) throw new Error("Can't edit message");

  request(url)
    .then((resp) => {
      if (typeof resp !== "string" || resp.length < 1 || resp.length > 2000) msg.reply("The content of the page you linked is not valid");
      else targetMsg.edit(resp).catch(() => { msg.reply("Error : can't edit message"); });
    }).catch((e) => {
      throw new Error(e);
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
  name: "edit",
  description: "Edits one of my mesages",
  usage: "<message:message> <content:url>",
  usageDelim: " ",
  extendedHelp: "Usage : put a message ID (only my messages tho) and then put a raw text link",
};
