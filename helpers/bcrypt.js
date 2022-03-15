const bcrypt = require("bcryptjs");

function hashPassword(password) {
  let salt = bcrypt.genSaltSync(8);
  let hashed = bcrypt.hashSync(password, salt);
  return hashed;
}

function comparePassword(inputtedPass, hashedPassword) {
  return bcrypt.compareSync(inputtedPass, hashedPassword);
}

module.exports = { hashPassword, comparePassword };
