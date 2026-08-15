const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  getSubsidiaries,
  addSubsidiary,
  updateSubsidiary,
  deleteSubsidiary,
  reorderSubsidiaries,
} = require('../controllers/subsidiaryController');

router.route('/reorder')
  .put(protect, reorderSubsidiaries);

router.route('/')
  .get(getSubsidiaries)
  .post(protect, addSubsidiary);

router.route('/:id')
  .put(protect, updateSubsidiary)
  .delete(protect, deleteSubsidiary);

module.exports = router;
