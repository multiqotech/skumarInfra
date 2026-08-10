require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Project = require('../models/Project');

const pexelsUpdates = [
  { title: 'Regional Water Supply & Dam Project', image: 'https://images.pexels.com/photos/417070/pexels-photo-417070.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { title: 'Cable-Stayed River Bridge', image: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { title: 'Rural Road Development - Neemakhedi, Budni', image: 'https://images.pexels.com/photos/1563355/pexels-photo-1563355.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { title: 'Structures Contract - NH-148N, Delhi-Vadodara Expressway', image: 'https://images.pexels.com/photos/193991/pexels-photo-193991.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { title: 'Road Project - Beganda to Kacchibaroda', image: 'https://images.pexels.com/photos/3862632/pexels-photo-3862632.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { title: 'Road Work on SH Road Boriguma-Ranigunda', image: 'https://images.pexels.com/photos/1262304/pexels-photo-1262304.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { title: 'NH 201, Nabrangpur-Kokasara', image: 'https://images.pexels.com/photos/108921/pexels-photo-108921.jpeg?auto=compress&cs=tinysrgb&w=800' }
];

const seedData = [
  { title: "Earthwork in Embankment on NH 69, Nagpur-Saoner-Betul", image: "/assets/doc-images/image1.jpg" },
  { title: "Material Transport for Road Construction on NH 69A", image: "/assets/doc-images/image2.jpg" },
  { title: "Embankment and Subgrade Work at Palsana", image: "/assets/doc-images/image3.jpg" },
  { title: "Embankment & Aggregate Transport for NH 8D Jetpur-Somnath", image: "/assets/doc-images/image4.jpg" },
  { title: "Road Work on SH Road Boriguma-Ranigunda", image: "/assets/doc-images/image5.jpg" },
  { title: "NH 201, Nabrangpur-Kokasara", image: "/assets/doc-images/image6.jpg" },
  { title: "Road and Structure Work - NH 5, Jharpokhariya-Baripada-Baleshwar", image: "/assets/doc-images/image7.jpg" },
  { title: "Structures Contract - NH-148N, Delhi-Vadodara Expressway", image: "/assets/doc-images/image8.jpg" },
  { title: "Structure Work on Expressway - NH 751, Ahmedabad-Dholera", image: "/assets/doc-images/image9.jpg" },
  { title: "Road Project - Badnawar-Ratlam to Dhamana Kachi", image: "/assets/doc-images/image10.jpg" },
  { title: "Road Project - Beganda to Kacchibaroda", image: "/assets/doc-images/image11.jpg" },
  { title: "Rural Road Development - Neemakhedi, Budni", image: "/assets/doc-images/image12.jpg" },
  { title: "Eight-lane access-controlled Expressway PKG-VIII Gujarat, KM 180 to 190", image: "/assets/doc-images/image13.jpg" },
  { title: "Eight-lane access-controlled Expressway PKG-VIII Gujarat, KM 175 to 180", image: "/assets/doc-images/image14.jpg" },
  { title: "Box Culverts and Bridges on Bharuch-Dahej Road", image: "/assets/doc-images/image15.jpg" },
  { title: "Submersible Bridge Work - Ratlam District", image: "/assets/doc-images/image16.jpg" },
  { title: "Group Housing Project - 42 Duplex Houses", image: "/assets/doc-images/image17.jpg" },
  { title: "Embankment Construction at Kandla Port Jetty No. 13", image: "/assets/doc-images/image18.jpg" },
  { title: "Excavation for Pipelines at Falna, Pali (RAJ) - Salaya-Mathura Pipeline", image: "/assets/doc-images/image19.jpg" }
];

const categoriesOrder = [
  { slug: 'transportation-infrastructure', title: 'Major Highway Expansion Project', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop' },
  { slug: 'water-infrastructure', title: 'Regional Water Supply & Dam Project', image: 'https://images.unsplash.com/photo-1520699049698-acd2fce18738?w=800&h=600&fit=crop' },
  { slug: 'unique-structures', title: 'Iconic City Center Development', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop' },
  { slug: 'smart-world-solutions', title: 'Smart City Infrastructure Upgrade', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop' },
  { slug: 'renewables', title: 'Large Scale Solar Park', image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=600&fit=crop' },
  { slug: 'railways', title: 'High-Speed Rail Corridor', image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&h=600&fit=crop' },
  { slug: 'bridges', title: 'Cable-Stayed River Bridge', image: 'https://images.unsplash.com/photo-1513467535987-fd81bc7d600f?w=800&h=600&fit=crop' }
];

(async () => {
  try {
    const { weBuildData } = await import('../../client/src/data/weBuildData.js');
    await mongoose.connect(process.env.MONGO_URI);
    
    // Build priority map
    const imageMap = new Map(); // title -> image
    
    // 1. Lowest priority: weBuildData
    Object.values(weBuildData).forEach(cat => {
      cat.projects.forEach(p => {
        imageMap.set(p.title, p.image);
      });
    });
    
    // 2. Next priority: categoriesOrder (for the generic mock projects)
    categoriesOrder.forEach(cat => {
      imageMap.set(cat.title, cat.image);
    });
    
    // 3. Next priority: seedData
    seedData.forEach(p => {
      imageMap.set(p.title, p.image);
    });
    
    // 4. Highest priority: pexelsUpdates (the 7 specific updates the user asked for)
    pexelsUpdates.forEach(p => {
      imageMap.set(p.title, p.image);
    });
    
    const projects = await Project.find({});
    let updatedCount = 0;
    
    for (let p of projects) {
      if (imageMap.has(p.title)) {
        p.image = imageMap.get(p.title);
        await p.save();
        updatedCount++;
      } else {
        console.log("No match found for:", p.title);
      }
    }
    
    console.log(`Successfully restored images for ${updatedCount} out of ${projects.length} projects.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
