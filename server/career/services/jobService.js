const Job = require('../models/Job');
const { generateSlug } = require('../utils/slugify');

class JobService {
  /**
   * Get published jobs with search, filters, and pagination.
   */
  async getPublishedJobs(query = {}) {
    const {
      search,
      department,
      location,
      experience,
      salaryMin,
      salaryMax,
      jobType,
      employmentType,
      page = 1,
      limit = 12,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const filter = { status: 'Published' };

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Filters
    if (department) filter.department = { $regex: department, $options: 'i' };
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (jobType) filter.jobType = jobType;
    if (employmentType) filter.employmentType = employmentType;

    if (experience) {
      const exp = Number(experience);
      if (!isNaN(exp)) {
        filter['experience.min'] = { $lte: exp };
        filter['experience.max'] = { $gte: exp };
      }
    }

    if (salaryMin) filter['salary.min'] = { $gte: Number(salaryMin) };
    if (salaryMax) filter['salary.max'] = { $lte: Number(salaryMax) };

    const skip = (Number(page) - 1) * Number(limit);
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Job.countDocuments(filter),
    ]);

    return {
      jobs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    };
  }

  /**
   * Get a single published job by slug.
   */
  async getJobBySlug(slug) {
    return Job.findOne({ slug, status: 'Published' }).lean();
  }

  /**
   * Get all jobs (any status) for admin.
   */
  async getAllJobs(query = {}) {
    const { status, page = 1, limit = 20 } = query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('createdBy', 'name email')
        .lean(),
      Job.countDocuments(filter),
    ]);

    return {
      jobs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    };
  }

  /**
   * Create a new job.
   */
  async createJob(data, adminId) {
    const slug = generateSlug(data.title);
    const job = await Job.create({
      ...data,
      slug,
      createdBy: adminId,
    });
    return job;
  }

  /**
   * Update an existing job.
   */
  async updateJob(id, data) {
    // If title changed, regenerate slug
    if (data.title) {
      data.slug = generateSlug(data.title);
    }
    const job = await Job.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    return job;
  }

  /**
   * Delete a job.
   */
  async deleteJob(id) {
    return Job.findByIdAndDelete(id);
  }

  /**
   * Get unique departments and locations for filter options.
   */
  async getFilterOptions() {
    const [departments, locations] = await Promise.all([
      Job.distinct('department', { status: 'Published' }),
      Job.distinct('location', { status: 'Published' }),
    ]);
    return { departments, locations };
  }
}

module.exports = new JobService();
