require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const FinancialHighlight = require('../models/FinancialHighlight');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skconstruction');
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const seedFinancialHighlights = async () => {
  try {
    await connectDB();

    const overview = {
      title: "Financial Highlights",
      description: "S Kumar Infracons has demonstrated consistent financial growth and stability, positioning the company as a reliable and financially sound partner for infrastructure projects. Our prudent financial management and strategic business development efforts have resulted in steady revenue growth, improved profitability, and a strengthened balance sheet over the years."
    };

    const financialPerformance = [
      { year: "FY 2020-21", revenue: 45, netProfit: 5 },
      { year: "FY 2021-22", revenue: 68, netProfit: 7 },
      { year: "FY 2022-23", revenue: 95, netProfit: 8 },
      { year: "FY 2023-24", revenue: 142, netProfit: 11 }
    ];

    const metrics = [
      {
        title: "Annual Growth Rate",
        value: 45,
        suffix: "%",
        description: "Compound Annual Growth Rate (CAGR) in revenue over the last three financial years, demonstrating strong business expansion."
      },
      {
        title: "Net Profit Margin",
        value: 8.1,
        suffix: "%",
        description: "Average net profit margin for FY 2023-24, showing improved operational efficiency and cost management."
      },
      {
        title: "Order Book Growth",
        value: 75,
        suffix: "%",
        description: "Increase in order book value from FY 2022-23 to FY 2023-24, providing strong revenue visibility for upcoming years."
      }
    ];

    const strengths = [
      {
        title: "Strong Working Capital Management",
        description: "Optimized cash flow cycles and efficient working capital utilization that supports project execution without liquidity constraints."
      },
      {
        title: "Healthy Debt-Equity Ratio",
        description: "Maintained at approximately 0.8:1, indicating a balanced financial structure that enables growth while managing financial risk."
      },
      {
        title: "Robust Banking Relationships",
        description: "Established credit facilities with leading financial institutions, providing access to necessary funding for project execution and business expansion."
      },
      {
        title: "Asset Utilization",
        description: "Improved return on assets through efficient utilization of plant and machinery, enhancing overall profitability."
      },
      {
        title: "Diversified Revenue Streams",
        description: "Revenue generation from multiple project types and geographies, reducing dependency on any single market segment."
      },
      {
        title: "Current Order Book",
        description: "Secured projects worth over ₹600 crores, providing revenue visibility for the next 2-3 years and supporting sustained growth."
      }
    ];

    let highlight = await FinancialHighlight.findOne();
    if (highlight) {
      highlight.overview = overview;
      highlight.financialPerformance = financialPerformance;
      highlight.metrics = metrics;
      highlight.strengths = strengths;
      await highlight.save();
      console.log('Financial Highlights updated successfully!');
    } else {
      await FinancialHighlight.create({
        overview,
        financialPerformance,
        metrics,
        strengths
      });
      console.log('Financial Highlights created successfully!');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding financial highlights:', error);
    process.exit(1);
  }
};

seedFinancialHighlights();
