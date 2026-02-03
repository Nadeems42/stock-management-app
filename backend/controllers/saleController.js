const { models, sequelize } = require('../models');
const { Sale, SaleItem, Product, Customer } = models;

// @desc    Create a new sale (POS)
// @route   POST /api/sales
// @access  Staff/Admin
const createSale = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const {
            customer_id,
            customer_name,
            customer_phone,
            items,
            subtotal,
            tax_amount,
            discount_amount,
            total_amount,
            payment_method
        } = req.body;

        // 1. Handle Customer (Find or Create)
        let finalCustomerId = customer_id;
        if (!finalCustomerId && customer_phone) {
            let customer = await Customer.findOne({ where: { phone: customer_phone } });
            if (!customer) {
                customer = await Customer.create({
                    name: customer_name || 'Walk-in Customer',
                    phone: customer_phone
                }, { transaction: t });
            }
            finalCustomerId = customer.id;
        }

        // 2. Generate Invoice Number (Simple timestamp based for now)
        const invoice_number = 'INV-' + Date.now();

        // 3. Create Sale Record
        const sale = await Sale.create({
            customer_id: finalCustomerId,
            user_id: req.user.id,
            invoice_number,
            subtotal,
            tax_amount,
            discount_amount,
            total_amount,
            payment_method,
            status: 'completed'
        }, { transaction: t });

        // 4. Create Sale Items and Update Stock
        for (const item of items) {
            // Check Stock
            const product = await Product.findByPk(item.product_id);
            if (!product) {
                throw new Error(`Product ${item.product_id} not found`);
            }

            if (product.stock_quantity < item.quantity) {
                throw new Error(`Insufficient stock for ${product.name}`);
            }

            // Deduct Stock
            await product.decrement('stock_quantity', { by: item.quantity, transaction: t });

            // Create Item Record
            await SaleItem.create({
                sale_id: sale.id,
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.unit_price,
                total_price: item.total_price,
                imei_number: item.imei_number || null
            }, { transaction: t });
        }

        await t.commit();

        // Fetch full sale object to return
        const fullSale = await Sale.findByPk(sale.id, {
            include: [
                { model: Customer },
                { model: SaleItem, include: [Product] }
            ]
        });

        res.status(201).json(fullSale);

    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(400).json({ message: error.message || 'Sale failed' });
    }
};

// @desc    Get all sales
// @route   GET /api/sales
// @access  Admin/Staff
const getSales = async (req, res) => {
    try {
        const sales = await Sale.findAll({
            include: [{ model: Customer }],
            order: [['createdAt', 'DESC']]
        });
        res.json(sales);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { createSale, getSales };
