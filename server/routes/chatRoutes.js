const express = require('express');
const { handleChat } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware'); // Protect chat endpoint
const router = express.Router();

router.post('/', protect, handleChat);

module.exports = router;