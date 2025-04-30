const admin = require('../config/firebaseAdmin');

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken; // Add user info (uid, email etc.) to request
      next();
    } catch (error) {
      console.error('Error verifying auth token:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };