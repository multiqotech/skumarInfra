const express = require('express');
const router = express.Router();
const { getContactInfo, updateContactInfo } = require('../controllers/contactInfoController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/contact-info', getContactInfo);
router.put('/contact-info', protect, updateContactInfo);

module.exports = router;
