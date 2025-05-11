
const mongoose = require('mongoose');
const functions = require('firebase-functions');
require('dotenv').config(); // Load .env file for local development

// --- MongoDB Connection URI ---
// Priority:
// 1. Environment Variable: MONGODB_URI (Recommended for local and deployment secrets)
//    - Local: Set in functions/.env file (e.g., MONGODB_URI="mongodb+srv://imrajputsunil:Rajput%40689@cluster0.fnzdt.mongodb.net/toolshub4u_db?retryWrites=true&w=majority")
//    - Deployment: Set using `firebase functions:config:set mongodb.uri="YOUR_FULL_CONNECTION_STRING"` OR set as runtime environment variable in GCP.
// 2. Firebase Function Config: functions.config().mongodb.uri (Legacy method)

// It's highly recommended to use environment variables for sensitive data like connection strings.
// The string below is a placeholder and should be replaced with your actual connection string,
// preferably loaded from an environment variable as shown above.
// Ensure special characters in your password (like '@') are URL-encoded (e.g., Rajput%40689).
// Also, specify your database name in the URI (e.g., /yourDatabaseName?retryWrites=true...).
const DEFAULT_MONGO_URI_PLACEHOLDER = "mongodb+srv://imrajputsunil:Rajput%40689@cluster0.fnzdt.mongodb.net/toolshub4u_db?retryWrites=true&w=majority";

let mongoUri = process.env.MONGODB_URI; // Get from environment variable first

if (!mongoUri) {
  console.log("MONGODB_URI environment variable not set, trying Firebase config...");
  try {
    // Fallback to Firebase config if environment variable is not set
    if (functions.config().mongodb && functions.config().mongodb.uri) {
      mongoUri = functions.config().mongodb.uri;
      console.log("Using MongoDB URI from Firebase config.");
    } else {
       console.log("Firebase mongodb.uri config not found either. Using default placeholder (NOT FOR PRODUCTION).");
       // mongoUri = DEFAULT_MONGO_URI_PLACEHOLDER; // Fallback to placeholder for local dev if nothing else is set
    }
  } catch (error) {
    // functions.config() might not be available in all environments (e.g., some local setups without emulation)
    console.log("Firebase config not accessible (may be running locally without emulator or config set). Using default placeholder (NOT FOR PRODUCTION).");
    // mongoUri = DEFAULT_MONGO_URI_PLACEHOLDER; // Fallback to placeholder for local dev if nothing else is set
  }
} else {
    console.log("Using MongoDB URI from environment variable.");
}


// Validate if a URI was found
if (!mongoUri) {
  console.error('\x1b[31m%s\x1b[0m', 'ERROR: MongoDB connection string not found.'); // Red error text
  console.error('Please set the MONGODB_URI environment variable.');
  console.error('For local development, add MONGODB_URI="mongodb+srv://imrajputsunil:YOUR_URL_ENCODED_PASSWORD@cluster0.fnzdt.mongodb.net/YOUR_DB_NAME?retryWrites=true&w=majority" to the functions/.env file.');
  console.error('Replace YOUR_URL_ENCODED_PASSWORD (e.g., Rajput%40689 if password is Rajput@689) and YOUR_DB_NAME.');
  console.error('For deployment, set the secret using `firebase functions:config:set mongodb.uri="YOUR_FULL_CONNECTION_STRING"` or use GCP Secret Manager.');
  // Optional: Exit if connection is critical, but might prevent emulator startup
  // process.exit(1);
} else if (mongoUri === DEFAULT_MONGO_URI_PLACEHOLDER && process.env.NODE_ENV !== 'development') {
    console.warn('\x1b[33m%s\x1b[0m', 'WARNING: Using default placeholder MongoDB URI in a non-development environment. This is INSECURE and NOT for production.');
}


const connectDB = async () => {
  // Double-check URI presence before attempting connection
  if (!mongoUri) {
    console.error('MongoDB URI is not defined. Cannot connect.');
    // Prevent Mongoose from throwing 'Missing connection string' later
    // which might hide the earlier, more informative error.
    return;
  }

  try {
    // Check connection state before attempting to connect
    // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
    if (mongoose.connection.readyState === 0) {
        console.log('Attempting to connect to MongoDB...');
        // useNewUrlParser and useUnifiedTopology are deprecated and no longer needed
        await mongoose.connect(mongoUri);
        console.log('\x1b[32m%s\x1b[0m', 'MongoDB Connected Successfully.'); // Green success text
    } else if (mongoose.connection.readyState === 1) {
        console.log('MongoDB is already connected.');
    } else {
        console.log(`MongoDB connection state: ${mongoose.connection.readyState}`);
    }
  } catch (err) {
    console.error('\x1b[31m%s\x1b[0m', 'MongoDB connection error:'); // Red error text
    console.error(err.message);
    // Exit process with failure in a real application if DB connection is critical
    // process.exit(1);
  }
};

// Handle connection events (optional but recommended for logging)
mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected.');
});
mongoose.connection.on('reconnected', () => {
  console.info('MongoDB reconnected.');
});
mongoose.connection.on('error', (err) => { // Catch ongoing errors after initial connection
  console.error('\x1b[31m%s\x1b[0m', 'MongoDB connection error (post-initial connection):');
  console.error(err.message);
});


module.exports = connectDB;
