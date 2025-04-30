const admin = require('firebase-admin');
require('dotenv').config();

try {
  const serviceAccount = require('./firebase-service-account.json');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("Firebase Admin SDK Initialized.");
} catch (error) {
  console.error("Error initializing Firebase Admin SDK:", error);
  console.log("Ensure FIREBASE_SERVICE_ACCOUNT_PATH in .env points to your service account key JSON file.");
  process.exit(1);
}

module.exports = admin;