const komada = require("komada");

// Fire Bot token : "MjkzNDU0OTU2MTc2ODY3MzI4.C7G0vA.EAo1wCaxVP-lA_Xgue_apsNS52c" ID : "293454956176867328"
// Fire Bot Dev token : "MjkzNDU0OTU2MTc2ODY3MzI4.C7G0vA.EAo1wCaxVP-lA_Xgue_apsNS52c" ID : "293823048333656075"

komada.start({
  botToken: process.env.BOT_TOKEN,
  ownerID: process.env.OWNER_ID,
  clientID: process.env.CLIENT_ID,
  prefix: "!",
  clientOptions: {
    fetchAllMembers: true,
  },
});
