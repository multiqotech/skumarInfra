const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true, // e.g., 'airports', 'bridges'
    index: true,
  },
  projectType: {
    type: [String],
    enum: ['Ongoing', 'Completed', 'Awarded'],
    default: ['Ongoing']
  },
  image: {
    type: String,
    required: true,
  },
  projectCost: {
    type: String,
    default: '',
  },
  timeToBuild: {
    type: String,
    default: '',
  },
  client: {
    type: String,
    default: '',
  },
  epcContractor: {
    type: String,
    default: '',
  },
  epcSubContractor: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: '',
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
