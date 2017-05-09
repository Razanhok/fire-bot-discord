const komada = require("komada");

komada.start({
  botToken: process.env.BOT_TOKEN,
  ownerID: process.env.OWNER_ID,
  clientID: process.env.CLIENT_ID,
  prefix: "!",
  clientOptions: {
    fetchAllMembers: true,
  },
});
