const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  heroImage: {
    type: String,
  },
  tagline: {
    type: String,
  },
  description: {
    type: String,
  },
  descriptionImage: {
    type: String,
  },
  order: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate projects that belong to this category
categorySchema.virtual('projects', {
  ref: 'Project',
  localField: 'slug',
  foreignField: 'category'
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
