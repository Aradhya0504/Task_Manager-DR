const jwt = require('jsonwebtoken');
const env = require('../config/env');

// In-memory set to store logged-out tokens
const blacklistedTokens = new Set();

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  if (blacklistedTokens.has(token)) {
    return res.status(401).json({ message: 'Token has been invalidated. Please log in again.' });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.userId = decoded.userId;
    req.token = token;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const invalidateToken = (token) => {
  blacklistedTokens.add(token);
};

module.exports = { authenticate, invalidateToken };
