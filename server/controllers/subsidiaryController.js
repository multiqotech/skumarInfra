const Subsidiary = require('../models/Subsidiary');

// Get all subsidiaries
const getSubsidiaries = async (req, res) => {
  try {
    const subsidiaries = await Subsidiary.find().sort({ createdAt: 1 });
    res.json(subsidiaries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new subsidiary
const addSubsidiary = async (req, res) => {
  const { name, description, image, link } = req.body;

  try {
    const newSubsidiary = new Subsidiary({
      name,
      description,
      image,
      link,
    });
    
    const savedSubsidiary = await newSubsidiary.save();
    res.status(201).json(savedSubsidiary);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a subsidiary
const updateSubsidiary = async (req, res) => {
  const { name, description, image, link } = req.body;

  try {
    const subsidiary = await Subsidiary.findById(req.params.id);
    if (!subsidiary) return res.status(404).json({ message: 'Subsidiary not found' });

    subsidiary.name = name || subsidiary.name;
    subsidiary.description = description || subsidiary.description;
    if (image !== undefined) subsidiary.image = image;
    if (link !== undefined) subsidiary.link = link;

    const updatedSubsidiary = await subsidiary.save();
    res.json(updatedSubsidiary);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a subsidiary
const deleteSubsidiary = async (req, res) => {
  try {
    const subsidiary = await Subsidiary.findById(req.params.id);
    if (!subsidiary) return res.status(404).json({ message: 'Subsidiary not found' });

    await subsidiary.deleteOne();
    res.json({ message: 'Subsidiary removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getSubsidiaries,
  addSubsidiary,
  updateSubsidiary,
  deleteSubsidiary,
};
