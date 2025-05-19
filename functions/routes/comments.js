
const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment'); // Adjust path to your Comment model
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
module.exports = router;
