const express = require('express');
const router = express.Router();
const {
  generateResumeContentController,
  generateSummaryController,
  bulletPointsController,
  atsScoreController,
  skillSuggestionController,
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// Unified AI generation route
router.post('/generate', protect, generateResumeContentController);

// Public test route (for testing without auth)
router.post('/test-summary', generateSummaryController);

// @route   POST /api/ai/summary
router.post('/summary', protect, generateSummaryController);

// @route   POST /api/ai/ats
router.post('/ats', protect, atsScoreController);

// @route   POST /api/ai/skills
router.post('/skills', protect, skillSuggestionController);

// @route   POST /api/ai/bullet-points
router.post('/bullet-points', protect, bulletPointsController);

module.exports = router;
