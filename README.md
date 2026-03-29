# AI-Powered Resume Builder 🚀

A premium, production-ready MERN stack application designed to help professionals craft high-impact, ATS-optimized resumes using advanced AI intelligence.

![Landing Preview](https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1470&auto=format&fit=crop)

> [!NOTE]
> **Demo Environment**: Email OTP is currently running in sandbox/testing mode. For demonstration purposes, OTP emails are enabled only for the configured demo email address.

## ✨ Features

- **Next-Gen AI Engine**: Context-aware resume generation and optimization.
- **Real-Time ATS Scoring**: Deep scan analysis to ensure your resume beats automated filters (98%+ success rate).
- **Premium SaaS UI**: Modern, glassmorphic design system built with Tailwind CSS and Framer Motion.
- **Silent Auto-Save**: Never lose progress with debounced cloud and local storage synchronization.
- **Pixel-Perfect Export**: Professional A4 PDF generation and high-definition image exports.
- **AI Copilot**: Integrated chatbot assistant for real-time career coaching and content rewriting.
- **Secure Authentication**: JWT-based auth with rate-limiting and security headers (Helmet.js).

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, Tailwind CSS, Framer Motion, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Atlas) |
| **AI** | Gemini / Groq API Integration |
| **Security** | JWT, Helmet.js, Express-Rate-Limit |
| **Deployment** | Vercel (Frontend), Railway/Render (Backend) |

## 🚀 Local Deployment

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- AI API Key (Gemini or Groq)

### 2. Backend Setup
```bash
cd backend
npm install
# Create .env file based on .env.example
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🌍 Production Deployment Guide

### Frontend (Vercel/Netlify)
1. Connect your GitHub repository.
2. Set Build Command: `npm run build`.
3. Set Output Directory: `dist`.
4. Configure Environment Variables:
   - REACT_APP_API_URL=http://localhost:5000
### Backend (Railway/Render/Heroku)
1. Connect your GitHub repository.
2. Configure Environment Variables:
   - `MONGO_URI`: Your production MongoDB connection string.
   - `JWT_SECRET`: A secure random string.
   - `GROQ_API_KEY`: Your AI service key.
   - `NODE_ENV`: `production`.
3. Start Command: `node server.js`.

## 🛡️ Security Measures
- **Rate-Limiting**: Prevents brute-force attacks on auth and heavy AI routes.
- **Helmet**: Adds 15+ security headers to protect against common web vulnerabilities.
- **CORS Protection**: Restricted to authorized production domains.
- **Input Sanitization**: Standardized JSON body parsing and error handling.

## 📁 Project Structure
```text
├── backend/
│   ├── config/         # Database and Passport config
│   ├── controllers/    # API logic
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routes
│   └── server.js       # Entry point
└── frontend/           # React application
    ├── src/
    │   ├── components/  # UI and shared components
    │   ├── context/     # Global state (Toast, Search)
    │   ├── pages/       # Route-based views
    │   └── utils/       # API services and helpers
```

---

Built with ❤️ for high-performance career growth.
