"use strict";

const data = require("../data/images.json");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    data.forEach((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });

    await queryInterface.bulkInsert("Images", data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Images", null, {});
  },
};
