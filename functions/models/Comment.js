// functions/models/Comment.js
// This model is needed if you choose to store comments in a separate collection
// instead of embedding them within the Tool model.

const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  toolId: { // Reference to the Tool the comment belongs to (using slug or _id)
    type: String, // Or mongoose.Schema.Types.ObjectId if referencing _id
    ref: 'Tool',
    required: true,
    index: true, // Index for faster querying by toolId
  },
  name: {
    type: String,
    required: [true, 'Name is required.'],
    trim: true,
  },
  comment: {
    type: String,
    required: [true, 'Comment text is required.'],
    trim: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  // Optional: Add fields like 'approved', 'userId', etc.
});

// Avoid recompiling the model if it already exists
module.exports = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
