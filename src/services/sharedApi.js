import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; // Default for admin/seller/courier

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling (inspired by api.js)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    let message = 'An unexpected error occurred';
    let code = 500;
    let isBigError = false;

    if (!navigator.onLine) {
      message = 'No internet connection. Please check your network.';
      code = 0;
      isBigError = true;
    } else if (status === 400 && !error.response?.data?.message) {
      message = 'Bad request. Something went wrong with the system.';
      code = 400;
      isBigError = true;
    } else if (status === 500) {
      message = 'Internal server error. Please try again later.';
      code = 500;
      isBigError = true;
    } else if (status === 400) {
      message = error.response?.data?.message || 'Invalid request. Please check your input.';
      code = 400;
    } else if (status === 401) {
      message = error.response?.data?.message || 'Invalid credentials. Please try again.';
      code = 401;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login'; // Auto-redirect inspired by api.js
    } else if (status === 403) {
      message = error.response?.data?.message || 'Access denied. Insufficient permissions.';
      code = 403;
    } else if (status === 404) {
      message = error.response?.data?.message || 'Resource not found.';
      code = 404;
    } else if (status === 409) {
      message = error.response?.data?.message || 'Resource conflict.';
      code = 409;
    }

    throw { message, code, isBigError, originalError: error };
  }
);

// Inspired from api.js
export const isAuthenticated = () => !!localStorage.getItem('token');

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// Centralized error handling utility
const handleApiError = (error) => {
  console.error('API Error:', error.message || error);
  throw error;
};

// Wrap requests (inspired by api.js)
const apiRequest = async (requestFn) => {
  try {
    return await requestFn();
  } catch (error) {
    handleApiError(error);
  }
};

// Shared Authentication
export const login = async ({ email, password }) => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
};

export const register = async ({ email, password, role, name, phone }) => {
  const response = await apiClient.post('/auth/register', { email, password, role, name, phone });
  return response.data;
};

// Shared Media Upload
export const uploadMedia = async (formData) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to upload media', code: 401, isBigError: false };
  const response = await apiClient.post('/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// Shared Profile Management
export const getProfile = async () => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view profile', code: 401, isBigError: false };
  const response = await apiClient.get('/profile');
  return response.data;
};

export const updateProfile = async (profileData) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to update profile', code: 401, isBigError: false };
  const response = await apiClient.put('/profile', profileData);
  return response.data;
};

export const deleteProfile = async () => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to delete profile', code: 401, isBigError: false };
  const response = await apiClient.delete('/profile');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return response.data;
};

export default {
  login: (credentials) => apiRequest(() => login(credentials)),
  register: (userData) => apiRequest(() => register(userData)),
  logout,
  isAuthenticated,
  uploadMedia: (formData) => apiRequest(() => uploadMedia(formData)),
  getProfile: () => apiRequest(() => getProfile()),
  updateProfile: (profileData) => apiRequest(() => updateProfile(profileData)),
  deleteProfile: () => apiRequest(() => deleteProfile()),
};