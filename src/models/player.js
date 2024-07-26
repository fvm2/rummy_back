"use strict";
const {
  Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Game, {
        foreignKey: "game_id",
      });

      this.belongsTo(models.User, {
        foreignKey: "user_id",
      });

    }
  }
  Player.init({
    number: DataTypes.INTEGER,
    points: DataTypes.INTEGER,
    has_played: DataTypes.BOOLEAN,
    normal_cards: DataTypes.STRING,
    special_cards: DataTypes.STRING,
    game_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: "Player",
  });
  return Player;
};