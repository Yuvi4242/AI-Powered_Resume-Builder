const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OtpVerification = require('../models/OtpVerification');
const { sendOtpEmail } = require('../utils/mailer');

// Helper: generate 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Helper: generate JWT
const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

/* ─────────────────────────────
   SIGNUP — STEP 1: SEND OTP
───────────────────────────── */
const sendOtp = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) return res.status(400).json({ message: 'Name and email are required' });

    // Check if already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: 'Email already registered. Please sign in.' });

    // Delete any previous OTP for this email
    await OtpVerification.deleteMany({ email });

    // Generate and save OTP
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await OtpVerification.create({ name, email, otp, verified: false, expiresAt });

    // Send OTP via Nodemailer
    await sendOtpEmail(email, otp);

    return res.status(200).json({ message: 'OTP sent to your email' });
  } catch (err) {
    console.error('sendOtp error:', err);
    return res.status(500).json({ message: 'Failed to send OTP. Try again.' });
  }
};


/* ─────────────────────────────
   SIGNUP — STEP 2: VERIFY OTP
───────────────────────────── */
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

    const record = await OtpVerification.findOne({ email });

    if (!record) return res.status(404).json({ message: 'OTP not found. Please restart signup.' });
    if (new Date() > record.expiresAt) return res.status(410).json({ message: 'OTP expired. Please resend.' });
    if (record.otp !== otp) return res.status(401).json({ message: 'Invalid OTP. Try again.' });

    // Mark as verified
    record.verified = true;
    await record.save();

    return res.status(200).json({ message: 'Email verified successfully' });
  } catch (err) {
    console.error('verifyOtp error:', err);
    return res.status(500).json({ message: 'Verification failed. Try again.' });
  }
};


/* ─────────────────────────────
   SIGNUP — STEP 3: CREATE ACCOUNT
───────────────────────────── */
const signup = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword)
      return res.status(400).json({ message: 'All fields are required' });

    if (password !== confirmPassword)
      return res.status(400).json({ message: 'Passwords do not match' });

    if (password.length < 8)
      return res.status(400).json({ message: 'Password must be at least 8 characters' });

    // Check OTP was verified
    const otpRecord = await OtpVerification.findOne({ email, verified: true });
    if (!otpRecord) return res.status(403).json({ message: 'Email not verified. Please complete OTP step.' });

    // Hash password and create user
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name: otpRecord.name, email, passwordHash });

    // Delete OTP record
    await OtpVerification.deleteMany({ email });

    // Issue JWT
    const token = generateToken(user._id);

    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('signup error:', err);
    return res.status(500).json({ message: 'Signup failed. Try again.' });
  }
};


/* ─────────────────────────────
   SIGN IN
───────────────────────────── */
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const token = generateToken(user._id);

    return res.status(200).json({
      message: 'Signed in successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('signin error:', err);
    return res.status(500).json({ message: 'Sign in failed. Try again.' });
  }
};


/* ─────────────────────────────
   SIGN OUT
───────────────────────────── */
const signout = async (req, res) => {
  // JWT is stateless — client clears the token
  return res.status(200).json({ message: 'Signed out successfully' });
};

module.exports = {
  sendOtp,
  verifyOtp,
  signup,
  signin,
  signout
};
