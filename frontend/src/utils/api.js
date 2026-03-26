import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

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

// Auth API
export const authAPI = {
  // OTP-based signup
  signupOTP: (data) => api.post('/auth/signup-otp', data),
  signupVerify: (data) => api.post('/auth/signup-verify', data),
  
  // Password-based login
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Phone-based login (OTP)
  loginOTP: (data) => api.post('/auth/login-otp', data),
  loginVerify: (data) => api.post('/auth/login-verify', data),
  
  // Forgot password
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  verifyResetOTP: (data) => api.post('/auth/verify-reset-otp', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

// AI API
export const aiAPI = {
  generateSummary: (data) => api.post('/ai/summary', { data }),
  generateBulletPoints: (data) => api.post('/ai/bullet-points', { data }),
  checkATSScore: (data) => api.post('/ai/ats', { data }),
  suggestSkills: (data) => api.post('/ai/skills', { data }),
};

// Resume API
export const resumeAPI = {
  saveResume: (data) => api.post('/resume/save', data),
  getResumes: () => api.get('/resume/all'),
  deleteResume: (id) => api.delete(`/resume/${id}`),
  updateResume: (id, data) => api.put(`/resume/${id}`, data),
};

// Helper to get token
export const getToken = () => localStorage.getItem('token');

// Helper to set token
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Helper to remove token
export const removeToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export default api;
