const WeArePage = require('../models/WeArePage');

// Get all We Are pages (basic info)
const getWeArePages = async (req, res) => {
  try {
    const pages = await WeArePage.find({}, 'slug title');
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get a specific We Are page by slug
const getWeArePageBySlug = async (req, res) => {
  try {
    const page = await WeArePage.findOne({ slug: req.params.slug });
    if (page) {
      res.json(page);
    } else {
      res.status(404).json({ message: 'Page not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Update or Create a We Are page
const updateWeArePage = async (req, res) => {
  const { slug } = req.params;
  const { title, pageData } = req.body;

  try {
    let page = await WeArePage.findOne({ slug });
    
    if (page) {
      page.title = title || page.title;
      page.pageData = pageData || page.pageData;
      
      // Need to tell mongoose that the Mixed type was modified
      page.markModified('pageData');
      
      const updatedPage = await page.save();
      res.json(updatedPage);
    } else {
      // Create if it doesn't exist
      if (!title) {
        return res.status(400).json({ message: 'Title is required for new page' });
      }
      page = await WeArePage.create({
        slug,
        title,
        pageData: pageData || {}
      });
      res.status(201).json(page);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error updating page', error: error.message });
  }
};

module.exports = {
  getWeArePages,
  getWeArePageBySlug,
  updateWeArePage
};
