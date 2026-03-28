import axios from 'axios';

// In production, prefer relative "/api/" (same origin).
// In development, allow override via REACT_APP_API_BASE_URL.
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  (window?.location?.hostname ? `${window.location.protocol}//${window.location.hostname}:5000/api/` : 'http://localhost:5000/api/');

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Token management
export const setToken = (token) => {
  if (token) localStorage.setItem('token', token);
  else localStorage.removeItem('token');
};

export const removeToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Auth API
 */
export const authAPI = {
  signupOTP: (data) => api.post('auth/signup-otp', data),
  signupVerify: (data) => api.post('auth/signup-verify', data),
  login: (credentials) => api.post('auth/login', credentials),
  forgotPassword: (data) => api.post('auth/forgot-password', data),
  verifyResetOTP: (data) => api.post('auth/verify-reset-otp', data),
  resetPassword: (data) => api.post('auth/reset-password', data),
};

/**
 * Unified AI API - Standardized for all Tools
 * Every method returns data in the shape: { success, message, data: { content }, meta }
 */
export const aiAPI = {
  // Generic caller
  generate: (action, data) => api.post('ai/generate', { action, ...data }),

  // Summary Tools
  generateSummary: (data) => api.post('ai/summary/generate', data),
  improveSummary:  (data) => api.post('ai/summary/improve', data),

  // Experience Tools
  generateBullets: (data) => api.post('ai/experience/generate', data),
  improveExperience: (data) => api.post('ai/experience/improve', data),

  // Project Tools
  generateProject: (data) => api.post('ai/generate', { action: 'project', ...data }),

  // Skills Tools
  suggestSkills: (data) => api.post('ai/skills/suggest', data),

  // Text Tools
  processText: (text, type) => api.post('ai/text-tool', { text, type }),
  rewrite:     (text)       => api.post('ai/text/rewrite', { text }),
  fixGrammar:  (text)       => api.post('ai/text/grammar-fix', { text }),

  // Optimization
  optimizeForJD: (resumeData, jobDescription) => api.post('ai/optimize', { resumeData, jobDescription }),
  checkATS:      (resumeText)                 => api.post('ai/ats', { resumeText }),

  // Legacy/Compatibility Layer (kept to avoid immediate breakage in other components)
  generateBulletPoints: (data) => api.post('ai/bullet-points', { data }),
};

/**
 * Resume Copilot API (Chat-specific)
 */
export const copilotAPI = {
  chat:            (message, resumeData = {}, history = []) => api.post('ai/chat', { message, resumeData, history }),
  fillProfile:     (text)    => api.post('ai/fill-profile', { text }),
  improveResume:   (resumeData, jobDescription = '') => api.post('ai/improve-resume', { resumeData, jobDescription }),
};

/**
 * Resume CRUD API
 */
export const resumeAPI = {
  saveResume: (data) => api.post('resume/save', data),
  getResumes: () => api.get('resume/all'),
  deleteResume: (id) => api.delete(`resume/${id}`),
  updateResume: (id, data) => api.put(`resume/${id}`, data),
};

/**
 * Profile API
 */
export const profileAPI = {
  getProfile: () => api.get('profile/me'),
  updateProfile: (data) => api.put('profile/update', data),
  uploadProfilePhoto: (formData) => api.post('profile/upload-photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// Legacy Compatibility Aliases
export const resumeAI = aiAPI;

export default api;
