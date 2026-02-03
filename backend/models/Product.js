const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Category = require('./Category');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    category_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Category,
            key: 'id',
        },
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sku: {
        type: DataTypes.STRING,
        unique: true,
    },
    imei_trackable: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    cost_price: {
        type: DataTypes.DECIMAL(10, 2),
    },
    stock_quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    min_stock_alert: {
        type: DataTypes.INTEGER,
        defaultValue: 5,
    },
    image_url: {
        type: DataTypes.STRING,
    },
}, {
    timestamps: true,
});

Product.belongsTo(Category, { foreignKey: 'category_id' });
Category.hasMany(Product, { foreignKey: 'category_id' });

module.exports = Product;
