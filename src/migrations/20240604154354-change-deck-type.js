"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.changeColumn("Games", "deck", {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.changeColumn("Games", "deck", {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
};
