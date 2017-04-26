const komada = require("komada");

// Fire Bot token : "MjkzNDU0OTU2MTc2ODY3MzI4.C9zrhg.PNd6OkaY_Q2R8PmIh3P-gAS3scc" ID : "293454956176867328"
// Fire Bot Dev token : "MjkzODIzMDQ4MzMzNjU2MDc1.C9zr4w.BQQzAukJLxWFSDr4nvJmPpO5WvM" ID : "293823048333656075"

komada.start({
  botToken: process.env.BOT_TOKEN,
  ownerID: process.env.OWNER_ID,
  clientID: process.env.CLIENT_ID,
  prefix: "!",
  clientOptions: {
    fetchAllMembers: true,
  },
});
