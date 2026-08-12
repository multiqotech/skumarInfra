const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Project = require('./models/Project');

dotenv.config();

const migrateProjectTypes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const collection = mongoose.connection.collection('projects');
    const projects = await collection.find({ projectType: { $type: "string" } }).toArray();
    let updatedCount = 0;

    for (const project of projects) {
      await collection.updateOne(
        { _id: project._id },
        { $set: { projectType: [project.projectType] } }
      );
      updatedCount++;
    }

    console.log(`Successfully migrated ${updatedCount} projects.`);
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
};

migrateProjectTypes();
