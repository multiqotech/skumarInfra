const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    index: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  location: {
    type: String,
    trim: true,
    default: '',
  },
  linkedin: {
    type: String,
    trim: true,
    default: '',
  },
  portfolio: {
    type: String,
    trim: true,
    default: '',
  },
  resumeUrl: {
    type: String,
    required: [true, 'Resume is required'],
  },
  resumePublicId: {
    type: String,
    default: '',
  },
  experience: {
    type: Number,
    default: 0,
    min: [0, 'Experience cannot be negative'],
  },
  expectedSalary: {
    type: String,
    trim: true,
    default: '',
  },
  noticePeriod: {
    type: String,
    trim: true,
    default: '',
  },
}, {
  timestamps: true,
});

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;
