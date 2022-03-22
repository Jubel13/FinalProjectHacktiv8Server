const { generatePayload } = require("../helpers/jwt");
const { Buyer } = require("../models");

const buyerAuthentication = async (req, res, next) => {
  try {
    const { access_token } = req.headers;

    const payload = generatePayload(access_token);

    if (!payload.email) {
      throw {
        code: 401,
        name: "INVALID_TOKEN",
        message: "Invalid token or user",
      };
    }

    const buyer = await Buyer.findOne({ where: { email: payload.email } });

    if (!buyer) {
      throw {
        code: 401,
        name: "INVALID_TOKEN",
        message: "Invalid token or user",
      };
    }

    req.loginBuyer = {
      id: buyer.id,
      name: buyer.username,
      email: buyer.email,
      phoneNumber: buyer.phoneNumber,
      address: buyer.address,
    };

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = buyerAuthentication;
