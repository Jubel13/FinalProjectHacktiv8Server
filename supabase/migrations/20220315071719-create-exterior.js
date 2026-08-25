"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Exteriors", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      chassis: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      bumper: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      lights: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      roof: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      spion: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      windShield: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      kacaSamping: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      kacaBelakang: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      tire: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      InspectionId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Inspections",
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
    await queryInterface.dropTable("Exteriors");
  },
};
