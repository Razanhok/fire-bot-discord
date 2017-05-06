exports.run = (client, reaction) => {
  return; /* eslint-disable no-unreachable */
  client.funcs.log("A reaction was removed", "debug");
  if (!reaction.message.content.startsWith("poll:")) return; // eslint-disable-line no-useless-return

  client.funcs.log(`Reaction on message: ${reaction.message.reactions.size}`, "debug");

  if (!reaction.message.reactions.some((r) => { return r.emoji.name === "👍"; })) {
    reaction.message.react("👍");
  }

  const downdoots = reaction.message.reactions.filter((r) => {
    return r.emoji.name === "👎";
  });
  if (downdoots.size < 1) {
    reaction.message.react("👎");
  }
};
