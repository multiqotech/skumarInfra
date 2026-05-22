const express = require('express');
const router = express.Router();
const resumeUpload = require('../middleware/resumeUpload');
const {
  getPublishedJobs,
  getJobBySlug,
  getFilterOptions,
} = require('../controllers/jobController');
const {
  submitApplication,
} = require('../controllers/applicationController');
const { protectCareerUser } = require('../middlewares/authMiddleware');

// Public job routes
router.get('/jobs', getPublishedJobs);
router.get('/filters', getFilterOptions);
router.get('/jobs/:slug', getJobBySlug);

// Application submission (protected)
router.post('/apply', protectCareerUser, resumeUpload.single('resume'), submitApplication);

module.exports = router;
