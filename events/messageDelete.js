const moment = require("moment-timezone");

exports.run = (client, message) => {
  if (message.channel.type !== "text") return;
  const time = new Date();
  const logChannel = message.guild.channels.find("name", "log");
  if (!logChannel) return;
  if (!logChannel.permissionsFor(logChannel.guild.me).has("READ_MESSAGES")) return;
  if (!logChannel.permissionsFor(logChannel.guild.me).has("SEND_MESSAGES")) return;

  const deletedBy = "unknown (not implemented yet)";
  let logs;
  message.guild.fetchAuditLogs({ limit: "5", user: message.author, type: "MESSAGE_DELETE" }).then((result) => { logs = result; });
  if (logs) {
    client.funcs.log(`audit logs: ${logs}`, "debug");
    logs.some((logEntry) => {
      if (logEntry.target === message.id) {
        // do someshit
        return true;
      }
      return false;
    });
  }

  logChannel.send("", { embed: {
    color: 0xff0000,
    author: {
      name: message.author.tag,
      icon_url: message.author.avatarURL,
    },
    title: "Message deleted",
    description: `ID: ${message.id} / channel: ${message.channel} / by: ${deletedBy}
    Deleted ${moment(time).tz("Europe/London").format("dddd, MMMM Do YYYY (zz)")}
    ${moment(time).tz("Europe/London").format("hh:mm zz")}
    ${moment(time).tz("Europe/Paris").format("hh:mm zz")}
    ${moment(time).tz("America/Los_Angeles").format("h:mm a zz")}`,
    fields: [{
      name: "Message",
      value: message.cleanContent,
    }],
    footer: {
      icon_url: client.user.avatarURL,
      text: client.user.tag,
    },
  } });
};
