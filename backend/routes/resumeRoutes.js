const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { rateLimit } = require('../middleware/rateLimit');
const {
  saveResume,
  getResumes,
  deleteResume,
  updateResume,
  generateAISummary,
  suggestAISkills,
  antigravityOptimize,
} = require('../controllers/resumeController');

// Helper middleware for auth
router.use(protect);

// AI Features
router.post('/ai-summary', rateLimit({ windowMs: 60_000, max: 20 }), generateAISummary);
router.post('/ai-skills', rateLimit({ windowMs: 60_000, max: 20 }), suggestAISkills);
router.post('/ai-antigravity', rateLimit({ windowMs: 60_000, max: 15 }), antigravityOptimize);

// CRUD operations
router.post('/save', saveResume);
router.get('/all', getResumes);
router.delete('/:id', deleteResume);
router.put('/:id', updateResume);

module.exports = router;
