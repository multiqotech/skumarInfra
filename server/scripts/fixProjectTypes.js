require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Project = require('../models/Project');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // First, set ALL projects to Completed by default to clear the 'Ongoing' spam
    await Project.updateMany({}, { projectType: 'Completed' });

    // Now, carefully set the ones that are actually Ongoing or Awarded
    
    const ongoingTitles = [
      "Road Project - Beganda to Kacchibaroda",
      "Rural Road Development - Neemakhedi, Budni",
      "Submersible Bridge Work - Ratlam District"
    ];

    const awardedTitles = [
      "Eight-lane access-controlled Expressway PKG-VIII Gujarat, KM 180 to 190",
      "Eight-lane access-controlled Expressway PKG-VIII Gujarat, KM 175 to 180"
    ];

    await Project.updateMany({ title: { $in: ongoingTitles } }, { projectType: 'Ongoing' });
    await Project.updateMany({ title: { $in: awardedTitles } }, { projectType: 'Awarded' });

    console.log("Fixed project types in database.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
