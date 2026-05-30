const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Subsidiary = require('../models/Subsidiary');
const connectDB = require('../config/db');

dotenv.config();

const dummySubsidiaries = [
  {
    name: 'S Kumar Green Energy India Private Limited',
    description: 'Committed to sustainable future through green energy solutions, advancing the adoption of renewable resources to power a cleaner tomorrow.',
    image: 'https://images.unsplash.com/photo-1509391366360-1f95096dcb0e?w=800&h=600&fit=crop',
    link: 'https://www.skumargreenenergy.com'
  },
  {
    name: 'S Kumar Estates India Private Limited',
    description: 'Premier real estate developers building world-class commercial and residential spaces with uncompromised quality and innovation.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
    link: 'https://www.skumarestates.com'
  },
  {
    name: 'Infraboat Projects India Private Limited',
    description: 'Pioneering infrastructure projects specializing in marine and waterway constructions, driving connectivity and economic growth.',
    image: 'https://images.unsplash.com/photo-1494607239400-ff147da48308?w=800&h=600&fit=crop',
    link: 'https://www.infraboatprojects.com'
  }
];

const seedSubsidiaries = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    await Subsidiary.deleteMany();
    console.log('Cleared existing subsidiaries');

    await Subsidiary.insertMany(dummySubsidiaries);
    console.log('Seed data inserted successfully!');

    process.exit();
  } catch (err) {
    console.error('Error with data import', err);
    process.exit(1);
  }
};

seedSubsidiaries();
