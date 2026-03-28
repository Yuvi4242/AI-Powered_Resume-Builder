const User = require('../models/User');
const Otp = require('../models/Otp');
const { sendEmailOTP } = require('../services/emailService');
const { signAccessToken } = require('../utils/jwt');

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate JWT token
const generateToken = (id) => {
  return signAccessToken({ id }, { expiresIn: '7d' });
};

// Save OTP to database
const saveOTP = async (email, otp) => {
  // Delete existing OTPs for this email
  await Otp.deleteMany({ email });

  // Create new OTP with 2-minute expiry
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
  await Otp.create({
    email,
    otp,
    expiresAt,
  });
};

// Verify OTP
const verifyOTP = async (email, otp) => {
  const otpRecord = await Otp.findOne({ email, otp });

  if (!otpRecord) {
    return { valid: false, message: 'Invalid OTP' };
  }

  if (otpRecord.expiresAt < new Date()) {
    return { valid: false, message: 'OTP expired' };
  }

  // Delete OTP after verification
  await Otp.deleteOne({ _id: otpRecord._id });

  return { valid: true, message: 'OTP verified' };
};

// ============================================
// SIGNUP FLOW (OTP-based)
// ============================================

// @route   POST /api/auth/signup-otp
// @desc    Send OTP for signup
// @access  Public
const signupOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email',
      });
    }

    // Check if user already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP to database
    await saveOTP(email, otp);

    // Send OTP via email
    try {
      await sendEmailOTP(email, otp);
    } catch (error) {
      console.error('Email sending failed:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification code to your email',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Verification code sent successfully to your email',
    });
  } catch (error) {
    console.error('Signup OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @route   POST /api/auth/signup-verify
// @desc    Verify OTP and create account
// @access  Public
const signupVerify = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    if (!name || !email || !password || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Verify OTP using database
    const otpResult = await verifyOTP(email, otp);
    if (!otpResult.valid) {
      return res.status(400).json({
        success: false,
        message: otpResult.message,
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      isVerified: true,
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Signup Verify Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// ============================================
// LOGIN FLOW (Password-based)
// ============================================

// @route   POST /api/auth/login
// @desc    Login with email/phone and password
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email',
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide password',
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// ============================================
// FORGOT PASSWORD FLOW (OTP-based)
// ============================================

// @route   POST /api/auth/forgot-password
// @desc    Send OTP for password reset
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email',
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal if user exists
      return res.status(200).json({
        success: true,
        message: 'If an account exists, an OTP will be sent',
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP
    await saveOTP(email, otp);

    // Send OTP via email
    try {
      await sendEmailOTP(email, otp, 'Password Reset');
    } catch (error) {
      console.error('Email sending failed:', error.message);
    }

    res.status(200).json({
      success: true,
      message: 'If an account exists, an OTP will be sent',
    });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @route   POST /api/auth/verify-reset-otp
// @desc    Verify OTP for password reset
// @access  Public
const verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide OTP',
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email',
      });
    }

    // Verify OTP
    const otpResult = await verifyOTP(email, otp);
    if (!otpResult.valid) {
      return res.status(400).json({
        success: false,
        message: otpResult.message,
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP verified. You can now reset your password',
    });
  } catch (error) {
    console.error('Verify Reset OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @route   POST /api/auth/reset-password
// @desc    Reset password after OTP verification
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide new password',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email',
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};



module.exports = {
  signupOTP,
  signupVerify,
  login,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
};
