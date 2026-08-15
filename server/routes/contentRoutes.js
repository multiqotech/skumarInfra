const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const { isCloudinaryConfigured } = require('../config/cloudinary');
const {
  getHeroImages,
  addHeroImage,
  deleteHeroImage,
  reorderHeroImages
} = require('../controllers/heroImageController');
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
  getBoardDirectors,
  createBoardDirector,
  updateBoardDirector,
  deleteBoardDirector,
  getInvestors,
  createInvestor,
  updateInvestor,
  deleteInvestor,
  getPlantMachinery,
  createPlantMachinery,
  updatePlantMachinery,
  deletePlantMachinery,
  reorderFAQs,
  reorderTeamMembers,
  reorderBoardDirectors,
  reorderInvestors,
  reorderPlantMachinery
} = require('../controllers/contentController');
const {
  getProjectsByCategory,
  getAllProjects,
  getProjectsByType,
  getFeaturedProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects
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
router.route('/faqs/reorder')
  .put(protect, reorderFAQs);
router.route('/faqs')
  .get(getFAQs)
  .post(protect, createFAQ);
router.route('/faqs/:id')
  .put(protect, updateFAQ)
  .delete(protect, deleteFAQ);

// Team Members Routes
router.route('/team/reorder')
  .put(protect, reorderTeamMembers);
router.route('/team')
  .get(getTeamMembers)
  .post(protect, createTeamMember);
router.route('/team/:id')
  .put(protect, updateTeamMember)
  .delete(protect, deleteTeamMember);

// Board Directors Routes
router.route('/board-directors/reorder')
  .put(protect, reorderBoardDirectors);
router.route('/board-directors')
  .get(getBoardDirectors)
  .post(protect, createBoardDirector);
router.route('/board-directors/:id')
  .put(protect, updateBoardDirector)
  .delete(protect, deleteBoardDirector);

// Investors Routes
router.route('/investors/reorder')
  .put(protect, reorderInvestors);
router.route('/investors')
  .get(getInvestors)
  .post(protect, createInvestor);
router.route('/investors/:id')
  .put(protect, updateInvestor)
  .delete(protect, deleteInvestor);

// Plant and Machinery Routes
router.route('/plant-machinery/reorder')
  .put(protect, reorderPlantMachinery);
router.route('/plant-machinery')
  .get(getPlantMachinery)
  .post(protect, createPlantMachinery);
router.route('/plant-machinery/:id')
  .put(protect, updatePlantMachinery)
  .delete(protect, deletePlantMachinery);

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

// Hero Images Routes
router.route('/hero-images/reorder')
  .put(protect, reorderHeroImages);
router.route('/hero-images')
  .get(getHeroImages)
  .post(protect, addHeroImage);
router.route('/hero-images/:id')
  .delete(protect, deleteHeroImage);

// Projects Routes
router.route('/projects/reorder')
  .put(protect, reorderProjects);
router.route('/projects')
  .get(getAllProjects)
  .post(protect, createProject);
router.route('/projects/featured')
  .get(getFeaturedProjects);
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
