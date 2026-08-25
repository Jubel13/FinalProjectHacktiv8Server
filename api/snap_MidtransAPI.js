const CLIENT_KEY = process.env.CLIENT_KEY;
const AUTHORIZATION = process.env.AUTHORIZATION;

const midtransClient = require("midtrans-client");

let snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: AUTHORIZATION,
  clientKey: CLIENT_KEY,
});

module.exports = snap 
