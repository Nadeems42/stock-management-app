const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Customer = require('./Customer');
const User = require('./User'); // Staff who made the sale

const Sale = sequelize.define('Sale', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    customer_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Customer,
            key: 'id',
        },
        allowNull: true, // Walk-in customer maybe?
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
    },
    invoice_number: {
        type: DataTypes.STRING,
        unique: true,
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
    },
    tax_amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
    },
    discount_amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    payment_method: {
        type: DataTypes.ENUM('cash', 'card', 'upi', 'split'),
        defaultValue: 'cash',
    },
    status: {
        type: DataTypes.ENUM('completed', 'returned', 'void'),
        defaultValue: 'completed',
    },
}, {
    timestamps: true,
});

Sale.belongsTo(Customer, { foreignKey: 'customer_id' });
Customer.hasMany(Sale, { foreignKey: 'customer_id' });
Sale.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Sale, { foreignKey: 'user_id' });

module.exports = Sale;
