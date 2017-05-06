const moment = require("moment-timezone");
const levenshtein = require("fast-levenshtein");

exports.run = (client, oldMessage, newMessage) => {
  if (oldMessage.channel.type !== "text" || oldMessage.author.bot) return;

  const logChannel = newMessage.guild.channels.find("name", "log");
  if (!logChannel) return;
  if (levenshtein.get(oldMessage.cleanContent, newMessage.cleanContent) < 5) return;
  if (!logChannel.permissionsFor(logChannel.guild.me).has("READ_MESSAGES")) return;
  if (!logChannel.permissionsFor(logChannel.guild.me).has("SEND_MESSAGES")) return;

  client.funcs.log(`logChannel name: ${logChannel.name}`, "debug");
  const ts = newMessage.editedTimestamp;
  client.funcs.log(`edited timestamp: ${ts}`, "debug");

  logChannel.send("", { embed: {
    color: 0xffbf00,
    author: {
      name: newMessage.author.tag,
      icon_url: newMessage.author.avatarURL,
    },
    title: "Message edit",
    description: `ID: ${oldMessage.id} / channel: ${oldMessage.channel}
    Edited ${moment(ts).tz("Europe/London").format("dddd, MMMM Do YYYY (zz)")}
    ${moment(ts).tz("Europe/London").format("hh:mm zz")}
    ${moment(ts).tz("Europe/Paris").format("hh:mm zz")}
    ${moment(ts).tz("America/Los_Angeles").format("h:mm a zz")}`,
    fields: [{
      name: "Old message",
      value: oldMessage.cleanContent,
    },
    {
      name: "New message",
      value: newMessage.cleanContent,
    }],
    footer: {
      icon_url: client.user.avatarURL,
      text: client.user.tag,
    },
  } });
};
