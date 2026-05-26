const FinancialHighlight = require('../models/FinancialHighlight');

const getFinancialHighlights = async (req, res) => {
  try {
    let highlight = await FinancialHighlight.findOne();
    if (!highlight) {
      highlight = await FinancialHighlight.create({
        overview: { title: "Financial Highlights", description: "Company financial summary..." },
        financialPerformance: [],
        metrics: [],
        strengths: []
      });
    }
    res.json(highlight);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const updateFinancialHighlights = async (req, res) => {
  try {
    const { overview, financialPerformance, metrics, strengths } = req.body;
    
    let highlight = await FinancialHighlight.findOne();
    if (highlight) {
      if (overview) highlight.overview = overview;
      if (financialPerformance) highlight.financialPerformance = financialPerformance;
      if (metrics) highlight.metrics = metrics;
      if (strengths) highlight.strengths = strengths;
      
      const updatedHighlight = await highlight.save();
      return res.json(updatedHighlight);
    } else {
      highlight = await FinancialHighlight.create({
        overview: overview || { title: "Financial Highlights", description: "Company financial summary..." },
        financialPerformance: financialPerformance || [],
        metrics: metrics || [],
        strengths: strengths || []
      });
      return res.status(201).json(highlight);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getFinancialHighlights,
  updateFinancialHighlights
};
