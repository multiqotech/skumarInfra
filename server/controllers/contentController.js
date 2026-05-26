const FAQ = require('../models/FAQ');
const TeamMember = require('../models/TeamMember');
const Testimonial = require('../models/Testimonial');
const Setting = require('../models/Setting');
const BoardDirector = require('../models/BoardDirector');
const Investor = require('../models/Investor');
const PlantMachinery = require('../models/PlantMachinery');
const { uploadToCloudinary } = require('../config/cloudinary');


// ===== FAQ CONTROLLERS =====

const getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find({});
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const createFAQ = async (req, res) => {
  const { question, answer } = req.body;
  try {
    const faq = await FAQ.create({ question, answer });
    res.status(201).json(faq);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

const updateFAQ = async (req, res) => {
  const { question, answer } = req.body;
  try {
    const faq = await FAQ.findById(req.params.id);
    if (faq) {
      faq.question = question || faq.question;
      faq.answer = answer || faq.answer;
      const updatedFAQ = await faq.save();
      res.json(updatedFAQ);
    } else {
      res.status(404).json({ message: 'FAQ not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const deleteFAQ = async (req, res) => {
  try {
    const result = await FAQ.findByIdAndDelete(req.params.id);
    if (result) {
      res.json({ message: 'FAQ removed' });
    } else {
      res.status(404).json({ message: 'FAQ not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ===== TEAM MEMBER CONTROLLERS =====

const getTeamMembers = async (req, res) => {
  try {
    const members = await TeamMember.find({});
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const createTeamMember = async (req, res) => {
  const { name, role, image, description } = req.body;
  try {
    const member = await TeamMember.create({ name, role, image, description });
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

const updateTeamMember = async (req, res) => {
  const { name, role, image, description } = req.body;
  try {
    const member = await TeamMember.findById(req.params.id);
    if (member) {
      member.name = name || member.name;
      member.role = role || member.role;
      member.image = image || member.image;
      if (description !== undefined) {
        member.description = description;
      }
      const updatedMember = await member.save();
      res.json(updatedMember);
    } else {
      res.status(404).json({ message: 'Team member not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const deleteTeamMember = async (req, res) => {
  try {
    const result = await TeamMember.findByIdAndDelete(req.params.id);
    if (result) {
      res.json({ message: 'Team member removed' });
    } else {
      res.status(404).json({ message: 'Team member not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ===== BOARD DIRECTOR CONTROLLERS =====

const getBoardDirectors = async (req, res) => {
  try {
    const directors = await BoardDirector.find({});
    res.json(directors);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const createBoardDirector = async (req, res) => {
  const { name, designation, image, description } = req.body;
  try {
    const director = await BoardDirector.create({ name, designation, image, description });
    res.status(201).json(director);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

const updateBoardDirector = async (req, res) => {
  const { name, designation, image, description } = req.body;
  try {
    const director = await BoardDirector.findById(req.params.id);
    if (director) {
      director.name = name || director.name;
      director.designation = designation || director.designation;
      director.image = image || director.image;
      if (description !== undefined) {
        director.description = description;
      }
      const updatedDirector = await director.save();
      res.json(updatedDirector);
    } else {
      res.status(404).json({ message: 'Board director not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const deleteBoardDirector = async (req, res) => {
  try {
    const result = await BoardDirector.findByIdAndDelete(req.params.id);
    if (result) {
      res.json({ message: 'Board director removed' });
    } else {
      res.status(404).json({ message: 'Board director not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ===== TESTIMONIAL CONTROLLERS =====

const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({});
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const createTestimonial = async (req, res) => {
  const { name, role, text, image, rating } = req.body;
  try {
    const testimonial = await Testimonial.create({ name, role, text, image, rating });
    res.status(201).json(testimonial);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

const updateTestimonial = async (req, res) => {
  const { name, role, text, image, rating } = req.body;
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (testimonial) {
      testimonial.name = name || testimonial.name;
      testimonial.role = role || testimonial.role;
      testimonial.text = text || testimonial.text;
      testimonial.image = image || testimonial.image;
      testimonial.rating = rating || testimonial.rating;
      const updatedTestimonial = await testimonial.save();
      res.json(updatedTestimonial);
    } else {
      res.status(404).json({ message: 'Testimonial not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    const result = await Testimonial.findByIdAndDelete(req.params.id);
    if (result) {
      res.json({ message: 'Testimonial removed' });
    } else {
      res.status(404).json({ message: 'Testimonial not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ===== SETTINGS CONTROLLERS =====

const getSettingByKey = async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key });
    if (setting) {
      res.json(setting);
    } else {
      res.status(404).json({ message: 'Setting not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const updateSetting = async (req, res) => {
  const { value } = req.body;
  const { key } = req.params;
  try {
    let setting = await Setting.findOne({ key });
    if (setting) {
      setting.value = value;
      await setting.save();
    } else {
      setting = await Setting.create({ key, value });
    }
    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ===== INVESTOR CONTROLLERS =====

const getInvestors = async (req, res) => {
  try {
    const investors = await Investor.find({});
    res.json(investors);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const createInvestor = async (req, res) => {
  const { name, image, description } = req.body;
  try {
    const investor = await Investor.create({ name, image, description });
    res.status(201).json(investor);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

const updateInvestor = async (req, res) => {
  const { name, image, description } = req.body;
  try {
    const investor = await Investor.findById(req.params.id);
    if (investor) {
      investor.name = name || investor.name;
      investor.image = image || investor.image;
      if (description !== undefined) {
        investor.description = description;
      }
      const updatedInvestor = await investor.save();
      res.json(updatedInvestor);
    } else {
      res.status(404).json({ message: 'Investor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const deleteInvestor = async (req, res) => {
  try {
    const result = await Investor.findByIdAndDelete(req.params.id);
    if (result) {
      res.json({ message: 'Investor removed' });
    } else {
      res.status(404).json({ message: 'Investor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ===== PLANT & MACHINERY CONTROLLERS =====

const getPlantMachinery = async (req, res) => {
  try {
    const items = await PlantMachinery.find({});
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const createPlantMachinery = async (req, res) => {
  const { type, name, image, description, quantity } = req.body;
  
  // Validation for 50 words description
  const wordCount = description ? description.split(' ').length : 0;
  if (wordCount > 50) {
    return res.status(400).json({ message: 'Description exceeds 50 words limit.' });
  }

  try {
    const item = await PlantMachinery.create({ type, name, image, description, quantity });
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

const updatePlantMachinery = async (req, res) => {
  const { type, name, image, description, quantity } = req.body;
  
  if (description) {
    const wordCount = description.split(' ').length;
    if (wordCount > 50) {
      return res.status(400).json({ message: 'Description exceeds 50 words limit.' });
    }
  }

  try {
    const item = await PlantMachinery.findById(req.params.id);
    if (item) {
      item.type = type || item.type;
      item.name = name || item.name;
      item.image = image || item.image;
      if (description !== undefined) item.description = description;
      if (quantity !== undefined) item.quantity = quantity;
      
      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'Plant/Machinery item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const deletePlantMachinery = async (req, res) => {
  try {
    const result = await PlantMachinery.findByIdAndDelete(req.params.id);
    if (result) {
      res.json({ message: 'Plant/Machinery item removed' });
    } else {
      res.status(404).json({ message: 'Plant/Machinery item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ===== UPLOAD IMAGE CONTROLLER =====
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please provide an image file to upload' });
    }
    console.log(`📤 Uploading image: ${req.file.originalname} (${(req.file.size / 1024).toFixed(1)}KB, ${req.file.mimetype})`);
    const result = await uploadToCloudinary(req.file.buffer);
    console.log(`✅ Upload complete. URL: ${result.secure_url}`);
    res.status(200).json({
      message: 'Image uploaded successfully',
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
    res.status(500).json({
      message: error.message || 'Failed to upload image',
      error: error.message
    });
  }
};

module.exports = {
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getSettingByKey,
  updateSetting,
  uploadImage,
  getBoardDirectors,
  createBoardDirector,
  updateBoardDirector,
  deleteBoardDirector,
  getInvestors,
  createInvestor,
  updateInvestor,
  deleteInvestor,
  getPlantMachinery,
  createPlantMachinery,
  updatePlantMachinery,
  deletePlantMachinery,
};

