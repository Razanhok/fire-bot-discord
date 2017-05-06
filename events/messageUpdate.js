const moment = require("moment");

exports.run = (client, [oldMessage, newMessage]) => {
  client.funcs.log("messageUpdate event fired", "debug");
  // if (newMessage.channel.type !== "text") return;
  client.funcs.log("channel is 'text'", "debug");

  const logChannel = newMessage.guild.channels.find("name", "log");
  client.funcs.log(`logChannel exists: ${!!logChannel}`, "debug");
  if (!logChannel) return;

  client.funcs.log(`logChannel name: ${logChannel.name}`, "debug");

  logChannel.send("", { embed: {
    color: 3447003,
    author: {
      name: newMessage.author.tag,
      icon_url: newMessage.author.avatarURL,
    },
    title: "A message was edited",
    description: `Message from ${oldMessage.author.tag} in ${oldMessage.channel}, edited at ${moment(newMessage.editedTimestamp).format("MMMM Do YYYY, h:mm:ss a")}`,
    fields: [{
      name: "Old message",
      value: oldMessage.content,
    },
    {
      name: "New message",
      value: newMessage.content,
    }],
    footer: {
      icon_url: client.user.avatarURL,
      text: client.author.tag,
    },
  } });
};
