const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  logout,
  getMe,
  getProfile,
  updateProfile,
} = require('../controllers/authController');
const { protectCareerUser } = require('../middlewares/authMiddleware');
const resumeUpload = require('../middleware/resumeUpload');

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protectCareerUser, getMe);
router.get('/profile', protectCareerUser, getProfile);
router.put('/profile', protectCareerUser, resumeUpload.single('resume'), updateProfile);

module.exports = router;
