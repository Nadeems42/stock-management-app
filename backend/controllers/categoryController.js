const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public (or Protected)
const getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Admin/Staff
const createCategory = async (req, res) => {
    try {
        const { name, type } = req.body;
        const category = await Category.create({ name, type });
        res.status(201).json(category);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Invalid category data' });
    }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Admin
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (category) {
            await category.destroy();
            res.json({ message: 'Category removed' });
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getCategories, createCategory, deleteCategory };
