const mongoose = require('mongoose');

const mediaContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MediaContact', mediaContactSchema);
