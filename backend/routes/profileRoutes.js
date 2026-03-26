const express = require('express');
const router = express.Router();
const { getMyProfile, updateProfile, uploadProfileImage } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Get current user profile
router.get('/me', protect, getMyProfile);

// Update user profile
router.put('/update', protect, updateProfile);

// Upload profile photo
router.post('/upload-photo', protect, upload.single('profileImage'), uploadProfileImage);

module.exports = router;
