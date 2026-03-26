const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json({
        success: true,
        user
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email; // Allow email update as per request
      user.phone = req.body.phone || user.phone;
      user.photo = req.body.photo || user.photo;
      user.headline = req.body.headline || user.headline;
      user.bio = req.body.bio || user.bio;
      user.location = req.body.location || user.location;
      user.website = req.body.website || user.website;
      user.linkedin = req.body.linkedin || user.linkedin;
      user.github = req.body.github || user.github;
      user.skills = req.body.skills || user.skills;

      const updatedUser = await user.save();

      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          photo: updatedUser.photo,
          headline: updatedUser.headline,
          bio: updatedUser.bio,
          location: updatedUser.location,
          website: updatedUser.website,
          linkedin: updatedUser.linkedin,
          github: updatedUser.github,
          skills: updatedUser.skills,
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
