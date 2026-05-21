const FAQ = require('../models/FAQ');
const TeamMember = require('../models/TeamMember');
const Testimonial = require('../models/Testimonial');
const Setting = require('../models/Setting');
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
  const { name, role, image } = req.body;
  try {
    const member = await TeamMember.create({ name, role, image });
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

const updateTeamMember = async (req, res) => {
  const { name, role, image } = req.body;
  try {
    const member = await TeamMember.findById(req.params.id);
    if (member) {
      member.name = name || member.name;
      member.role = role || member.role;
      member.image = image || member.image;
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
};

