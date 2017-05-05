const pgp = require("pg-promise")();

const cn = {
  host: "process.env.DATABASE_URL",
};
const db = pgp(cn);

exports.run = (client, msg) => {

};

exports.conf = {
  enabled: false,
  runIn: ["dm"],
  aliases: [],
  permLevel: 10,
  botPerms: [],
  requiredFuncs: [],
};

exports.help = {
  name: "pgtest",
  description: "postgreSQL test",
  usage: "",
  usageDelim: "",
  extendedHelp: "",
};
