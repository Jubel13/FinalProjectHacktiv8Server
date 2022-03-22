const { Buyer } = require("../models");
const { generateToken } = require("../helpers/jwt");
const { comparePassword } = require("../helpers/bcrypt");

const transporter = require("../helpers/nodemailer");

const register = async (req, res, next) => {
  try {
    const { username, email, password, address, phoneNumber } = req.body;

    const buyer = await Buyer.create({
      username,
      email,
      password,
      address,
      phoneNumber,
    });

    let mailOptions = {
      from: "jubelsinaga13@gmail.com",
      to: buyer.email,
      subject: "Success registration",
      text: "Thank you for register on AutoClassic",
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
      .json({ id: buyer.id, name: buyer.username, email: buyer.email });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const foundBuyer = await Buyer.findOne({
      where: {
        email,
      },
    });

    if (foundBuyer) {
      const isPass = comparePassword(password, foundBuyer.password);
      if (isPass) {
        const payload = {
          id: foundBuyer.id,
          name: foundBuyer.username,
          email: foundBuyer.email,
          phoneNumber: foundBuyer.phoneNumber,
          address: foundBuyer.address,
        };

        res.status(200).json({
          message: "Login as Buyer successfull",
          id: foundBuyer.id,
          email: foundBuyer.email,
          username: foundBuyer.username,
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
