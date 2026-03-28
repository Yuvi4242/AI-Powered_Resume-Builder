const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { rateLimit } = require('../middleware/rateLimit');
const {
  chatWithCopilot,
  fillProfileFromText,
  copilotGenerateSummary,
  improveResume,
} = require('../controllers/copilotController');

// All routes require authentication
router.use(protect, rateLimit({ windowMs: 60_000, max: 30 }));

// POST /api/ai/chat — main copilot conversation endpoint
router.post('/chat', chatWithCopilot);

// POST /api/ai/fill-profile — auto-fill profile from freeform text
router.post('/fill-profile', fillProfileFromText);

// POST /api/ai/generate-summary — generate professional summary
router.post('/generate-summary', copilotGenerateSummary);

// POST /api/ai/improve-resume — analyze and improve resume content
router.post('/improve-resume', improveResume);

module.exports = router;
