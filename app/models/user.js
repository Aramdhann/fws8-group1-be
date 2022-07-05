'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Product, {
        foreignKey: "userId"
      })
    }
  }
  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.STRING,
    city: DataTypes.STRING,
    address: DataTypes.STRING,
    image: DataTypes.STRING,
    refresh_token: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};