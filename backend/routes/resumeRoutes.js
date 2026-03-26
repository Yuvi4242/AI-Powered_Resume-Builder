const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
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
router.post('/ai-summary', generateAISummary);
router.post('/ai-skills', suggestAISkills);
router.post('/ai-antigravity', antigravityOptimize);

// CRUD operations
router.post('/save', saveResume);
router.get('/all', getResumes);
router.delete('/:id', deleteResume);
router.put('/:id', updateResume);

module.exports = router;
