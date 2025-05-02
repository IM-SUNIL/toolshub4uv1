const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const connectDB = require('./db'); // Import the DB connection function

// --- Connect to MongoDB ---
// Call connectDB here to establish the connection when the function instance starts
connectDB();
// Note: Firebase Cloud Functions can keep connections alive between invocations (warm starts)
// mongoose handles connection pooling internally.

// --- Create Express App ---
const app = express();

// --- Middleware ---
// Enable CORS for all origins (adjust in production for security)
app.use(cors({ origin: true }));
// Enable Express to parse JSON request bodies
app.use(express.json());

// --- API Routes ---
// Example: Mount tool routes under /api/tools
app.use('/api/tools', require('./routes/tools'));
// Example: Mount category routes under /api/categories
app.use('/api/categories', require('./routes/categories'));
// Add other routes (e.g., comments) here
// app.use('/api/comments', require('./routes/comments')); // If using separate comment routes

// --- Basic Test Route ---
app.get('/api/hello', (req, res) => {
  res.status(200).send('Hello from Toolshub4u Backend API!');
});

// --- Error Handling Middleware (Optional but Recommended) ---
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });

// --- Expose Express API as a single Firebase Function ---
// The region can be specified if needed, e.g., functions.region('us-central1')
exports.api = functions.https.onRequest(app);


// --- Keep the GitHub update function IF still needed ---
// If you still need the GitHub JSON update functionality alongside the API,
// keep the original `updateToolJson` export below. Otherwise, remove it.

/*
const { Octokit } = require("@octokit/rest");
const admin = require("firebase-admin"); // Needed if using admin sdk elsewhere

// Helper function to safely get Firebase function config
const getConfig = (key) => {
    // ... (keep original getConfig if needed)
};

const GITHUB_TOKEN = getConfig("token");
// ... (keep other GitHub consts if needed)

const validateToolData = (toolData) => {
    // ... (keep original validateToolData if needed)
};

exports.updateToolJson = functions.https.onRequest(async (req, res) => {
    // ... (keep original GitHub update logic if needed)
    // IMPORTANT: This function will now conflict with the `/api` function
    // if requests are made to the root. You might need to rename this function
    // or adjust routing if keeping both.
    // Example rename: exports.updateGitHubJson = functions.https.onRequest(...)
});
*/
