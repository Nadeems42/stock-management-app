const { models, sequelize } = require('../models');
const { Repair, Customer, User } = models;

const generateJobCardNumber = () => {
    return 'JC-' + Math.floor(100000 + Math.random() * 900000); // Simple 6 digit random
};

// @desc    Create a new repair job
// @route   POST /api/repairs
// @access  Staff/Admin
const createRepair = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const {
            customer_name,
            customer_phone,
            device_model,
            imei_or_serial,
            issue_description,
            estimated_cost,
            advance_payment,
            technician_id
        } = req.body;

        // 1. Find or Create Customer
        let customer = await Customer.findOne({ where: { phone: customer_phone } });
        if (!customer) {
            customer = await Customer.create({
                name: customer_name,
                phone: customer_phone
            }, { transaction: t });
        }

        // 2. Create Repair Record
        const repair = await Repair.create({
            job_card_number: generateJobCardNumber(),
            customer_id: customer.id,
            device_model,
            imei_or_serial,
            issue_description,
            estimated_cost,
            advance_payment: advance_payment || 0,
            technician_id: technician_id || null, // Optional at start
            status: 'pending'
        }, { transaction: t });

        await t.commit();
        res.status(201).json(repair);

    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(400).json({ message: 'Failed to create job card' });
    }
};

// @desc    Get all repairs
// @route   GET /api/repairs
// @access  Staff/Admin
const getRepairs = async (req, res) => {
    try {
        const repairs = await Repair.findAll({
            include: [
                { model: Customer },
                { model: User, as: 'Technician', attributes: ['id', 'name'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(repairs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update repair status
// @route   PUT /api/repairs/:id
// @access  Staff/Admin
const updateRepairStatus = async (req, res) => {
    try {
        const repair = await Repair.findByPk(req.params.id);
        const { status, final_cost, technician_id } = req.body;

        if (repair) {
            repair.status = status || repair.status;
            repair.final_cost = final_cost || repair.final_cost;
            repair.technician_id = technician_id || repair.technician_id;

            await repair.save();
            res.json(repair);
        } else {
            res.status(404).json({ message: 'Repair not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { createRepair, getRepairs, updateRepairStatus };
