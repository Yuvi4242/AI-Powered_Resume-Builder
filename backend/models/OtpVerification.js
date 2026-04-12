const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  otp: { type: String, required: true },
  verified: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('OtpVerification', otpSchema);
