"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("SpecialCards", [
      {
        power: "Dog",
        description: "This card gives 4 random cards from the deck to the next player.",
        image: "https://media.x-decks.com/wp-content/uploads/20240409153144/Screenshot-2022-07-26-at-18-56-46-Pack-of-Dogs-Playing-Cards.png",
      },
      {
        power: "Magician",
        description: "Simplemente Meruane. El poder (y el chiste) viene por separado.",
        image: "https://showpass.cl/storage/artist/photo_99f4e97b7f9e212f0d2c0b8ecd9310e5_1024x1024.webp",
      },
      {
        power: "Eyes",
        description: "This card allows you to see the cards of the one player.",
      },
      {
        power: "Hands",
        description: "This card has the power to swap the hands of the players to the right.",
      },
      {
        power: "Skip",
        description: "This card blocks your turn.",
      },
      {
        power: "Probability",
        description: "This card allows you to add a specific card to the deck, increasing its probability to appear.",
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("SpecialCards", null, {});
  }
};
