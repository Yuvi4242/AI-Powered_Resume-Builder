const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    skills: {
      type: String,
      default: '',
    },
    education: {
      type: String,
      default: '',
    },
    experience: {
      type: String,
      default: '',
    },
    summary: {
      type: String,
      default: '',
    },
    template: {
      type: String,
      default: 'template1',
    },
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;
