const jobService = require('../services/jobService');
const { validateJob } = require('../validators/jobValidator');

/**
 * @desc    Get published jobs (public)
 * @route   GET /api/career/jobs
 */
const getPublishedJobs = async (req, res) => {
  try {
    const result = await jobService.getPublishedJobs(req.query);
    res.json(result);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Failed to fetch jobs', error: error.message });
  }
};

/**
 * @desc    Get single job by slug (public)
 * @route   GET /api/career/jobs/:slug
 */
const getJobBySlug = async (req, res) => {
  try {
    const job = await jobService.getJobBySlug(req.params.slug);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ message: 'Failed to fetch job', error: error.message });
  }
};

/**
 * @desc    Get filter options (departments, locations)
 * @route   GET /api/career/filters
 */
const getFilterOptions = async (req, res) => {
  try {
    const options = await jobService.getFilterOptions();
    res.json(options);
  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({ message: 'Failed to fetch filters', error: error.message });
  }
};

/**
 * @desc    Get all jobs (admin)
 * @route   GET /api/career/admin/jobs
 */
const getAllJobs = async (req, res) => {
  try {
    const result = await jobService.getAllJobs(req.query);
    res.json(result);
  } catch (error) {
    console.error('Error fetching all jobs:', error);
    res.status(500).json({ message: 'Failed to fetch jobs', error: error.message });
  }
};

/**
 * @desc    Create a new job (admin)
 * @route   POST /api/career/admin/jobs
 */
const createJob = async (req, res) => {
  try {
    const { isValid, errors } = validateJob(req.body);
    if (!isValid) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const job = await jobService.createJob(req.body, req.admin._id);
    res.status(201).json(job);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: 'Failed to create job', error: error.message });
  }
};

/**
 * @desc    Update a job (admin)
 * @route   PUT /api/career/admin/jobs/:id
 */
const updateJob = async (req, res) => {
  try {
    const job = await jobService.updateJob(req.params.id, req.body);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ message: 'Failed to update job', error: error.message });
  }
};

/**
 * @desc    Delete a job (admin)
 * @route   DELETE /api/career/admin/jobs/:id
 */
const deleteJob = async (req, res) => {
  try {
    const job = await jobService.deleteJob(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: 'Failed to delete job', error: error.message });
  }
};

module.exports = {
  getPublishedJobs,
  getJobBySlug,
  getFilterOptions,
  getAllJobs,
  createJob,
  updateJob,
  deleteJob,
};
