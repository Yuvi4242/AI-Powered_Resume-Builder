const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  saveResume,
  getResumes,
  deleteResume,
  updateResume,
} = require('../controllers/resumeController');

// All routes require authentication
router.use(protect);

/**
 * @route   POST /api/resume/save
 * @desc    Save a new resume
 * @access  Private
 */
router.post('/save', saveResume);

/**
 * @route   GET /api/resume/all
 * @desc    Get all resumes for logged-in user
 * @access  Private
 */
router.get('/all', getResumes);

/**
 * @route   DELETE /api/resume/:id
 * @desc    Delete a resume
 * @access  Private
 */
router.delete('/:id', deleteResume);

/**
 * @route   PUT /api/resume/:id
 * @desc    Update a resume
 * @access  Private
 */
router.put('/:id', updateResume);

module.exports = router;
