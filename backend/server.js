require('./config/env'); // must be first

const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { isDev } = require('./config/env');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes.js');
const aiRoutes = require('./routes/aiRoutes');
const copilotRoutes = require('./routes/copilotRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');

if (isDev) {
  console.log('=== Environment Variables (sanitized) ===');
  console.log('PORT:', process.env.PORT || 'not set (default 5000)');
  console.log('MONGO_URI:', process.env.MONGO_URI ? 'set' : 'not set');
  console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'set' : 'not set');
  console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY ? 'set' : 'not set');
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'set' : 'not set');
}

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false, // Disabled for dev flexibility, can be tightened later
}));

// CORS Configuration
app.use(cors({
  origin: "https://ai-powered-resume-builder-wine.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Preflight handling
app.options("*", cors());

app.use(express.json({ limit: '1mb' }));

// Rate Limiting (Strict on Auth, General on others)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { success: false, message: "Too many requests, please try again later." }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // stricter for auth
  message: { success: false, message: "Too many login/signup attempts, please wait 15 minutes." }
});

// Handle malformed JSON bodies cleanly
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON in request body.',
      error: { code: 'INVALID_JSON' },
    });
  }
  return next(err);
});

// Registered Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/ai', generalLimiter, aiRoutes);
app.use('/api/ai', generalLimiter, copilotRoutes);   // Copilot/AI assist
app.use('/api/resume', generalLimiter, resumeRoutes);
app.use('/api/user', generalLimiter, userRoutes);
app.use('/api/profile', generalLimiter, profileRoutes);

// Static folder for file uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log('✅ Profile routes registered at /api/profile');

// Test route - Protected
const { protect } = require('./middleware/authMiddleware');
app.get('/api/test', protect, (req, res) => {
  res.json({
    success: true,
    message: 'Access granted',
    user: req.user,
  });
});

// Health check route - Public
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

const port = parseInt(process.env.PORT, 10) || 5000;
const server = app.listen(port, () => {
  console.log(`✅ [PROD-READY] Server running on port ${port}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${port} is already in use. Stop the other process and restart.`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
    process.exit(1);
  }
});

module.exports = app;
