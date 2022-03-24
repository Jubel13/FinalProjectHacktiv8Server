const { Dealer, Car, Type, Brand } = require("../models");
const { generateToken } = require("../helpers/jwt");
const { comparePassword } = require("../helpers/bcrypt");

let transporter = require("../helpers/nodemailer");

const getDealer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dealer = await Dealer.findByPk(id, {
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
      include: [
        {
          model: Car,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: [
            {
              model: Type,
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
              include: [
                {
                  model: Brand,
                  attributes: {
                    exclude: ["createdAt", "updatedAt"],
                  },
                },
              ],
            },
          ],
        },
      ],
      logging: false,
    });

    if (!dealer) {
      throw {
        code: 404,
        name: "NOT_FOUND",
        message: "Dealer not found",
      };
    }

    res.status(200).json(dealer);
  } catch (err) {
    next(err);
  }
};

const register = async (req, res, next) => {
  try {
    const { name, phoneNumber, email, password, storeName, storeAddress } =
      req.body;

    const dealer = await Dealer.create(
      {
        name,
        phoneNumber,
        email,
        password,
        storeName,
        storeAddress,
      },
      {
        logging: false,
      }
    );

    let mailOptions = {
      from: "jubelsinaga13@gmail.com",
      to: dealer.email,
      subject: "Success registration",
      text: "Thank you for register on our AutoClassic",
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
      logging: false,
    });

    if (foundDealer) {
      const isPassword = comparePassword(password, foundDealer.password);
      if (isPassword) {
        const payload = {
          id: foundDealer.id,
          name: foundDealer.name,
          email: foundDealer.email,
          storeName: foundDealer.storeName,
          phoneNumber: foundDealer.phoneNumber,
          storeAddress: foundDealer.storeAddress,
        };

        res.status(200).json({
          message: "login Succesful",
          id: foundDealer.id,
          email: foundDealer.email,
          name: foundDealer.name,
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

module.exports = { register, login, getDealer };
