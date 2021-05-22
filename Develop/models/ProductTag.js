const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection');
const Product = require('./Product')
const Tag = require('./Tag');

class ProductTag extends Model {}

ProductTag.init(
  {
    // define columns
    product_id: DataTypes.INTEGER,
    tag_id: DataTypes.INTEGER
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product_tag',
  }
);

Tag.belongsToMany(Product, {
  through: ProductTag,
  as: 'products',
  foreignKey: 'tag_id'
});

Product.belongsToMany(Tag, {
  through:  ProductTag,
  as: 'tags',
  foreignKey: 'product_id'
});

ProductTag.sync();

module.exports = ProductTag;
