const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// TTL index for auto-expiration (5 minutes)
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 300 });

const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;
