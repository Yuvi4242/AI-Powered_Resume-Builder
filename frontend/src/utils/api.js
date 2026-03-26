import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/';

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
  signupOTP: (data) => api.post('auth/signup-otp', data),
  signupVerify: (data) => api.post('auth/signup-verify', data),
  
  // Password-based login
  login: (credentials) => api.post('auth/login', credentials),
  
  // Forgot password
  forgotPassword: (data) => api.post('auth/forgot-password', data),
  verifyResetOTP: (data) => api.post('auth/verify-reset-otp', data),
  resetPassword: (data) => api.post('auth/reset-password', data),
};
// AI-Powered Resume API (new endpoint names)
export const resumeAI = {
  getSummary:  (profileData)                  => api.post('resume/ai-summary',     { profileData }),
  getSkills:   (role)                         => api.post('resume/ai-skills',      { role }),
  optimizeJD:  (bulletPoints, jobDescription) => api.post('resume/ai-antigravity', { bulletPoints, jobDescription }),
};

// Legacy aiAPI alias — keeps AIToolsDashboard.js and ResumeBuilder.js working
export const aiAPI = {
  generateSummary:     (data) => api.post('resume/ai-summary',     { profileData: data }),
  checkATSScore:       (data) => api.post('resume/ai-skills',      { role: data.resumeText?.split(' ').slice(0, 5).join(' ') || 'Software Engineer' }),
  generateBulletPoints:(data) => api.post('resume/ai-antigravity', { bulletPoints: [data.jobTitle || ''], jobDescription: data.jobTitle || '' }),
  suggestSkills:       (data) => api.post('resume/ai-skills',      { role: data.role }),
};

// Resume Copilot API
export const copilotAPI = {
  chat:            (message)                => api.post('ai/chat',             { message }),
  fillProfile:     (text)                   => api.post('ai/fill-profile',      { text }),
  generateSummary: (role, skills, exp)      => api.post('ai/generate-summary',  { role, skills, experience: exp }),
  improveResume:   (resumeData, jobDesc)    => api.post('ai/improve-resume',    { resumeData, jobDescription: jobDesc }),
};

// Resume API
export const resumeAPI = {
  saveResume: (data) => api.post('resume/save', data),
  getResumes: () => api.get('resume/all'),
  deleteResume: (id) => api.delete(`resume/${id}`),
  updateResume: (id, data) => api.put(`resume/${id}`, data),
};

// Profile API
export const profileAPI = {
  getProfile: () => api.get('profile/me'),
  updateProfile: (data) => api.put('profile/update', data),
  uploadProfilePhoto: (formData) => api.post('profile/upload-photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
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
