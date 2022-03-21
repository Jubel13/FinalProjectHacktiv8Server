"use strict";

const data = require("../data/cars.json");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    data.forEach((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });

    await queryInterface.bulkInsert("Cars", data, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("cars", null, {})
  },
};
