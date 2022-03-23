const { Admin } = require("../models");
const { generateToken } = require("../helpers/jwt");
const { comparePassword } = require("../helpers/bcrypt");

const register = async (req, res, next) => {
  try {
    const { name, phoneNumber, email, password } = req.body;

    const admin = await Admin.create({ name, phoneNumber, email, password });

    res.status(201).json({ message: "Register for admin success" });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const foundAdmin = await Admin.findOne({
      where: {
        email,
      },
    });

    if (!foundAdmin) {
      throw {
        code: 401,
        name: "UNAUTHORIZED",
        message: "Invalid email or password",
      };
    }

    const isPassword = comparePassword(password, foundAdmin.password);

    if (!isPassword) {
      throw {
        code: 401,
        name: "UNAUTHORIZED",
        message: "Invalid email or password",
      };
    }

    const payload = {
      id: foundAdmin.id,
      name: foundAdmin.name,
      role: foundAdmin.role,
      phoneNumber: foundAdmin.phoneNumber,
      email: foundAdmin.email,
    };

    console.log(payload);

    res.status(200).json({
      message: "Login as admin success",
      email: foundAdmin.email,
      access_token: generateToken(payload),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
