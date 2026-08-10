require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Project = require('../models/Project');

async function fetchUnsplashImages(query, count) {
  const url = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=${Math.max(30, count)}&page=1`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      return data.results.map(img => `https://images.unsplash.com/photo-${img.id}?w=800&h=600&fit=crop`);
    }
  } catch (err) {
    console.error(`Failed to fetch Unsplash for ${query}`, err);
  }
  return [];
}

const fallbackImages = [
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=600&fit=crop',
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const projects = await Project.find({});
    console.log(`Found ${projects.length} projects to update.`);

    // Group projects by category
    const categoryMap = {};
    for (let p of projects) {
      if (!categoryMap[p.category]) categoryMap[p.category] = [];
      categoryMap[p.category].push(p);
    }

    let fallbackIndex = 0;

    for (let category in categoryMap) {
      console.log(`Fetching Unsplash images for category: ${category}`);
      let searchTerms = category.replace(/-/g, ' ');
      if (searchTerms === 'unique structures') searchTerms = 'architecture structure';
      if (searchTerms === 'defence installations') searchTerms = 'military base';
      if (searchTerms === 'minerals metals') searchTerms = 'metal industry';
      
      const images = await fetchUnsplashImages(searchTerms + ' construction', categoryMap[category].length);
      
      for (let p of categoryMap[category]) {
        if (images.length > 0) {
          p.image = images.shift();
        } else {
          p.image = fallbackImages[fallbackIndex % fallbackImages.length];
          fallbackIndex++;
        }
        await p.save();
      }
      console.log(`Updated ${categoryMap[category].length} projects for ${category}.`);
      // Sleep a bit to avoid hitting Unsplash API limits
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('Successfully updated all projects with unique Unsplash images.');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
