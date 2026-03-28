/**
 * aiController.js
 * AI Controller - UNIFIED HANDLER for Groq-based generation.
 * Process all AI-related actions: summary, experience, skills, projects, etc.
 */

const aiService = require('../services/aiService');
const { fail } = require('../utils/apiResponse');

/**
 * Universal controller method that handles all AI generation by action.
 * @route POST /api/ai/generate
 */
const generateAIByAction = async (req, res) => {
  const { action, ...options } = req.body;
  
  try {
    const result = await aiService.generate(action, options);
    
    if (!result.success) {
      return res.status(result.error ? 400 : 500).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('[AIController Error]:', error.message);
    return fail(res, 500, 'Unexpected error during AI generation.');
  }
};

/**
 * Controller to generate / improve resume summary
 * @route POST /api/ai/summary
 */
const generateSummaryController = async (req, res) => {
  const data = req.body?.data || req.body || {};
  const result = await aiService.generate('summary', data);
  return res.status(result.success ? 200 : 500).json(result);
};

/**
 * Controller to generate bullet points
 * @route POST /api/ai/bullet-points
 */
const bulletPointsController = async (req, res) => {
  const data = req.body?.data || req.body || {};
  const result = await aiService.generate('experience', data);
  return res.status(result.success ? 200 : 500).json(result);
};

/**
 * Controller to suggest skills
 * @route POST /api/ai/skills
 */
const skillSuggestionController = async (req, res) => {
  const data = req.body?.data || req.body || {};
  const result = await aiService.generate('skills', data);
  return res.status(result.success ? 200 : 500).json(result);
};

/**
 * Controller for general text tools (grammar, rewrite, etc.)
 * @route POST /api/ai/text-tool
 */
const runTextToolController = async (req, res) => {
  const result = await aiService.generate('text-tool', req.body);
  return res.status(result.success ? 200 : 500).json(result);
};

module.exports = {
  generateAIByAction,
  generateSummaryController,
  bulletPointsController,
  skillSuggestionController,
  runTextToolController,
};
