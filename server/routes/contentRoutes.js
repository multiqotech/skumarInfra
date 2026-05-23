const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const { isCloudinaryConfigured } = require('../config/cloudinary');
const {
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getSettingByKey,
  updateSetting,
  uploadImage,
} = require('../controllers/contentController');
const {
  getProjectsByCategory,
  getAllProjects,
  getProjectsByType,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const {
  getWeArePages,
  getWeArePageBySlug,
  updateWeArePage
} = require('../controllers/weAreController');

// Cloudinary Status Check (for admin dashboard)
router.get('/cloudinary-status', (req, res) => {
  res.json({ configured: isCloudinaryConfigured });
});

// Upload Route (Protected)
router.route('/upload')
  .post(protect, upload.single('file'), uploadImage);

// FAQs Routes
router.route('/faqs')
  .get(getFAQs)
  .post(protect, createFAQ);
router.route('/faqs/:id')
  .put(protect, updateFAQ)
  .delete(protect, deleteFAQ);

// Team Members Routes
router.route('/team')
  .get(getTeamMembers)
  .post(protect, createTeamMember);
router.route('/team/:id')
  .put(protect, updateTeamMember)
  .delete(protect, deleteTeamMember);

// Testimonials Routes
router.route('/testimonials')
  .get(getTestimonials)
  .post(protect, createTestimonial);
router.route('/testimonials/:id')
  .put(protect, updateTestimonial)
  .delete(protect, deleteTestimonial);

// Settings Routes
router.route('/settings/:key')
  .get(getSettingByKey)
  .post(protect, updateSetting);

// Projects Routes
router.route('/projects')
  .get(getAllProjects)
  .post(protect, createProject);
router.route('/projects/category/:category')
  .get(getProjectsByCategory);
router.route('/projects/type/:type')
  .get(getProjectsByType);
router.route('/projects/:id')
  .get(getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

// We Are Pages Routes
router.route('/we-are')
  .get(getWeArePages);
router.route('/we-are/:slug')
  .get(getWeArePageBySlug)
  .post(protect, updateWeArePage)
  .put(protect, updateWeArePage);

module.exports = router;
