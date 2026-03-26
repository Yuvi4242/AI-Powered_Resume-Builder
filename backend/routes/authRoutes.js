const express = require('express');
const router = express.Router();
const { 
  signupOTP, 
  signupVerify, 
  login,
  forgotPassword,
  verifyResetOTP, 
  resetPassword 
} = require('../controllers/authController');

// ============================================
// SIGNUP ROUTES (OTP-based)
// ============================================
router.post('/signup-otp', signupOTP);
router.post('/signup-verify', signupVerify);

// ============================================
// LOGIN ROUTES (Password-based)
// ============================================
router.post('/login', login);

// ============================================
// FORGOT PASSWORD ROUTES (OTP-based)
// ============================================
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOTP);
router.post('/reset-password', resetPassword);

module.exports = router;
