const applicationService = require('../services/applicationService');
const { validateApplication, validateExperienceForJob } = require('../validators/applicationValidator');

/**
 * @desc    Submit a job application (public)
 * @route   POST /api/career/apply
 */
const submitApplication = async (req, res) => {
  try {
    const { isValid, errors } = validateApplication(req.body);
    if (!isValid) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    // Validate experience against job requirements
    const expValidation = await validateExperienceForJob(req.body);
    if (!expValidation.isValid) {
      return res.status(400).json({ message: expValidation.errors[0], errors: expValidation.errors });
    }

    let hasExistingResume = false;
    if (req.user) {
      const Candidate = require('../models/Candidate');
      const candidate = await Candidate.findOne({ user: req.user._id });
      if (candidate && candidate.resumeUrl) {
        hasExistingResume = true;
      }
    }

    if (!req.file && !hasExistingResume) {
      return res.status(400).json({ message: 'Resume file is required' });
    }

    const result = await applicationService.submitApplication(req.body, req.file, req.user._id);
    res.status(201).json({
      message: 'Application submitted successfully',
      applicationId: result.application._id,
    });
  } catch (error) {
    console.error('Error submitting application:', error);

    if (error.message.includes('already applied')) {
      return res.status(409).json({ message: error.message });
    }
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: 'Failed to submit application', error: error.message });
  }
};

/**
 * @desc    Get all applications (admin)
 * @route   GET /api/career/admin/applications
 */
const getApplications = async (req, res) => {
  try {
    const result = await applicationService.getApplications(req.query);
    res.json(result);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Failed to fetch applications', error: error.message });
  }
};

/**
 * @desc    Update application status/notes (admin)
 * @route   PUT /api/career/admin/applications/:id
 */
const updateApplication = async (req, res) => {
  try {
    const application = await applicationService.updateApplication(req.params.id, req.body);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json(application);
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ message: 'Failed to update application', error: error.message });
  }
};

/**
 * @desc    Get all candidates (admin)
 * @route   GET /api/career/admin/candidates
 */
const getCandidates = async (req, res) => {
  try {
    const result = await applicationService.getCandidates(req.query);
    res.json(result);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ message: 'Failed to fetch candidates', error: error.message });
  }
};

module.exports = {
  submitApplication,
  getApplications,
  updateApplication,
  getCandidates,
};
