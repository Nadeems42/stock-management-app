const { sequelize } = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const Supplier = require('./Supplier');
const Customer = require('./Customer');
const Sale = require('./Sale');
const SaleItem = require('./SaleItem');
const Repair = require('./Repair');

// Associations are defined in the model files themselves, 
// but we can ensure they are loaded here.

const models = {
    User,
    Category,
    Product,
    Supplier,
    Customer,
    Sale,
    SaleItem,
    Repair,
};

module.exports = { sequelize, models };
