"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        //name: 'usuario_prueba1',
        mail: "prueba1@example.com",
        username: "prueba1",
        password: "12345678",
        wins: 0,
        played_matches: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        //name: 'usuario_prueba2',
        mail: "prueba2@example.com",
        username: "prueba2",
        password: "12345678",
        wins: 0,
        played_matches: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        //name: 'usuario_prueba3',
        mail: "prueba3@example.com",
        username: "prueba3",
        password: "12345678",
        wins: 0,
        played_matches: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        //name: 'usuario_prueba4',
        mail: "prueba4@example.com",
        username: "prueba4",
        password: "12345678",
        wins: 0,
        played_matches: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  }
};
