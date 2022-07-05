'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "userId",
        as: "userid"
      })
      this.belongsTo(models.Category, {
        foreignKey: "id",
        as: "category"
      })
    }
  }
  Product.init({
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    type: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "User",
        key: "id"
      }
    },
    categoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Category",
        key: "id"
      }
    }
  }, {
    sequelize,
    paranoid: true,
    modelName: 'Product',
  });
  return Product;
};