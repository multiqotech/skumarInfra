const Category = require('../models/Category');

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate('projects');
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get category by slug
const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug }).populate('projects');
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Create a new category
const createCategory = async (req, res) => {
  try {
    const { name, heroImage, tagline, description, descriptionImage } = req.body;
    
    // Generate slug from name
    const slug = name.toLowerCase().replace(/ & /g, '-').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Check if category already exists
    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }

    const newCategory = new Category({
      name,
      slug,
      heroImage,
      tagline,
      description,
      descriptionImage
    });

    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const { name, heroImage, tagline, description, descriptionImage } = req.body;
    
    // If name changes, we could update the slug, but that might break existing projects that use the old slug.
    // It's safer to keep the slug the same, or update all projects if slug changes.
    // We will keep the slug unchanged here, or only update it if necessary.
    // Let's just update fields other than slug for safety.
    
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    if (name) category.name = name;
    if (heroImage !== undefined) category.heroImage = heroImage;
    if (tagline !== undefined) category.tagline = tagline;
    if (description !== undefined) category.description = description;
    if (descriptionImage !== undefined) category.descriptionImage = descriptionImage;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    await category.deleteOne();
    res.json({ message: 'Category removed' });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
};
