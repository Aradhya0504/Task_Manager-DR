require('dotenv').config();

const env = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};

// Crash early if critical env variables are missing
if (!env.MONGO_URI) throw new Error('MONGO_URI is not set in .env');
if (!env.JWT_SECRET) throw new Error('JWT_SECRET is not set in .env');

module.exports = env;
