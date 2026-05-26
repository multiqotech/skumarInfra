require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const PlantMachinery = require('../models/PlantMachinery');

const dummyImage = 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800&auto=format&fit=crop'; // Generic machinery photo

const data = [
  { type: 'Plant', name: 'Stone Crusher Unit (250TPH Three Stage)', description: 'Pozzolana and Metso (VSI)', quantity: 2, image: dummyImage },
  { type: 'Plant', name: 'Hot Batch Mix Bituminous Plant 120TPH', description: 'Speco', quantity: 1, image: dummyImage },
  { type: 'Plant', name: 'Drum Mix Bituminous Plant 40TPH', description: 'Appollo', quantity: 1, image: dummyImage },
  { type: 'Plant', name: 'Concrete Batch Mix Plant', description: 'Schwing Stetter/Conmat-18/30/90/120 Cum', quantity: 4, image: dummyImage },
  { type: 'Machinery', name: 'Motor Grader', description: 'CAT/Kamastu/Case', quantity: 4, image: dummyImage },
  { type: 'Machinery', name: 'Excavators', description: 'CAT/Kamastu/Hyundai/Volvo', quantity: 12, image: dummyImage },
  { type: 'Machinery', name: 'Tippers/Dumper', description: 'TATA Hyva LPK 2518/Bharat Benz 3528', quantity: 38, image: dummyImage },
  { type: 'Machinery', name: 'Transit Mixers', description: 'Schwing Stetter -7/9 Cum', quantity: 8, image: dummyImage },
  { type: 'Machinery', name: 'Tipper Trailer 18 Wheels', description: 'Bharat Benz & Eicher', quantity: 17, image: dummyImage },
  { type: 'Machinery', name: 'Vibratory Soil Compactor', description: 'HAM/ Volvo', quantity: 8, image: dummyImage },
  { type: 'Machinery', name: 'Backhoe Loader', description: 'CAT/ JCB', quantity: 5, image: dummyImage },
  { type: 'Machinery', name: 'Wheel Loader', description: 'CAT', quantity: 3, image: dummyImage },
  { type: 'Machinery', name: 'Tandem Roller', description: 'HAM/Case', quantity: 4, image: dummyImage },
  { type: 'Machinery', name: 'Paver Finisher [Vogele-1300] [5-7Mtrs]', description: 'Vogele', quantity: 2, image: dummyImage },
  { type: 'Machinery', name: 'Shuttering & Staging Material', description: 'Various staging material', quantity: 30000, image: dummyImage }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    await PlantMachinery.deleteMany({});
    console.log('Old plant/machinery data removed');

    await PlantMachinery.insertMany(data);
    console.log('New plant/machinery data seeded successfully!');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
