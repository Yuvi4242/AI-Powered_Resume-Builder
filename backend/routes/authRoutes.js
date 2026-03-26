const express = require('express');
const router = express.Router();
const { 
  signupOTP, 
  signupVerify, 
  login,
  loginOTP,
  loginVerify,
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
router.post('/login-otp', loginOTP);
router.post('/login-verify', loginVerify);

// ============================================
// FORGOT PASSWORD ROUTES (OTP-based)
// ============================================
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOTP);
router.post('/reset-password', resetPassword);

module.exports = router;
