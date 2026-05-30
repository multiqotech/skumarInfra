const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const Project = require('../models/Project');
const connectDB = require('../config/db');

const seedTypes = async () => {
  try {
    await connectDB();
    console.log('Connected to DB');

    const projects = await Project.find({});
    console.log(`Found ${projects.length} projects to update.`);

    const types = ['Ongoing', 'Completed', 'Awarded'];

    let updatedCount = 0;
    for (let project of projects) {
      // Randomly select a type
      const randomType = types[Math.floor(Math.random() * types.length)];
      project.projectType = randomType;
      project.status = undefined; // Remove status if it exists
      await project.save();
      updatedCount++;
    }

    // Unset the status field in the db entirely using updateMany
    await Project.updateMany({}, { $unset: { status: 1 } });

    console.log(`Successfully updated ${updatedCount} projects with random projectTypes and removed status field.`);
    process.exit(0);
  } catch (error) {
    console.error('Error updating project types:', error);
    process.exit(1);
  }
};

seedTypes();
