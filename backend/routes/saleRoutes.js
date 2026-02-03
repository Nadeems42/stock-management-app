const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createSale, getSales } = require('../controllers/saleController');

router.route('/sales')
    .post(protect, createSale)
    .get(protect, getSales);

module.exports = router;
