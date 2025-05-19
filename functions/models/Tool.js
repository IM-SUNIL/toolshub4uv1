const mongoose = require('mongoose');

const ToolSchema = new mongoose.Schema({
  // Use slug as the primary identifier if desired, otherwise rely on MongoDB's _id
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: [true, 'Tool name is required.'],
    trim: true,
  },
  image: {
    type: String, // URL
    required: false, // Optional, use default if not provided
    trim: true,
  },
  categorySlug: {
    type: String,
    required: [true, 'Category slug is required.'],
    ref: 'Category', // Reference the Category model
  },
  isFree: {
    type: Boolean,
    required: true,
    default: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
    default: 0,
  },
  summary: {
    type: String,
    required: [true, 'Short summary is required.'],
    trim: true,
    maxlength: [160, 'Summary cannot exceed 160 characters.'],
  },
  description: {
    type: String, // Can contain HTML or Markdown
    required: [true, 'Detailed description is required.'],
    trim: true,
  },
  usageSteps: [
    {
      text: { type: String, required: true },
      // iconName: { type: String } // Optional icon name for each step
    }
  ],
  websiteLink: {
    type: String,
    required: [true, 'Website link is required.'],
    trim: true,
    // Enforce HTTPS for website links
    match: [/^https:\/\/.+/, 'Please enter a valid URL starting with https://']
  },
  tags: [
    {
      type: String,
      trim: true,
      lowercase: true,
    }
  ],
  // Comments can be embedded or referenced from a separate collection
  // Embedded example:
  comments: [
     {
       name: { type: String, required: true },
       comment: { type: String, required: true },
       timestamp: { type: Date, default: Date.now }
       // MongoDB will automatically add _id to subdocuments in arrays
     }
  ],
  // Or referenced example (requires Comment model and route):
  // comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  relatedToolIds: [ // Store slugs of related tools
     { type: String }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update `updatedAt` field on save
ToolSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});


// Avoid recompiling the model if it already exists
module.exports = mongoose.models.Tool || mongoose.model('Tool', ToolSchema);
