const mongoose = require('mongoose');

const contactInfoSchema = new mongoose.Schema({
  companyAddress: { type: String, default: '' },
  tollFreeNumber: { type: String, default: '' },
  availability: { type: String, default: '' },
  internationalNumber: { type: String, default: '' },
  internationalAvailability: { type: String, default: '' },
  email: { type: String, default: '' },
  tagline: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  twitter: { type: String, default: '' },
  facebook: { type: String, default: '' },
  instagram: { type: String, default: '' },
  qrCodeImage: { type: String, default: '' }
}, {
  timestamps: true
});

module.exports = mongoose.model('ContactInfo', contactInfoSchema);
