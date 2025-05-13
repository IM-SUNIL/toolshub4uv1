
const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment'); // Adjust path to your Comment model

// @route   GET /api/comments
// @desc    Get all comments (across all tools, if storing separately)
// @access  Public (or admin-only if desired)
router.get('/', async (req, res) => {
  try {
    // If using embedded comments, this route might not be directly useful unless you want to aggregate all comments.
    // If comments are in a separate collection:
    const comments = await Comment.find().sort({ timestamp: -1 });
    res.json({ success: true, data: comments, error: null });
  } catch (err) {
    console.error("Error fetching all comments:", err.message);
    res.status(500).json({ success: false, data: null, error: 'Server Error while fetching all comments.' });
  }
});

// @route   POST /api/comments (Example if comments are in a separate collection)
// @desc    Add a new comment to a specific tool (using Comment model)
// @access  Public (consider auth)
// router.post('/', async (req, res) => {
//     const { toolId, name, comment } = req.body; // toolId here would be the slug or _id of the tool

//     if (!toolId || !name || !comment) {
//         return res.status(400).json({ success: false, data: null, error: 'Tool ID, name, and comment are required.' });
//     }

//     try {
//         // Optional: Check if the tool exists before adding a comment
//         // const tool = await Tool.findOne({ slug: toolId }); // Or Tool.findById(toolId)
//         // if (!tool) {
//         //     return res.status(404).json({ success: false, data: null, error: 'Tool not found.' });
//         // }

//         const newComment = new Comment({
//             toolId, // Store slug or _id
//             name,
//             comment,
//             timestamp: new Date()
//         });

//         await newComment.save();
//         res.status(201).json({ success: true, data: newComment, error: null });

//     } catch (err) {
//         console.error("Error adding comment via /api/comments:", err.message);
//         if (err.name === 'ValidationError') {
//             const messages = Object.values(err.errors).map(val => val.message);
//             return res.status(400).json({ success: false, data: null, error: `Validation Error: ${messages.join(', ')}` });
//         }
//         res.status(500).json({ success: false, data: null, error: 'Server Error while adding comment.' });
//     }
// });


// Note: The routes for adding/getting comments for a specific tool are currently in `tools.js`
// because comments are embedded in the Tool schema. If you change to a separate Comment collection,
// you would implement GET /api/comments/:toolId and POST /api/comments here or adjust accordingly.

module.exports = router;
