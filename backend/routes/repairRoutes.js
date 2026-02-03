const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createRepair, getRepairs, updateRepairStatus } = require('../controllers/repairController');

router.route('/repairs')
    .post(protect, createRepair)
    .get(protect, getRepairs);

router.route('/repairs/:id')
    .put(protect, updateRepairStatus);

module.exports = router;
