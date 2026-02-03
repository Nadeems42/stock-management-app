const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Sale = require('./Sale');
const Product = require('./Product');

const SaleItem = sequelize.define('SaleItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    sale_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Sale,
            key: 'id',
        },
    },
    product_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'id',
        },
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    unit_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false, // Price at time of sale
    },
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    imei_number: {
        type: DataTypes.STRING, // For phones
        allowNull: true,
    },
}, {
    timestamps: false,
});

SaleItem.belongsTo(Sale, { foreignKey: 'sale_id' });
Sale.hasMany(SaleItem, { foreignKey: 'sale_id' });
SaleItem.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = SaleItem;
