const News = require('../models/News');
const MediaContact = require('../models/MediaContact');

// Helper to generate a slug
const generateSlug = (text) => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '')             // Trim - from end of text
    + '-' + Date.now().toString().slice(-6); // Add random part for uniqueness
};

// ==========================
// NEWS CONTROLLERS
// ==========================

const getNews = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const news = await News.find(filter).sort({ date: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching news', error: error.message });
  }
};

const getNewsBySlug = async (req, res) => {
  try {
    const news = await News.findOne({ slug: req.params.slug });
    if (news) {
      res.json(news);
    } else {
      res.status(404).json({ message: 'News item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching news item', error: error.message });
  }
};

const createNews = async (req, res) => {
  try {
    const { type, headline, date, body, image, description, videoLink, pdf } = req.body;
    
    if (!type || !headline || !date) {
      return res.status(400).json({ message: 'Type, headline, and date are required' });
    }

    const slug = generateSlug(headline);

    const news = new News({
      type,
      headline,
      slug,
      date,
      body,
      image,
      description,
      videoLink,
      pdf
    });

    const createdNews = await news.save();
    res.status(201).json(createdNews);
  } catch (error) {
    res.status(500).json({ message: 'Server Error creating news', error: error.message });
  }
};

const updateNews = async (req, res) => {
  try {
    const { type, headline, date, body, image, description, videoLink, pdf } = req.body;
    
    const news = await News.findById(req.params.id);
    
    if (news) {
      news.type = type || news.type;
      news.headline = headline || news.headline;
      news.date = date || news.date;
      
      // Update specific fields based on type
      if (body !== undefined) news.body = body;
      if (image !== undefined) news.image = image;
      if (description !== undefined) news.description = description;
      if (videoLink !== undefined) news.videoLink = videoLink;
      if (pdf !== undefined) news.pdf = pdf;
      
      const updatedNews = await news.save();
      res.json(updatedNews);
    } else {
      res.status(404).json({ message: 'News not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error updating news', error: error.message });
  }
};

const deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    
    if (news) {
      await news.deleteOne();
      res.json({ message: 'News removed' });
    } else {
      res.status(404).json({ message: 'News not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error deleting news', error: error.message });
  }
};

// ==========================
// MEDIA CONTACTS CONTROLLERS
// ==========================

const getMediaContacts = async (req, res) => {
  try {
    const contacts = await MediaContact.find().sort({ createdAt: 1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching media contacts', error: error.message });
  }
};

const createMediaContact = async (req, res) => {
  try {
    const { name, designation, email } = req.body;
    
    if (!name || !designation || !email) {
      return res.status(400).json({ message: 'Name, designation, and email are required' });
    }

    const contact = new MediaContact({ name, designation, email });
    const createdContact = await contact.save();
    res.status(201).json(createdContact);
  } catch (error) {
    res.status(500).json({ message: 'Server Error creating media contact', error: error.message });
  }
};

const updateMediaContact = async (req, res) => {
  try {
    const { name, designation, email } = req.body;
    
    const contact = await MediaContact.findById(req.params.id);
    
    if (contact) {
      contact.name = name || contact.name;
      contact.designation = designation || contact.designation;
      contact.email = email || contact.email;
      
      const updatedContact = await contact.save();
      res.json(updatedContact);
    } else {
      res.status(404).json({ message: 'Media contact not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error updating media contact', error: error.message });
  }
};

const deleteMediaContact = async (req, res) => {
  try {
    const contact = await MediaContact.findById(req.params.id);
    
    if (contact) {
      await contact.deleteOne();
      res.json({ message: 'Media contact removed' });
    } else {
      res.status(404).json({ message: 'Media contact not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error deleting media contact', error: error.message });
  }
};

module.exports = {
  getNews,
  getNewsBySlug,
  createNews,
  updateNews,
  deleteNews,
  getMediaContacts,
  createMediaContact,
  updateMediaContact,
  deleteMediaContact
};
