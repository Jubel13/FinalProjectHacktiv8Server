"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("RoadTests", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      engineStarting: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      engineIdling: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      steeringSystem: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      acceleration: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      engineSound: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      brake: {
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
    await queryInterface.dropTable("RoadTests");
  },
};
