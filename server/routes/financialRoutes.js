const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getFinancialHighlights, updateFinancialHighlights } = require('../controllers/financialController');

router.route('/financial-highlights')
  .get(getFinancialHighlights)
  .put(protect, updateFinancialHighlights);

module.exports = router;
