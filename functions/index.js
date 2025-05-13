
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const connectDB = require('./db'); // Import the DB connection function

// --- Connect to MongoDB ---
// Call connectDB here to establish the connection when the function instance starts.
// It now returns a promise that resolves to 'yes' or 'no'.
connectDB().then(status => {
  console.log(`Initial MongoDB connection attempt. Reported Status: ${status}`);
  if (status === 'no' && process.env.NODE_ENV !== 'development') { // Stricter check for production
    // Consider if you want to prevent function deployment or throw a fatal error for production
    // For now, it just logs, but the function might still deploy and fail at runtime.
    console.error('\x1b[31m%s\x1b[0m', 'CRITICAL: MongoDB connection failed during initialization. API might not function correctly.');
  }
}).catch(error => {
    console.error("Error during initial DB connection setup in index.js:", error);
});
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
app.use('/api/tools', require('./routes/tools'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/comments', require('./routes/comments')); // Mount the comments route
app.use('/api/seed', require('./routes/seed')); // Mount the seed route

// --- Basic Test Route ---
app.get('/api/hello', (req, res) => {
  res.status(200).json({ success: true, data: 'Hello from Toolshub4u Backend API!' });
});

// --- Error Handling Middleware (Optional but Recommended) ---
// Global error handler for unhandled errors in routes
app.use((err, req, res, next) => {
  console.error("Global Error Handler caught an error:", err.stack);
  res.status(500).json({ success: false, data: null, error: 'Something broke on the server!' });
});

// --- Expose Express API as a single Firebase Function ---
// The region can be specified if needed, e.g., functions.region('us-central1')
exports.api = functions.https.onRequest(app);

