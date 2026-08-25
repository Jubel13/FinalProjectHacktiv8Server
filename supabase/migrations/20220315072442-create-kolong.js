"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Kolongs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      oliMesin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      transmission: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      minyakRem: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      radiator: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      aki: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      bottomCover: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      knalpot: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      kestabilanBan: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      shockBreaker: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      masterBrake: {
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
    await queryInterface.dropTable("Kolongs");
  },
};
