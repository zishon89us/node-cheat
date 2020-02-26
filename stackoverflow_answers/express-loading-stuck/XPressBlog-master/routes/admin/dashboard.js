
const express = require('express');
const dashboardController = require('../../controllers/admin/dashboard');

// Express router
const router = express.Router();

// Display Dashboard
router.get('/', dashboardController.displayDashboard);

module.exports = router;
