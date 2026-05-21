const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['press-releases', 'electronic-media', 'featured-stories']
  },
  headline: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    required: true
  },
  // Fields for Press Releases
  body: {
    type: String, // Can store basic text with newlines
  },
  image: {
    type: String, // Cloudinary URL
  },
  // Fields for Electronic Media
  description: {
    type: String
  },
  videoLink: {
    type: String
  },
  // Fields for Featured Stories
  pdf: {
    type: String, // Cloudinary URL to PDF file
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('News', newsSchema);
