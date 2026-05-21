const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true,
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
  },
  salary: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
    isNegotiable: { type: Boolean, default: false },
  },
  experience: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
  },
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'],
    default: 'Full-time',
  },
  jobType: {
    type: String,
    enum: ['On-site', 'Remote', 'Hybrid'],
    default: 'On-site',
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
  },
  responsibilities: {
    type: [String],
    default: [],
  },
  requirements: {
    type: [String],
    default: [],
  },
  benefits: {
    type: [String],
    default: [],
  },
  skills: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Archived'],
    default: 'Draft',
    index: true,
  },
  openings: {
    type: Number,
    default: 1,
    min: [0, 'Openings cannot be negative'],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
}, {
  timestamps: true,
});

// Text index for search
jobSchema.index({ title: 'text', department: 'text', location: 'text', description: 'text' });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
