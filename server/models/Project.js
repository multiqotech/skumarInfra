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
  description: {
    type: String,
    default: '',
  },
  timeToBuild: {
    type: String,
    default: '',
  },
  engineers: {
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
