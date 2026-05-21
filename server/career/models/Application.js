const mongoose = require('mongoose');

const APPLICATION_STATUSES = ['Applied', 'Reviewing', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job reference is required'],
    index: true,
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: [true, 'Candidate reference is required'],
    index: true,
  },
  coverLetter: {
    type: String,
    trim: true,
    default: '',
    maxlength: [5000, 'Cover letter cannot exceed 5000 characters'],
  },
  status: {
    type: String,
    enum: APPLICATION_STATUSES,
    default: 'Applied',
    index: true,
  },
  adminNotes: {
    type: String,
    trim: true,
    default: '',
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Prevent duplicate applications for same job by same candidate
applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
module.exports.APPLICATION_STATUSES = APPLICATION_STATUSES;
