"use strict";
const {
  Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Player, {
        foreignKey: "user_id",
      });
    }
  }
  User.init({
    mail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [4, 30],
        notEmpty: true,
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 255],
        is: /^(?=.*[A-Z])(?=.*\d).+$/,
        notEmpty: true,
      }
    },
    wins: {
      type: DataTypes.INTEGER,
    },
    played_matches: {
      type: DataTypes.INTEGER,
    }
  }, {
    sequelize,
    modelName: "User",
  });
  return User;
};