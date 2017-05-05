/* eslint-disable */
const pgp = require("pg-promise")();

exports.run = (client, msg) => {
  const cn = {
    host: "process.env.DATABASE_URL",
  };
  const db = pgp(cn);
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
