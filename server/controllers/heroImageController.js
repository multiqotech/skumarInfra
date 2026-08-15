const HeroImage = require('../models/HeroImage');

// Get all hero images
const getHeroImages = async (req, res) => {
  try {
    const images = await HeroImage.find({}).sort({ order: 1, createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching hero images', error: error.message });
  }
};

// Add a new hero image
const addHeroImage = async (req, res) => {
  try {
    const { image, order } = req.body;
    
    if (!image) {
      return res.status(400).json({ message: 'Image URL is required' });
    }

    const heroImage = new HeroImage({
      image,
      order: order || 0
    });

    const savedImage = await heroImage.save();
    res.status(201).json(savedImage);
  } catch (error) {
    res.status(500).json({ message: 'Server Error adding hero image', error: error.message });
  }
};

// Delete a hero image
const deleteHeroImage = async (req, res) => {
  try {
    const heroImage = await HeroImage.findById(req.params.id);
    
    if (heroImage) {
      await heroImage.deleteOne();
      res.json({ message: 'Hero image removed' });
    } else {
      res.status(404).json({ message: 'Hero image not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error deleting hero image', error: error.message });
  }
};

// Reorder hero images
const reorderHeroImages = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Items array is required' });
    }
    
    // Bulk update
    const updates = items.map(item => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { order: item.order } }
      }
    }));
    
    await HeroImage.bulkWrite(updates);
    res.json({ message: 'Order updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error reordering hero images', error: error.message });
  }
};

module.exports = {
  getHeroImages,
  addHeroImage,
  deleteHeroImage,
  reorderHeroImages
};
