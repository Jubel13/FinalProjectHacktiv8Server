"use strict";
const { Model } = require("sequelize");
const { hashPassword } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class Dealer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Dealer.hasMany(models.Car, { foreignKey: "DealerId" });
    }
  }
  Dealer.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Name is required",
          },
          notEmpty: {
            msg: "Name is required",
          },
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Phone is required",
          },
          notEmpty: {
            msg: "Phone is required",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Email is required",
          },
          notEmpty: {
            msg: "Email is required",
          },
          isEmail: {
            msg: "Must be an email format",
          },
        },
        unique: {
          args: true,
          msg: "Email must be unique",
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Password is required",
          },
          notEmpty: {
            msg: "Password is required",
          },
          len: {
            args: [5],
            msg: "Password must be at least 5 character",
          },
        },
      },
      storeName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Store name is required",
          },
          notEmpty: {
            msg: "Store name is required",
          },
        },
      },
      storeAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Store address is required",
          },
          notEmpty: {
            msg: "Store address is required",
          },
        },
      },
    },
    {
      hooks: {
        beforeCreate: (dealer) => {
          dealer.password = hashPassword(dealer.password);
        },
      },
      sequelize,
      modelName: "Dealer",
    }
  );
  return Dealer;
};
