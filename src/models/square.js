"use strict";
const {
  Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Square extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Game, {
        foreignKey: "game_id",
      });

      this.hasOne(models.Player, {
        foreignKey: "id",
      });
    }
  }
  Square.init({
    number: DataTypes.INTEGER,
    cards: DataTypes.STRING,
    special_card: DataTypes.STRING,
    game_id: DataTypes.INTEGER,
    player_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: "Square",
  });
  return Square;
};