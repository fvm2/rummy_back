"use strict";
const {
  Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Game extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Player, {
        foreignKey: "game_id",
      });

      // Nueva asociación
      this.hasMany(models.Square, {
        foreignKey: "game_id",
      });
    }
  }
  Game.init({
    status: DataTypes.INTEGER,
    deck: DataTypes.STRING,
    turn: DataTypes.INTEGER,
    playing_time: DataTypes.INTEGER,
    initial_cards: DataTypes.INTEGER,
    shop: DataTypes.STRING
  }, {
    sequelize,
    modelName: "Game",
  });
  return Game;
};