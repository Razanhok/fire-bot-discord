exports.run = (client, msg) => {
  if (!msg.content.startsWith("poll:")) return;
  let upDoot;
  let downDoot;
  msg.react("👍").then((reaction) => { upDoot = reaction; });
  msg.react("👎").then((reaction) => { downDoot = reaction; });

  const options = {
    maxUsers: 5,
  };

  const updootsCollector = msg.createReactionCollector((reaction, user) => {
    return (!user.bot && reaction.emoji.name === "👍");
  }, options);
  const downdootsCollector = msg.createReactionCollector((reaction, user) => {
    return (!user.bot && reaction.emoji.name === "👎");
  }, options);

  updootsCollector.on("end", () => {
    upDoot.remove();
  });
  downdootsCollector.on("end", () => {
    downDoot.remove();
  });
};

exports.conf = {
  enabled: true,
  ignoreBots: true,
  ignoreSelf: false,
};
