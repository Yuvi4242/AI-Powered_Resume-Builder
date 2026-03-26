const Resume = require('../models/Resume');

/**
 * @desc    Save a new resume
 * @route   POST /api/resume/save
 * @access  Private (requires authentication)
 */
const saveResume = async (req, res) => {
  try {
    const { name, email, skills, education, experience, summary, template } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required',
      });
    }

    // Create new resume with userId from JWT
    const resume = await Resume.create({
      userId: req.user._id,
      name,
      email,
      skills: skills || '',
      education: education || '',
      experience: experience || '',
      summary: summary || '',
      template: template || 'template1',
    });

    res.status(201).json({
      success: true,
      message: 'Resume saved successfully',
      resume: {
        id: resume._id,
        name: resume.name,
        email: resume.email,
      },
    });
  } catch (error) {
    console.error('Save Resume Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while saving resume',
    });
  }
};

/**
 * @desc    Get all resumes for the logged-in user
 * @route   GET /api/resume/all
 * @access  Private (requires authentication)
 */
const getResumes = async (req, res) => {
  try {
    // Fetch all resumes for the logged-in user, sorted by newest first
    const resumes = await Resume.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    console.error('Get Resumes Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching resumes',
    });
  }
};

/**
 * @desc    Delete a resume
 * @route   DELETE /api/resume/:id
 * @access  Private (requires authentication)
 */
const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;

    // Find resume and ensure it belongs to the logged-in user
    const resume = await Resume.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found or you do not have permission to delete it',
      });
    }

    // Delete the resume
    await Resume.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully',
    });
  } catch (error) {
    console.error('Delete Resume Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting resume',
    });
  }
};

/**
 * @desc    Update a resume
 * @route   PUT /api/resume/:id
 * @access  Private (requires authentication)
 */
const updateResume = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, skills, education, experience, summary, template } = req.body;

    // Find resume and ensure it belongs to the logged-in user
    const resume = await Resume.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found or you do not have permission to update it',
      });
    }

    // Update resume fields
    const updatedResume = await Resume.findByIdAndUpdate(
      id,
      {
        name: name || resume.name,
        email: email || resume.email,
        skills: skills !== undefined ? skills : resume.skills,
        education: education !== undefined ? education : resume.education,
        experience: experience !== undefined ? experience : resume.experience,
        summary: summary !== undefined ? summary : resume.summary,
        template: template || resume.template,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Resume updated successfully',
      resume: updatedResume,
    });
  } catch (error) {
    console.error('Update Resume Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating resume',
    });
  }
};

module.exports = {
  saveResume,
  getResumes,
  deleteResume,
  updateResume,
};
