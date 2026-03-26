const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  chatWithCopilot,
  fillProfileFromText,
  copilotGenerateSummary,
  improveResume,
} = require('../controllers/copilotController');

// All routes require authentication
// POST /api/ai/chat — main copilot conversation endpoint
router.post('/chat', protect, chatWithCopilot);

// POST /api/ai/fill-profile — auto-fill profile from freeform text
router.post('/fill-profile', protect, fillProfileFromText);

// POST /api/ai/generate-summary — generate professional summary
router.post('/generate-summary', protect, copilotGenerateSummary);

// POST /api/ai/improve-resume — analyze and improve resume content
router.post('/improve-resume', protect, improveResume);

module.exports = router;
