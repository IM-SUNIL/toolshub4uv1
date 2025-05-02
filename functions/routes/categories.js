const express = require('express');
const router = express.Router();
const Category = require('../models/Category'); // Adjust path as needed
const Tool = require('../models/Tool'); // Needed to get tools by category

// @route   POST /api/categories/add
// @desc    Add a new category
// @access  Public (consider adding auth later)
router.post('/add', async (req, res) => {
  console.log("Received data for new category:", req.body);

  const { name, slug, description, iconName } = req.body;
  if (!name || !slug || !description || !iconName) {
     return res.status(400).json({ msg: 'Please include name, slug, description, and iconName.' });
  }

  try {
    let category = await Category.findOne({ slug: req.body.slug });
    if (category) {
      return res.status(400).json({ msg: `Category with slug '${req.body.slug}' already exists.` });
    }

    // Check if name is unique too (optional, depends on requirements)
    category = await Category.findOne({ name: req.body.name });
     if (category) {
       return res.status(400).json({ msg: `Category with name '${req.body.name}' already exists.` });
     }


    category = new Category({
        ...req.body
    });

    await category.save();
    console.log("Category saved successfully:", category);
    res.status(201).json({ msg: 'Category added successfully', category });

  } catch (err) {
    console.error("Error saving category:", err.message);
    if (err.name === 'ValidationError') {
         const messages = Object.values(err.errors).map(val => val.message);
         return res.status(400).json({ msg: 'Validation Error', errors: messages });
     }
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 }); // Sort alphabetically by name
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/categories/:categorySlug/tools
// @desc    Get all tools for a specific category slug
// @access  Public
router.get('/:categorySlug/tools', async (req, res) => {
  try {
    const categorySlug = req.params.categorySlug;
    // First, check if the category exists (optional but good practice)
    const category = await Category.findOne({ slug: categorySlug });
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }

    // Find tools matching the category slug
    const tools = await Tool.find({ categorySlug: categorySlug }).sort({ rating: -1 }); // Sort by rating descending
    res.json(tools);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// Add routes for getting single category, updating, deleting categories as needed

module.exports = router;
