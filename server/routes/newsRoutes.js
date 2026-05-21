const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  getNews,
  getNewsBySlug,
  createNews,
  updateNews,
  deleteNews,
  getMediaContacts,
  createMediaContact,
  updateMediaContact,
  deleteMediaContact
} = require('../controllers/newsController');

// News Routes
router.route('/news')
  .get(getNews)
  .post(protect, createNews);

router.route('/news/:id')
  .put(protect, updateNews)
  .delete(protect, deleteNews);

router.route('/news/slug/:slug')
  .get(getNewsBySlug);

// Media Contacts Routes
router.route('/media-contacts')
  .get(getMediaContacts)
  .post(protect, createMediaContact);

router.route('/media-contacts/:id')
  .put(protect, updateMediaContact)
  .delete(protect, deleteMediaContact);

module.exports = router;
