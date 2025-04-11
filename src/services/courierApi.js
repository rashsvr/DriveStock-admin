import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
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

// Response interceptor (inspired by api.js)
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
      window.location.href = '/login';
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

// Inspired utilities
const isAuthenticated = () => !!localStorage.getItem('token');
const handleApiError = (error) => {
  console.error('API Error:', error.message || error);
  throw error;
};
const apiRequest = async (requestFn) => {
  try {
    return await requestFn();
  } catch (error) {
    handleApiError(error);
  }
};

// Courier Order Management
export const getAssignedOrders = async ({ page = 1, limit = 10 }) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view assigned orders', code: 401, isBigError: false };
  const response = await apiClient.get('/courier/orders', { params: { page, limit } });
  return response.data;
};

export const updateOrderStatus = async (orderId, { status }) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to update order status', code: 401, isBigError: false };
  const response = await apiClient.put(`/courier/orders/${orderId}/status`, { status });
  return response.data;
};

export default {
  getAssignedOrders: (params) => apiRequest(() => getAssignedOrders(params)),
  updateOrderStatus: (orderId, statusData) => apiRequest(() => updateOrderStatus(orderId, statusData)),
};