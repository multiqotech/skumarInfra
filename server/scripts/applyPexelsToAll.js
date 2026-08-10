require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Project = require('../models/Project');

const categoryImages = {
  'airports': 'https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&w=800',
  'bridges': 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=800',
  'defence-installations': 'https://images.pexels.com/photos/209868/pexels-photo-209868.jpeg?auto=compress&cs=tinysrgb&w=800',
  'digital-energy-solutions': 'https://images.pexels.com/photos/3735169/pexels-photo-3735169.jpeg?auto=compress&cs=tinysrgb&w=800',
  'factories': 'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=800',
  'minerals-metals': 'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=800',
  'hospitals': 'https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?auto=compress&cs=tinysrgb&w=800',
  'housing': 'https://images.pexels.com/photos/1463917/pexels-photo-1463917.jpeg?auto=compress&cs=tinysrgb&w=800',
  'hydel-projects': 'https://images.pexels.com/photos/247597/pexels-photo-247597.jpeg?auto=compress&cs=tinysrgb&w=800',
  'metros': 'https://images.pexels.com/photos/1714502/pexels-photo-1714502.jpeg?auto=compress&cs=tinysrgb&w=800',
  'nuclear-plants': 'https://images.pexels.com/photos/454790/pexels-photo-454790.jpeg?auto=compress&cs=tinysrgb&w=800',
  'office-spaces': 'https://images.pexels.com/photos/269077/pexels-photo-269077.jpeg?auto=compress&cs=tinysrgb&w=800',
  'ports': 'https://images.pexels.com/photos/161853/pexels-photo-161853.jpeg?auto=compress&cs=tinysrgb&w=800',
  'power-transmission-distribution-infrastructure': 'https://images.pexels.com/photos/461011/pexels-photo-461011.jpeg?auto=compress&cs=tinysrgb&w=800',
  'public-spaces': 'https://images.pexels.com/photos/374016/pexels-photo-374016.jpeg?auto=compress&cs=tinysrgb&w=800',
  'railways': 'https://images.pexels.com/photos/1474487/pexels-photo-1474487.jpeg?auto=compress&cs=tinysrgb&w=800',
  'renewables': 'https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=800',
  'smart-world-solutions': 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
  'transportation-infrastructure': 'https://images.pexels.com/photos/193991/pexels-photo-193991.jpeg?auto=compress&cs=tinysrgb&w=800',
  'unique-structures': 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800',
  'water-infrastructure': 'https://images.pexels.com/photos/417070/pexels-photo-417070.jpeg?auto=compress&cs=tinysrgb&w=800',
};

const defaultImage = 'https://images.pexels.com/photos/175056/pexels-photo-175056.jpeg?auto=compress&cs=tinysrgb&w=800';

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const projects = await Project.find({});
    
    for (let p of projects) {
      const pexelsUrl = categoryImages[p.category] || defaultImage;
      p.image = pexelsUrl;
      await p.save();
    }

    console.log(`Updated images for ${projects.length} projects.`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
