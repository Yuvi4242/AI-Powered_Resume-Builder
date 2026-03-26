const { 
  generateSummary, 
  generateBulletPoints, 
  generateATSScore, 
  suggestSkills, 
  optimizeResumeContent 
} = require('../services/aiService');

/**
 * Controller to handle the complete AI resume generation and optimization
 * @route POST /api/ai/generate
 * @access Private (requires authentication)
 */
const generateResumeContentController = async (req, res) => {
  console.log("AI route hit: /ai/generate", req.body);
  try {
    const { action, data, jobDescription } = req.body;

    let result = null;

    switch (action) {
      case 'summary':
        result = await generateSummary(data);
        break;
      case 'skills':
        result = await suggestSkills(data.role);
        break;
      case 'optimize':
        if (!jobDescription) {
            return res.status(400).json({ success: false, message: 'Please provide a Job Description (JD)' });
        }
        result = await optimizeResumeContent(data, jobDescription);
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid AI action provided' });
    }

    res.status(200).json({
      success: true,
      result: result,
    });
  } catch (error) {
    console.error('AI Strategy Controller Error:', error.message);
    const statusCode = error.message === 'RATE_LIMIT_EXCEEDED' ? 429 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'AI request failed. Please try again later.',
    });
  }
};

/**
 * Controller to generate resume summary using AI
 * @route POST /api/ai/generate-summary
 * @access Private (requires authentication)
 */
const generateSummaryController = async (req, res) => {
  console.log("AI route hit: /summary", req.body);
  try {
    const { data } = req.body;
    const summary = await generateSummary(data);

    res.status(200).json({
      success: true,
      result: summary,
    });
  } catch (error) {
    console.error('Generate Summary Controller Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to generate summary',
    });
  }
};

/**
 * Controller to generate bullet points for a job title
 * @route POST /api/ai/bullet-points
 * @access Private (requires authentication)
 */
const bulletPointsController = async (req, res) => {
  console.log("AI route hit: /bullet-points", req.body);
  try {
    const { data } = req.body;
    const { jobTitle } = data || {};

    if (!jobTitle) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a job title',
      });
    }

    const points = await generateBulletPoints(jobTitle);

    res.status(200).json({
      success: true,
      result: points,
    });
  } catch (error) {
    console.error('Bullet Points Controller Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate bullet points',
    });
  }
};

/**
 * Controller to check ATS score
 * @route POST /api/ai/ats-score
 * @access Private (requires authentication)
 */
const atsScoreController = async (req, res) => {
  console.log("AI route hit: /ats", req.body);
  try {
    const { data } = req.body;
    const { resumeText } = data || {};

    if (!resumeText) {
      return res.status(400).json({
        success: false,
        message: 'Please provide resume text',
      });
    }

    const result = await generateATSScore(resumeText);

    res.status(200).json({
      success: true,
      result: result.score,
      suggestions: result.suggestions,
    });
  } catch (error) {
    console.error('ATS Score Controller Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze resume',
    });
  }
};

/**
 * Controller to suggest skills for a role
 * @route POST /api/ai/suggest-skills
 * @access Private (requires authentication)
 */
const skillSuggestionController = async (req, res) => {
  console.log("AI route hit: /skills", req.body);
  try {
    const { data } = req.body;
    const { role } = data || {};

    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a job role',
      });
    }

    const skills = await suggestSkills(role);

    res.status(200).json({
      success: true,
      result: skills,
    });
  } catch (error) {
    console.error('Skill Suggestion Controller Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to suggest skills',
    });
  }
};

module.exports = {
  generateResumeContentController,
  generateSummaryController,
  bulletPointsController,
  atsScoreController,
  skillSuggestionController,
};
