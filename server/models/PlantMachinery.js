const mongoose = require('mongoose');

const plantMachinerySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Plant', 'Machinery'],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  }
}, { timestamps: true });

module.exports = mongoose.model('PlantMachinery', plantMachinerySchema);
