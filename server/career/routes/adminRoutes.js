const express = require('express');
const router = express.Router();
const { protect } = require('../../middlewares/authMiddleware');
const {
  getAllJobs,
  createJob,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');
const {
  getApplications,
  updateApplication,
  getCandidates,
} = require('../controllers/applicationController');
const { getAnalytics } = require('../controllers/analyticsController');

// All admin career routes require authentication
router.use(protect);

// Job management
router.route('/jobs')
  .get(getAllJobs)
  .post(createJob);

router.route('/jobs/:id')
  .put(updateJob)
  .delete(deleteJob);

// Application management
router.get('/applications', getApplications);
router.put('/applications/:id', updateApplication);

// Candidate management
router.get('/candidates', getCandidates);

// Analytics
router.get('/analytics', getAnalytics);

module.exports = router;
