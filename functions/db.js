
const mongoose = require('mongoose');
const functions = require('firebase-functions');
require('dotenv').config(); // Load .env file for local development

// --- MongoDB Connection URI ---
// Priority:
// 1. Environment Variable: MONGODB_URI (Recommended for local and deployment secrets)
// 2. Firebase Function Config: functions.config().mongodb.uri (Legacy method)

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
       console.log("Firebase mongodb.uri config not found either.");
       // To prevent accidental usage of a placeholder if nothing is set:
       // console.log("Using default placeholder for MongoDB URI (NOT FOR PRODUCTION).");
       // mongoUri = DEFAULT_MONGO_URI_PLACEHOLDER;
    }
  } catch (error) {
    // functions.config() might not be available in all environments (e.g., some local setups without emulation)
    console.log("Firebase config not accessible (may be running locally without emulator or config set).");
    // console.log("Using default placeholder for MongoDB URI (NOT FOR PRODUCTION).");
    // mongoUri = DEFAULT_MONGO_URI_PLACEHOLDER;
  }
} else {
    console.log("Using MongoDB URI from environment variable.");
}


// Validate if a URI was found
if (!mongoUri) {
  console.error('\x1b[31m%s\x1b[0m', 'ERROR: MongoDB connection string not found. Connection Status: No');
  console.error('Please set the MONGODB_URI environment variable in functions/.env or Firebase functions config (mongodb.uri).');
  console.error('Example for functions/.env: MONGODB_URI="mongodb+srv://YOUR_USER:YOUR_ENCODED_PASSWORD@YOUR_CLUSTER.mongodb.net/YOUR_DB_NAME?retryWrites=true&w=majority"');
} else if (mongoUri === DEFAULT_MONGO_URI_PLACEHOLDER && process.env.NODE_ENV !== 'development') {
    console.warn('\x1b[33m%s\x1b[0m', 'WARNING: Using default placeholder MongoDB URI in a non-development environment. This is INSECURE. Connection Status: No (Potentially)');
}


const connectDB = async () => {
  if (!mongoUri) {
    console.error('MongoDB URI is not defined. Cannot connect. Connection Status: No');
    return 'no'; // Explicitly return 'no'
  }

  try {
    // Check connection state before attempting to connect
    // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
    if (mongoose.connection.readyState === 0) {
        console.log('Attempting to connect to MongoDB...');
        // useNewUrlParser and useUnifiedTopology are deprecated and no longer needed in Mongoose 6+
        await mongoose.connect(mongoUri);
        console.log('\x1b[32m%s\x1b[0m', 'MongoDB Connected Successfully. Connection Status: Yes');
        return 'yes'; // Explicitly return 'yes'
    } else if (mongoose.connection.readyState === 1) {
        console.log('MongoDB is already connected. Connection Status: Yes');
        return 'yes'; // Explicitly return 'yes'
    } else {
        console.log(`MongoDB connection state: ${mongoose.connection.readyState}. Potentially an issue. Connection Status: No (unexpected state)`);
        return 'no'; // Explicitly return 'no' for unexpected states
    }
  } catch (err) {
    console.error('\x1b[31m%s\x1b[0m', 'MongoDB connection error. Connection Status: No');
    console.error(err.message);
    // Exit process with failure in a real application if DB connection is critical for startup
    // process.exit(1); // Consider if this is appropriate for your Cloud Function lifecycle
    return 'no'; // Explicitly return 'no'
  }
};

// Handle connection events (optional but recommended for logging)
mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Connection Status: No (post-connection)');
});
mongoose.connection.on('reconnected', () => {
  console.info('MongoDB reconnected. Connection Status: Yes (post-connection)');
});
mongoose.connection.on('error', (err) => { // Catch ongoing errors after initial connection
  console.error('\x1b[31m%s\x1b[0m', 'MongoDB connection error (event listener). Connection Status: No');
  console.error(err.message);
});


module.exports = connectDB;
