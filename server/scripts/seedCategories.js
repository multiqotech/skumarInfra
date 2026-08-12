require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Category = require('../models/Category');
const Project = require('../models/Project');

const dataPath = path.join(__dirname, '../../client/src/data/weBuildData.js');
let fileContent = fs.readFileSync(dataPath, 'utf8');

// Strip out the ES6 export syntax so we can eval it
fileContent = fileContent.replace('export const weBuildData = ', '');
fileContent = fileContent.replace(/;\s*$/, '');

let weBuildData;
try {
  weBuildData = eval('(' + fileContent + ')');
} catch(e) {
  console.error("Error parsing weBuildData:", e);
  process.exit(1);
}

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    for (const [slug, data] of Object.entries(weBuildData)) {
      // Seed Categories
      const categoryExists = await Category.findOne({ slug });
      if (!categoryExists) {
        await Category.create({
          name: data.title,
          slug: slug,
          heroImage: data.heroImage,
          tagline: data.tagline,
          description: data.description,
          descriptionImage: data.descriptionImage,
        });
        console.log(`Created category: ${slug}`);
      } else {
        console.log(`Category already exists: ${slug}`);
      }

      // Seed Projects for this category
      if (data.projects && data.projects.length > 0) {
        for (const proj of data.projects) {
          const projectExists = await Project.findOne({ title: proj.title, category: slug });
          if (!projectExists) {
            await Project.create({
              title: proj.title,
              category: slug,
              projectType: (proj.projectType === 'Iconic' ? 'Awarded' : 'Ongoing'),
              image: proj.image,
            });
            console.log(`Created project: ${proj.title} under ${slug}`);
          }
        }
      }
    }
    console.log('Seeding finished successfully');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
