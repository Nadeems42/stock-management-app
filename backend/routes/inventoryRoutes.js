const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getCategories, createCategory, deleteCategory } = require('../controllers/categoryController');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');

// Categories
router.route('/categories')
    .get(protect, getCategories)
    .post(protect, createCategory);
router.route('/categories/:id')
    .delete(protect, admin, deleteCategory);

// Products
router.route('/products')
    .get(protect, getProducts)
    .post(protect, createProduct);
router.route('/products/:id')
    .get(protect, getProductById)
    .put(protect, updateProduct)
    .delete(protect, admin, deleteProduct);

module.exports = router;
