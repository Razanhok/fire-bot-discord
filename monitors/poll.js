exports.conf = {
  enabled: true,
  ignoreBots: true,
  ignoreSelf: false,
};

exports.run = (client, msg) => {
  if (msg.content.startsWith("poll:")) {
    msg.react("👍").catch();
    msg.react("👎").catch();
  }
};
