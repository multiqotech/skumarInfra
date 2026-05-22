const Application = require('../models/Application');
const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const { uploadToCloudinary } = require('../../config/cloudinary');
const emailService = require('./emailService');

class ApplicationService {
  /**
   * Submit a new application.
   * Creates candidate (or finds existing), uploads resume, creates application.
   */
  async submitApplication(data, resumeFile, userId) {
    // 1. Find the job
    const job = await Job.findOne({ slug: data.jobSlug, status: 'Published' });
    if (!job) {
      throw new Error('Job not found or is no longer accepting applications');
    }

    // 2. Upload resume to Cloudinary
    let resumeUrl = '';
    let resumePublicId = '';
    if (resumeFile) {
      try {
        const result = await uploadToCloudinary(resumeFile.buffer);
        resumeUrl = result.secure_url;
        resumePublicId = result.public_id;
      } catch (err) {
        throw new Error('Failed to upload resume. Please try again.');
      }
    }

    // 3. Find or create candidate
    let candidate = await Candidate.findOne({ email: data.email.toLowerCase() });
    if (candidate) {
      // Update candidate info with latest submission
      candidate.user = userId;
      candidate.fullName = data.fullName;
      candidate.phone = data.phone;
      candidate.location = data.location || candidate.location;
      candidate.linkedin = data.linkedin || candidate.linkedin;
      candidate.portfolio = data.portfolio || candidate.portfolio;
      candidate.experience = data.experience || candidate.experience;
      candidate.expectedSalary = data.expectedSalary || candidate.expectedSalary;
      candidate.noticePeriod = data.noticePeriod || candidate.noticePeriod;
      if (resumeUrl) {
        candidate.resumeUrl = resumeUrl;
        candidate.resumePublicId = resumePublicId;
      }
      await candidate.save();
    } else {
      candidate = await Candidate.create({
        user: userId,
        fullName: data.fullName,
        email: data.email.toLowerCase(),
        phone: data.phone,
        location: data.location || '',
        linkedin: data.linkedin || '',
        portfolio: data.portfolio || '',
        resumeUrl,
        resumePublicId,
        experience: data.experience || 0,
        expectedSalary: data.expectedSalary || '',
        noticePeriod: data.noticePeriod || '',
      });
    }

    // 4. Check for duplicate application
    const existingApplication = await Application.findOne({
      jobId: job._id,
      candidateId: candidate._id,
    });
    if (existingApplication) {
      throw new Error('You have already applied for this position');
    }

    // 5. Create application
    const application = await Application.create({
      jobId: job._id,
      candidateId: candidate._id,
      coverLetter: data.coverLetter || '',
      status: 'Applied',
    });

    // 6. Send emails (non-blocking)
    emailService.sendApplicationConfirmation(candidate, job).catch((err) => {
      console.error('Failed to send confirmation email:', err.message);
    });
    emailService.sendAdminNotification(candidate, job).catch((err) => {
      console.error('Failed to send admin notification:', err.message);
    });

    return { application, candidate, job };
  }

  /**
   * Get all applications with filters for admin.
   */
  async getApplications(query = {}) {
    const { status, jobId, page = 1, limit = 50 } = query;
    const filter = {};
    if (status) filter.status = status;
    if (jobId) filter.jobId = jobId;

    const skip = (Number(page) - 1) * Number(limit);

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .sort({ appliedAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('jobId', 'title slug department location')
        .populate('candidateId', 'fullName email phone resumeUrl experience')
        .lean(),
      Application.countDocuments(filter),
    ]);

    return {
      applications,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    };
  }

  /**
   * Update application status and/or admin notes.
   */
  async updateApplication(id, data) {
    const updates = {};
    if (data.status) updates.status = data.status;
    if (data.adminNotes !== undefined) updates.adminNotes = data.adminNotes;

    const application = await Application.findByIdAndUpdate(id, updates, { new: true, runValidators: true })
      .populate('jobId', 'title slug')
      .populate('candidateId', 'fullName email phone resumeUrl');

    return application;
  }

  /**
   * Get all candidates for admin.
   */
  async getCandidates(query = {}) {
    const { page = 1, limit = 50, search } = query;
    const filter = {};
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [candidates, total] = await Promise.all([
      Candidate.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Candidate.countDocuments(filter),
    ]);

    // Attach application count for each candidate
    const candidateIds = candidates.map((c) => c._id);
    const applicationCounts = await Application.aggregate([
      { $match: { candidateId: { $in: candidateIds } } },
      { $group: { _id: '$candidateId', count: { $sum: 1 } } },
    ]);
    const countMap = {};
    applicationCounts.forEach((a) => { countMap[a._id.toString()] = a.count; });

    const enriched = candidates.map((c) => ({
      ...c,
      applicationCount: countMap[c._id.toString()] || 0,
    }));

    return {
      candidates: enriched,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    };
  }
}

module.exports = new ApplicationService();
