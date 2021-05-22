// import important parts of sequelize library
const { Model, DataTypes, Sequelize } = require('sequelize');
// import our database connection from config.js
const sequelize = require('../config/connection');
const Category = require('./Category');

// Initialize Product model (table) by extending off Sequelize's Model class
class Product extends Model {}

// set up fields and rules for Product model
Product.init(
  {
    // define columns PRODUCTNAME
    product_name: DataTypes.STRING,
    price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      validate: {
        isDecimal: true,
        notNull: true
      }, 
    },
    stock: {
      type: DataTypes.INTEGER, 
      allowNull: false,
      defaultValue: 10,
      validate: {
        isInt: true
      },
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'category',
        key: "id",
      }
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product',
  }
);

Product.hasOne(Category, {
  as: 'category',
  foreignKey: 'id'
});

Product.sync()

module.exports = Product;
