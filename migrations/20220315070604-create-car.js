"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Cars", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      fuel: {
        type: Sequelize.STRING,
      },
      seats: {
        type: Sequelize.INTEGER,
      },
      mileage: {
        type: Sequelize.INTEGER,
      },
      price: {
        type: Sequelize.INTEGER,
      },
      color: {
        type: Sequelize.STRING,
      },
      yearMade: {
        type: Sequelize.DATE,
      },
      passedInspection: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      DealerId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Dealers",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      TypeId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Types",
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
    await queryInterface.dropTable("Cars");
  },
};