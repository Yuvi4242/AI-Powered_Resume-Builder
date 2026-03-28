const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

// Load environment variables exactly once, as early as possible.
// This prevents "undefined secret" JWT signing and inconsistent config.
const envPath = path.join(__dirname, '..', '.env');

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const nodeEnv = process.env.NODE_ENV || 'development';

const isProd = nodeEnv === 'production';
const isDev = !isProd;

module.exports = {
  nodeEnv,
  isProd,
  isDev,
};

