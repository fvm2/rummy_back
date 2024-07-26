"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn("NormalCards", "createdAt"),
      queryInterface.removeColumn("NormalCards", "updatedAt"),
      queryInterface.removeColumn("SpecialCards", "createdAt"),
      queryInterface.removeColumn("SpecialCards", "updatedAt")
    ]);

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
