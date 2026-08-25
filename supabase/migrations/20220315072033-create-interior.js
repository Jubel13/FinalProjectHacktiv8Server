"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Interiors", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      speedometer: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      klakson: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      steeringWheel: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      rearViewMirror: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      dashboard: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      seats: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      gasPedal: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      brakePedal: {
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
    await queryInterface.dropTable("Interiors");
  },
};
