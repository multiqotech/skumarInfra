const mongoose = require('mongoose');

const financialHighlightSchema = new mongoose.Schema({
  overview: {
    title: { type: String, default: "Financial Highlights" },
    description: { type: String, default: "Company financial summary..." }
  },
  financialPerformance: [{
    year: { type: String, required: true },
    revenue: { type: Number, required: true },
    netProfit: { type: Number, required: true }
  }],
  metrics: [{
    title: { type: String, required: true },
    value: { type: Number, required: true },
    suffix: { type: String, default: "" },
    description: { type: String, default: "" }
  }],
  strengths: [{
    title: { type: String, required: true },
    description: { type: String, default: "" }
  }]
}, { timestamps: true });

module.exports = mongoose.model('FinancialHighlight', financialHighlightSchema);
