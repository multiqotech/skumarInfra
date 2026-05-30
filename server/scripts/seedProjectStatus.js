const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const Project = require('../models/Project');
const connectDB = require('../config/db');

const seedStatuses = async () => {
  try {
    await connectDB();
    console.log('Connected to DB');

    const projects = await Project.find({});
    console.log(`Found ${projects.length} projects to update.`);

    const statuses = ['Ongoing', 'Completed', 'Awarded'];

    let updatedCount = 0;
    for (let project of projects) {
      // Randomly select a status
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      project.status = randomStatus;
      await project.save();
      updatedCount++;
    }

    console.log(`Successfully updated ${updatedCount} projects with random statuses.`);
    process.exit(0);
  } catch (error) {
    console.error('Error updating project statuses:', error);
    process.exit(1);
  }
};

seedStatuses();
