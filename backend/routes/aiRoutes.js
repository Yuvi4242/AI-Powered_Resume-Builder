const express = require('express');
const router = express.Router();
const {
  generateSummaryController,
  bulletPointsController,
  skillSuggestionController,
  runTextToolController,
  generateAIByAction,
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const { rateLimit } = require('../middleware/rateLimit');

// Default rate limits
const standardLimit = rateLimit({ windowMs: 60_000, max: 25 });
const heavyLimit = rateLimit({ windowMs: 60_000, max: 15 });

/**
 * Unified AI Generation Route
 * @route POST /api/ai/generate
 * @body { action: 'summary'|'experience'|'project'|'skills'|'text-tool'|'optimize', ...options }
 */
router.post('/generate', protect, standardLimit, generateAIByAction);

/**
 * Specialized Specialized Routes for direct usage
 */

// Summary Tools
router.post('/summary', protect, standardLimit, generateSummaryController);
router.post('/summary/generate', protect, standardLimit, generateSummaryController);
router.post('/summary/improve', protect, standardLimit, generateSummaryController);

// Experience Tools
router.post('/bullet-points', protect, standardLimit, bulletPointsController);
router.post('/experience/generate', protect, standardLimit, bulletPointsController);
router.post('/experience/improve', protect, standardLimit, bulletPointsController);

// Skills Tools
router.post('/skills', protect, standardLimit, skillSuggestionController);
router.post('/skills/suggest', protect, standardLimit, skillSuggestionController);

// Text Tools
router.post('/text-tool', protect, standardLimit, runTextToolController);
router.post('/text/rewrite', protect, standardLimit, runTextToolController);
router.post('/text/grammar-fix', protect, standardLimit, runTextToolController);

// Job Optimization
router.post('/optimize', protect, heavyLimit, (req, res) => {
  req.body.action = 'optimize';
  generateAIByAction(req, res);
});

// Legacy / Compatibility
router.post('/ats', protect, heavyLimit, (req, res) => {
  req.body.action = 'ats'; // handled via optimize or a specialized prompt if we add one
  generateAIByAction(req, res);
});

module.exports = router;
