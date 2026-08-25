"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Inspections", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      mainInspection: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      exteriorInspection: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      interiorInspection: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      roadTest: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      kolongTest: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      CarId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Cars",
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
    await queryInterface.dropTable("Inspections");
  },
};
