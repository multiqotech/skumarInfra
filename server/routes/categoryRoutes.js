const express = require('express');
const router = express.Router();
const { 
  getAllCategories, 
  getCategoryBySlug, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  reorderCategories
} = require('../controllers/categoryController');
const { protect } = require('../middlewares/authMiddleware');

// Public routes
router.get('/', getAllCategories);
router.get('/slug/:slug', getCategoryBySlug);

// Admin only routes
router.put('/reorder', protect, reorderCategories);
router.post('/', protect, createCategory);
router.put('/:id', protect, updateCategory);
router.delete('/:id', protect, deleteCategory);

module.exports = router;
