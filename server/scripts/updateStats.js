require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Setting = require('../models/Setting');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    let stats = await Setting.findOne({ key: 'stats' });
    if (stats) {
      const parsed = JSON.parse(stats.value);
      parsed.projectValue = '₹650Cr+';
      stats.value = JSON.stringify(parsed);
      await stats.save();
      console.log('Updated to', stats.value);
    } else {
      console.log('Stats setting not found in DB');
    }
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
