const { Dealer } = require("../models");
const { generateToken } = require("../helpers/jwt");
const { comparePassword } = require("../helpers/bcrypt");
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});

const register = async (req, res, next) => {
  try {
    const { name, phoneNumber, email, password, storeName, storeAddress } =
      req.body;

    const dealer = await Dealer.create({
      name,
      phoneNumber,
      email,
      password,
      storeName,
      storeAddress,
    });

    let mailOptions = {
      from: "jubelsinaga13@gmail.com",
      to: dealer.email,
      subject: "Success registration",
      text: "Thank you for register on our website",
    };

    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Email sent successfully");
      }
    });

    res
      .status(201)
      .json({ id: dealer.id, name: dealer.name, email: dealer.email });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    const foundDealer = await Dealer.findOne({
      where: {
        email,
      },
    });

    if (foundDealer) {
      const isPassword = comparePassword(password, foundDealer.password);
      if (isPassword) {
        const payload = {
          id: foundDealer.id,
          name: foundDealer.name,
          email: foundDealer.email,
          storeName: foundDealer.storeName,
        };

        res.status(200).json({
          message: "login Succesful",
          access_token: generateToken(payload),
        });
      } else {
        throw {
          code: 401,
          name: "UNAUTHORIZED",
          message: "Invalid email or password",
        };
      }
    } else {
      throw {
        code: 401,
        name: "UNAUTHORIZED",
        message: "Invalid email or password",
      };
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
