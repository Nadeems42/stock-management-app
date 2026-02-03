const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Customer = require('./Customer');
const User = require('./User'); // Technician

const Repair = sequelize.define('Repair', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    job_card_number: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    customer_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Customer,
            key: 'id',
        },
    },
    device_model: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    imei_or_serial: {
        type: DataTypes.STRING,
    },
    issue_description: {
        type: DataTypes.TEXT,
    },
    technician_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('pending', 'in_progress', 'ready', 'completed', 'delivered', 'cancelled'),
        defaultValue: 'pending',
    },
    estimated_cost: {
        type: DataTypes.DECIMAL(10, 2),
    },
    final_cost: {
        type: DataTypes.DECIMAL(10, 2),
    },
    advance_payment: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
    },
    expected_delivery_date: {
        type: DataTypes.DATE,
    },
}, {
    timestamps: true,
});

Repair.belongsTo(Customer, { foreignKey: 'customer_id' });
Customer.hasMany(Repair, { foreignKey: 'customer_id' });
Repair.belongsTo(User, { as: 'Technician', foreignKey: 'technician_id' });

module.exports = Repair;
