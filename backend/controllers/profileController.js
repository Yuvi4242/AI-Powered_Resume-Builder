const Profile = require('../models/Profile');
const path = require('path');
const fs = require('fs');

// Helper to calculate profile completion
const calculateProfileCompletion = (profile) => {
  let score = 0;

  // 1) PERSONAL INFORMATION (+20%)
  if (profile.fullName && profile.email && profile.phone && profile.city) score += 20;

  // 2) PROFESSIONAL INFORMATION (+15%)
  if (profile.currentRole && profile.careerObjective) score += 15;

  // 3) EDUCATION DETAILS (+15%)
  if (profile.highestQualification && profile.collegeName && profile.degree) score += 15;

  // 4) SKILLS SECTION (+10%)
  if (profile.technicalSkills && profile.technicalSkills.length > 0) score += 10;

  // 5) EXPERIENCE SECTION (+10%)
  if (profile.experiences && profile.experiences.length > 0) score += 10;

  // 6) PROJECTS SECTION (+10%)
  if (profile.projects && profile.projects.length > 0) score += 10;

  // 7) SOCIAL LINKS (+10%)
  if (profile.linkedin || profile.github || profile.portfolio) score += 10;

  // 8) RESUME PREFERENCES (+5%)
  if (profile.resumeTemplate || profile.themeColor || profile.fontStyle) score += 5;

  // 9) PROFILE PHOTO (+5%)
  if (profile.profileImage) score += 5;

  return score;
};

// @desc    Get current user's profile
// @route   GET /api/profile/me
// @access  Private
const getMyProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ userId: req.user._id });

    if (!profile) {
      // Create a default profile if none exists
      profile = await Profile.create({
        userId: req.user._id,
        fullName: req.user.name,
        email: req.user.email,
        phone: req.user.phone || ''
      });
    }

    res.json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/profile/update
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const profileFields = { ...req.body };
    
    // Calculate new completion percentage
    profileFields.profileCompletion = calculateProfileCompletion(profileFields);

    let profile = await Profile.findOneAndUpdate(
      { userId: req.user._id },
      { $set: profileFields },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Upload profile image
// @route   POST /api/profile/upload-image
// @access  Private
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image' });
    }

    const imageUrl = `/uploads/profiles/${req.file.filename}`;
    
    // Update profile with new image URL
    let profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) {
        profile = new Profile({ userId: req.user._id });
    }
    
    profile.profileImage = imageUrl;
    profile.profileCompletion = calculateProfileCompletion(profile);
    await profile.save();

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      profileImage: imageUrl,
      profileCompletion: profile.profileCompletion
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getMyProfile,
  updateProfile,
  uploadProfileImage
};
