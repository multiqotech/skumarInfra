require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Project = require('../models/Project');

const categoriesOrder = [
  { slug: 'transportation-infrastructure', title: 'Major Highway Expansion Project', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop' },
  { slug: 'water-infrastructure', title: 'Regional Water Supply & Dam Project', image: 'https://images.unsplash.com/photo-1520699049698-acd2fce18738?w=800&h=600&fit=crop' },
  { slug: 'unique-structures', title: 'Iconic City Center Development', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop' },
  { slug: 'smart-world-solutions', title: 'Smart City Infrastructure Upgrade', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop' },
  { slug: 'renewables', title: 'Large Scale Solar Park', image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=600&fit=crop' },
  { slug: 'railways', title: 'High-Speed Rail Corridor', image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&h=600&fit=crop' },
  { slug: 'bridges', title: 'Cable-Stayed River Bridge', image: 'https://images.unsplash.com/photo-1513467535987-fd81bc7d600f?w=800&h=600&fit=crop' }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const projectTypes = ['Completed', 'Awarded'];
    
    for (const type of projectTypes) {
      console.log(`Processing ${type} projects...`);
      const now = new Date();
      // Push all existing to the back using native collection updates to bypass schema immutability
      await Project.collection.updateMany({ projectType: type }, { $set: { createdAt: new Date(now.getTime() - 100000000) } });

      for (let i = 0; i < categoriesOrder.length; i++) {
        const cat = categoriesOrder[i];
        let project = await Project.findOne({ category: cat.slug, projectType: type });
        
        if (!project) {
          project = new Project({
            title: cat.title + ` (${type})`,
            category: cat.slug,
            projectType: type,
            image: cat.image,
            description: `A landmark ${type.toLowerCase()} project contributing to regional development.`
          });
          await project.save();
        }
        
        await Project.collection.updateOne(
          { _id: project._id }, 
          { $set: { createdAt: new Date(now.getTime() - (i * 60000)) } }
        );
        console.log(`Updated project for ${cat.slug} (${type}) with new date.`);
      }
    }

    console.log('Reordered Completed and Awarded projects successfully.');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
