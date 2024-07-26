"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn("Players", "normal_cards", {
      type: Sequelize.TEXT,
      allowNull: true
    });

    return queryInterface.changeColumn("Players", "special_cards", {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn("Players", "normal_cards", {
      type: Sequelize.STRING,
      allowNull: true
    });

    return queryInterface.changeColumn("Players", "special_cards", {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
};
