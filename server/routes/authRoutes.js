const express = require('express');
const { getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/me', protect, getMe); // Get user details after verifying token

module.exports = router;