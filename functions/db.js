const mongoose = require('mongoose');
const functions = require('firebase-functions');

// Try getting the MongoDB URI from Firebase config first, then fallback to .env
// For deployment: firebase functions:config:set mongodb.uri="mongodb+srv://..."
// For local (.env): MONGODB_URI="mongodb+srv://..."
let mongoUri;
try {
  mongoUri = functions.config().mongodb.uri;
  if (!mongoUri) {
     console.log("Firebase mongodb.uri config not set, trying .env file...");
     require('dotenv').config(); // Load .env if Firebase config is missing
     mongoUri = process.env.MONGODB_URI;
  }
} catch (error) {
    console.log("Firebase config not available (likely local development), trying .env file...");
    require('dotenv').config(); // Load .env if Firebase config access fails
    mongoUri = process.env.MONGODB_URI;
}


if (!mongoUri) {
  console.error('ERROR: MongoDB connection string not found. Set MONGODB_URI in .env file or Firebase config (mongodb.uri)');
  // Optionally exit or handle appropriately
  // process.exit(1); // Uncomment to exit if URI is critical and missing
}

const connectDB = async () => {
  if (!mongoUri) {
    console.error('MongoDB URI is not defined. Cannot connect.');
    return; // Prevent connection attempt if URI is missing
  }
  try {
    // Check connection state before attempting to connect
    if (mongoose.connection.readyState === 0) { // 0 = disconnected
        await mongoose.connect(mongoUri);
        console.log('MongoDB Connected...');
    } else {
        console.log('MongoDB already connected.');
    }
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // Exit process with failure in a real application if DB connection is critical
    // process.exit(1);
  }
};

module.exports = connectDB;
