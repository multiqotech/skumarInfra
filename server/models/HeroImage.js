const mongoose = require('mongoose');

const heroImageSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('HeroImage', heroImageSchema);
