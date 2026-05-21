const Job = require('../models/Job');
const Application = require('../models/Application');
const Candidate = require('../models/Candidate');

/**
 * @desc    Get career analytics (admin)
 * @route   GET /api/career/admin/analytics
 */
const getAnalytics = async (req, res) => {
  try {
    const [
      totalJobs,
      publishedJobs,
      totalApplications,
      totalCandidates,
      statusBreakdown,
      departmentBreakdown,
      monthlyApplications,
    ] = await Promise.all([
      Job.countDocuments(),
      Job.countDocuments({ status: 'Published' }),
      Application.countDocuments(),
      Candidate.countDocuments(),

      // Status breakdown for funnel
      Application.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),

      // Applications per department
      Application.aggregate([
        {
          $lookup: {
            from: 'jobs',
            localField: 'jobId',
            foreignField: '_id',
            as: 'job',
          },
        },
        { $unwind: '$job' },
        { $group: { _id: '$job.department', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),

      // Monthly applications (last 6 months)
      Application.aggregate([
        {
          $match: {
            appliedAt: {
              $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$appliedAt' },
              month: { $month: '$appliedAt' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
    ]);

    // Calculate conversion rate (Selected / Total)
    const selectedCount = statusBreakdown.find((s) => s._id === 'Selected')?.count || 0;
    const conversionRate = totalApplications > 0
      ? ((selectedCount / totalApplications) * 100).toFixed(1)
      : 0;

    res.json({
      cards: {
        totalJobs,
        publishedJobs,
        totalApplications,
        totalCandidates,
        conversionRate: Number(conversionRate),
      },
      statusBreakdown,
      departmentBreakdown,
      monthlyApplications,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
  }
};

module.exports = { getAnalytics };
