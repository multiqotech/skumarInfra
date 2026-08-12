require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Project = require('../models/Project');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Find all projects
    const allProjects = await Project.find({});
    
    // Group by image
    const imageMap = new Map();
    const projectsToDelete = [];
    
    for (const project of allProjects) {
      if (!project.image) continue;
      
      if (imageMap.has(project.image)) {
        projectsToDelete.push(project._id);
      } else {
        imageMap.set(project.image, project._id);
      }
    }
    
    console.log(`Found ${projectsToDelete.length} duplicate projects based on image.`);
    
    if (projectsToDelete.length > 0) {
      const result = await Project.deleteMany({ _id: { $in: projectsToDelete } });
      console.log(`Successfully deleted ${result.deletedCount} duplicate projects.`);
    } else {
      console.log('No duplicates found.');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error removing duplicates:', err);
    process.exit(1);
  }
})();
