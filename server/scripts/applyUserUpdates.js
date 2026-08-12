require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Project = require('../models/Project');

const cloudinaryUpdates = {
  "Sustainable Underground Structures Project": "https://res.cloudinary.com/ddh5ynpqg/image/upload/v1786533201/node_uploads/epnwu0iavozjwkyfdr6e.png",
  "Regional Underground Structures Development": "https://res.cloudinary.com/ddh5ynpqg/image/upload/v1786533261/node_uploads/tz9gzrlu2qra9jhuouef.png",
  "National Underground Structures Hub": "https://res.cloudinary.com/ddh5ynpqg/image/upload/v1786533338/node_uploads/pnxghxlo4w7ymk0x4wmy.png", // Assuming this was the 3rd one
};

const unsplashQueries = [
  "Regional Public Spaces Development",
  "Sustainable Office Spaces Project",
  "Regional Office Spaces Development",
  "Regional Nuclear Plants Development",
  "Iconic Nuclear Plants Project I",
  "Sustainable Metros Project",
  "Regional Metros Development",
  "National Metros Hub",
  "Sustainable Hydel Projects Project",
  "Regional Hydel Projects Development",
  "National Hydel Projects Hub",
  "National Hospitals Hub",
  "Global Hospitals Initiative",
  "Regional Defence Installations Development",
  "National Defence Installations Hub"
];

const featuredImages = [
  "https://res.cloudinary.com/ddh5ynpqg/image/upload/v1786532566/node_uploads/sdiiqliizyj5ariqkcce.png",
  "https://res.cloudinary.com/ddh5ynpqg/image/upload/v1786532603/node_uploads/l0aphgdnt8jbqnh2vv9r.png",
  "https://res.cloudinary.com/ddh5ynpqg/image/upload/v1786532626/node_uploads/oo6gzojzw8hatl8djsqu.png",
  "https://res.cloudinary.com/ddh5ynpqg/image/upload/v1786532654/node_uploads/xaycaswt3n3gtkgltxu9.png",
  "https://res.cloudinary.com/ddh5ynpqg/image/upload/v1786532691/node_uploads/oliz0dkeabcjgd0eykjv.png",
  "https://res.cloudinary.com/ddh5ynpqg/image/upload/v1786532717/node_uploads/mpny2mqkw78fvbg1sy1z.png",
  "https://res.cloudinary.com/ddh5ynpqg/image/upload/v1786532750/node_uploads/zomi9i5jxdiq7g9z7tya.png",
  "https://res.cloudinary.com/ddh5ynpqg/image/upload/v1786532786/node_uploads/pfl86rhijmlulhf7bawg.png"
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // 1. Featured projects (latest 8 projects, which are from production seed)
    const featuredProjects = await Project.find({}).sort({ createdAt: -1 }).limit(8);
    for (let i = 0; i < featuredProjects.length; i++) {
      featuredProjects[i].image = featuredImages[i];
      await featuredProjects[i].save();
      console.log(`Updated featured project ${i + 1}: ${featuredProjects[i].title}`);
    }

    // 2. Specific Cloudinary updates
    for (const [title, url] of Object.entries(cloudinaryUpdates)) {
      const updated = await Project.findOneAndUpdate({ title }, { image: url });
      if (updated) {
        console.log(`Updated specific project: ${title}`);
      } else {
        console.log(`Not found: ${title}`);
      }
    }

    // 3. Unsplash random images for the rest
    for (const title of unsplashQueries) {
      let query = title.split(' ').slice(-2).join(' '); // use last two words as query
      if (query.includes('Development')) query = title.split(' ')[0] + ' construction';
      
      const randomId = Math.floor(Math.random() * 1000); // to avoid duplicates
      const url = `https://source.unsplash.com/800x600/?${encodeURIComponent(query)},${randomId}`;
      const updated = await Project.findOneAndUpdate({ title }, { image: url });
      if (updated) {
        console.log(`Updated unsplash project: ${title} with query ${query}`);
      } else {
        console.log(`Not found (unsplash): ${title}`);
      }
    }

    console.log("All updates completed.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
