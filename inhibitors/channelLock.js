exports.conf = {
  enabled: true,
  priority: 8,
};

exports.run = (client, msg) => {
  if (msg.channel.type === "text") {
    if (msg.guild.id === "293161643674828800" && msg.channel.id !== "293163428061642764") {
      return "Commands can only be used in the <#311241522852921354> channel";
    }
  }
  return false;
};
