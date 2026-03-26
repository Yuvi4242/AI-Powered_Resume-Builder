const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables immediately
dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const copilotRoutes = require('./routes/copilotRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const userRoutes = require('./routes/userRoutes');
const { sendTestEmail } = require('./services/emailService');

console.log('=== Environment Variables ===');
console.log('PORT:', process.env.PORT || 'not set (default 5000)');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'set' : 'not set');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'set' : 'not set');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'set' : 'not set');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'set - ' + process.env.GEMINI_API_KEY.substring(0, 10) + '...' : 'not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'set' : 'not set');

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route - send test email
app.get('/api/test-email', async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Please provide email query param' });
  }
  console.log('\n=== TEST EMAIL ROUTE ===');
  const result = await sendTestEmail(email);
  res.json(result);
});

// Test route - Gemini API (no auth)
app.get('/api/test-gemini', async (req, res) => {
  try {
    const { generateSummary } = require('./services/aiService');
    console.log('\n=== TEST GEMINI API ===');
    const summary = await generateSummary({ 
      name: 'Test User', 
      skills: 'React, Node.js', 
      experience: 'Built web apps for 3 years',
      projects: 'AI Resume Builder'
    });
    res.json({ success: true, summary });
  } catch (error) {
    console.error('Gemini Test Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

const profileRoutes = require('./routes/profileRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/ai', copilotRoutes);   // Copilot: /chat, /fill-profile, /generate-summary, /improve-resume
app.use('/api/resume', resumeRoutes);
app.use('/api/user', userRoutes);
app.use('/api/profile', profileRoutes);

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

// Start server with dynamic port handling
const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️  Port ${port} is busy, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('❌ Server error:', err);
    }
  });
};

// Start server
const initialPort = parseInt(process.env.PORT) || 5000;
startServer(initialPort);

module.exports = app;
