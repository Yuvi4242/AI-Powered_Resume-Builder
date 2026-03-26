const User = require('../models/User');
const Otp = require('../models/Otp');
const jwt = require('jsonwebtoken');
const { sendEmailOTP } = require('../services/emailService');
const { sendSMSOTP, isTwilioConfigured } = require('../services/smsService');

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// Save OTP to database
const saveOTP = async (email, phone, otp) => {
  // Delete existing OTPs for this email/phone
  await Otp.deleteMany({
    $or: [
      { email },
      { phone },
    ],
  });

  // Create new OTP with 2-minute expiry
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
  await Otp.create({
    email,
    phone,
    otp,
    expiresAt,
  });
};

// Verify OTP
const verifyOTP = async (email, phone, otp) => {
  const otpRecord = await Otp.findOne({
    $or: [
      { email, otp },
      { phone, otp },
    ],
  });

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
    const { email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email or phone',
      });
    }

    // Check if user already exists
    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered',
        });
      }
    }

    if (phone) {
      const existingPhone = await User.findOne({ phone });
      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: 'Phone already registered',
        });
      }
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP to database
    await saveOTP(email, phone, otp);

    // Send OTP via email
    if (email) {
      try {
        await sendEmailOTP(email, otp);
      } catch (error) {
        console.error('Email sending failed:', error.message);
      }
    }

    // Send OTP via SMS
    if (phone) {
      try {
        await sendSMSOTP(phone, otp);
      } catch (error) {
        console.error('SMS sending failed:', error.message);
        if (!email) {
          return res.status(500).json({
            success: false,
            message: 'Failed to send SMS verification code',
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      message: 'Verification code sent successfully',
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
    const { name, email, phone, password, otp } = req.body;

    if (!name || !password || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Verify OTP using database
    const otpResult = await verifyOTP(email, phone, otp);
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
      phone,
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
        phone: user.phone,
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
    const { email, phone, password } = req.body;

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email or phone number',
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide password',
      });
    }

    // Find user by email or phone
    let user;
    if (email) {
      user = await User.findOne({ email: email.toLowerCase() });
    } else if (phone) {
      user = await User.findOne({ phone });
    }

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
        phone: user.phone,
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
    const { email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email or phone',
      });
    }

    // Find user
    let user;
    if (email) {
      user = await User.findOne({ email: email.toLowerCase() });
    } else if (phone) {
      user = await User.findOne({ phone });
    }

    if (!user) {
      // Don't reveal if user exists
      return res.status(200).json({
        success: true,
        message: 'If an account exists, an OTP will be sent',
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP with type for password reset
    await saveOTP(email, phone, otp);

    // Send OTP via email
    if (email) {
      try {
        await sendEmailOTP(email, otp, 'Password Reset');
      } catch (error) {
        console.error('Email sending failed:', error.message);
      }
    }

    // Send OTP via SMS
    if (phone) {
      if (isTwilioConfigured()) {
        try {
          await sendSMSOTP(phone, otp);
        } catch (error) {
          console.error('SMS sending failed:', error.message);
        }
      }
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
    const { email, phone, otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide OTP',
      });
    }

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email or phone',
      });
    }

    // Verify OTP
    const otpResult = await verifyOTP(email, phone, otp);
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
    const { email, phone, newPassword } = req.body;

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

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email or phone',
      });
    }

    // Find user
    let user;
    if (email) {
      user = await User.findOne({ email: email.toLowerCase() });
    } else if (phone) {
      user = await User.findOne({ phone });
    }

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

// ============================================
// PHONE LOGIN FLOW (OTP-based)
// ============================================

// @route   POST /api/auth/login-otp
// @desc    Send OTP to existing user for phone login
// @access  Public
const loginOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a phone number',
      });
    }

    // Check if user exists
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this phone number',
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP to database
    await saveOTP(null, phone, otp);

    // Send SMS via Twilio Messaging API
    try {
      await sendSMSOTP(phone, otp);
      res.status(200).json({
        success: true,
        message: 'Verification code sent to your phone',
      });
    } catch (error) {
      console.error('sendSMSOTP failed:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to send verification code: ' + error.message,
      });
    }
  } catch (error) {
    console.error('Login OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @route   POST /api/auth/login-verify
// @desc    Verify OTP and log in user
// @access  Public
const loginVerify = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide phone and verification code',
      });
    }

    // Verify code via Database
    const otpResult = await verifyOTP(null, phone, otp);
    if (!otpResult.valid) {
      return res.status(400).json({
        success: false,
        message: otpResult.message,
      });
    }

    // Find user
    const user = await User.findOne({ phone });
    
    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error('Login Verify Error:', error);
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
  loginOTP,
  loginVerify,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
};
