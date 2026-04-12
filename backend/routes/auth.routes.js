const express = require('express');
const { sendOtp, verifyOtp, signup, signin, signout } = require('../controllers/auth.controller.js');

const router = express.Router();

router.post('/send-otp', sendOtp);       // Signup Step 1
router.post('/verify-otp', verifyOtp);   // Signup Step 2
router.post('/signup', signup);          // Signup Step 3
router.post('/signin', signin);          // Login
router.post('/signout', signout);        // Logout

module.exports = router;
