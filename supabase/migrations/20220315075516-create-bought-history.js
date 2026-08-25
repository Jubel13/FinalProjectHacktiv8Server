"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("BoughtHistories", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      carName: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      boughtDate: {
        type: Sequelize.DATE,
      },
      paidOff: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      price: {
        type: Sequelize.INTEGER,
      },
      BuyerId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Buyers",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("BoughtHistories");
  },
};
