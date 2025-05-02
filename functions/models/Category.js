const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: [true, 'Category name is required.'],
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Category description is required.'],
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters.'],
  },
  iconName: { // Store the name of the Lucide icon
    type: String,
    required: [true, 'Icon name is required.'],
    trim: true,
  },
  imageURL: {
    type: String, // URL
    required: false, // Optional
    trim: true,
  },
  tags: [
    {
      type: String,
      trim: true,
      lowercase: true,
    }
  ],
  // Optional: Add parent category for nesting
  // parent: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Category',
  //   default: null
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Avoid recompiling the model if it already exists
module.exports = mongoose.models.Category || mongoose.model('Category', CategorySchema);
