const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const connectDB = require('./db'); // Import the DB connection function

// --- Connect to MongoDB ---
// Call connectDB here to establish the connection when the function instance starts
// It's better to call connectDB within the function exports if the connection string relies on Firebase config,
// or ensure it's called reliably when the instance spins up.
// For simplicity here, we'll call it once. It includes console logs for connection status.
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
app.use('/api/tools', require('./routes/tools'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/seed', require('./routes/seed')); // Mount the seed route

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
