const Resume = require('../models/Resume');
const {
  generateResumeSummary,
  suggestSkillsForRole,
  antigravityOptimize,
} = require('../services/geminiService');

// ============================================================
// AI ENDPOINTS
// ============================================================

/**
 * POST /api/resume/ai-summary
 * Generate a professional 3-line resume summary.
 */
const generateAISummary = async (req, res) => {
  try {
    const { profileData } = req.body;
    if (!profileData) {
      return res.status(400).json({ success: false, message: 'profileData is required.' });
    }

    const summary = await generateResumeSummary({
      role:              profileData.currentRole || profileData.jobTitle || 'Professional',
      skills:            profileData.technicalSkills || [],
      yearsOfExperience: profileData.experienceLevel || '',
    });

    res.status(200).json({ success: true, summary });
  } catch (error) {
    console.error('[AI Summary Error]', error.message);
    const status = error.message?.includes('429') ? 429 : 500;
    res.status(status).json({
      success: false,
      message: status === 429
        ? 'Rate limit hit. Please wait a moment before trying again.'
        : 'AI service unavailable. Please try again shortly.',
    });
  }
};

/**
 * POST /api/resume/ai-skills
 * Suggest 5 relevant technical skills for a job role.
 */
const suggestAISkills = async (req, res) => {
  try {
    const { role } = req.body;
    if (!role) {
      return res.status(400).json({ success: false, message: 'role is required.' });
    }

    const skills = await suggestSkillsForRole(role);
    res.status(200).json({ success: true, skills });
  } catch (error) {
    console.error('[AI Skills Error]', error.message);
    const status = error.message?.includes('429') ? 429 : 500;
    res.status(status).json({ success: false, message: 'Could not generate skills.' });
  }
};

/**
 * POST /api/resume/ai-antigravity
 * Re-order bullet points to match a job description.
 */
const antigravityOptimizeHandler = async (req, res) => {
  try {
    const { bulletPoints, jobDescription } = req.body;
    if (!bulletPoints || !jobDescription) {
      return res.status(400).json({ success: false, message: 'bulletPoints and jobDescription are required.' });
    }

    const optimizedPoints = await antigravityOptimize(bulletPoints, jobDescription);
    res.status(200).json({ success: true, optimizedPoints });
  } catch (error) {
    console.error('[Antigravity Error]', error.message);
    const status = error.message?.includes('429') ? 429 : 500;
    res.status(status).json({ success: false, message: 'Antigravity optimization unavailable.' });
  }
};

// ============================================================
// CRUD OPERATIONS
// ============================================================

const saveResume = async (req, res) => {
  try {
    const { name, email, skills, education, experience, summary, template } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }
    const resume = await Resume.create({
      userId: req.user._id,
      name, email,
      skills:     skills     || '',
      education:  education  || '',
      experience: experience || '',
      summary:    summary    || '',
      template:   template   || 'template1',
    });
    res.status(201).json({ success: true, message: 'Resume saved successfully', resume });
  } catch (error) {
    console.error('[Save Resume Error]', error.message);
    res.status(500).json({ success: false, message: 'Server error while saving resume' });
  }
};

const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, resumes });
  } catch (error) {
    console.error('[Get Resumes Error]', error.message);
    res.status(500).json({ success: false, message: 'Server error while fetching resumes' });
  }
};

const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    res.status(200).json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('[Delete Resume Error]', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateResume = async (req, res) => {
  try {
    const updatedResume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!updatedResume) return res.status(404).json({ success: false, message: 'Resume not found' });
    res.status(200).json({ success: true, resume: updatedResume });
  } catch (error) {
    console.error('[Update Resume Error]', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  generateAISummary,
  suggestAISkills,
  antigravityOptimize: antigravityOptimizeHandler,
  saveResume,
  getResumes,
  deleteResume,
  updateResume,
};
