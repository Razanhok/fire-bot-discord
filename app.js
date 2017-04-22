const komada = require("komada");

const mode = process.env.mode;
let token;
let clientID;

if (mode === "normal") {
  token = "MjkzNDU0OTU2MTc2ODY3MzI4.C7G0vA.EAo1wCaxVP-lA_Xgue_apsNS52c";
  clientID = "293454956176867328";
} else if (mode === "development") {
  token = "MjkzODIzMDQ4MzMzNjU2MDc1.C7MLjA.bEE9FxaX32utSG8A7tvqV3N5c4A";
  clientID = "293823048333656075";
} else {
  throw new Error("Invalid environment");
}

console.log(`Mode : ${mode}`);
console.log(`Token : ${token}`);
console.log(`clientID : ${clientID}`);

komada.start({
  botToken: token,
  ownerID: "179916759187456010",
  clientID,
  prefix: "!",
  clientOptions: {
    fetchAllMembers: true,
  },
});
