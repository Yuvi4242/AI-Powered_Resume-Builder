const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Public status route for debugging
router.get('/status', (req, res) => res.json({ success: true, message: 'User routes are active' }));

module.exports = router;
