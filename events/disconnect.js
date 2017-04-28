exports.run = (client, [CloseEvent]) => {
  if (CloseEvent.code > 1000 && CloseEvent.code < 2000) process.exit();
};
