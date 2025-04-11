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

// Seller Product Management
export const createProduct = async ({
  title,
  description,
  price,
  category,
  stock,
  condition,
  brand,
  oem,
  aftermarket,
  material,
  makeModel,
  years,
  images,
}) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to create a product', code: 401, isBigError: false };
  const response = await apiClient.post('/seller/products', {
    title,
    description,
    price,
    category,
    stock,
    condition,
    brand,
    oem,
    aftermarket,
    material,
    makeModel,
    years,
    images,
  });
  return response.data;
};

export const getSellerProducts = async ({ page = 1, limit = 10 }) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view products', code: 401, isBigError: false };
  const response = await apiClient.get('/seller/products', { params: { page, limit } });
  return response.data;
};

export const updateProduct = async (productId, { price, stock, description }) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to update a product', code: 401, isBigError: false };
  const response = await apiClient.put(`/seller/products/${productId}`, { price, stock, description });
  return response.data;
};

export const deleteProduct = async (productId) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to delete a product', code: 401, isBigError: false };
  const response = await apiClient.delete(`/seller/products/${productId}`);
  return response.data;
};

// Seller Order Management
export const getSellerOrders = async ({ page = 1, limit = 10 }) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view orders', code: 401, isBigError: false };
  const response = await apiClient.get('/seller/orders', { params: { page, limit } });
  return response.data;
};

export const getOrderById = async (orderId) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view an order', code: 401, isBigError: false };
  const response = await apiClient.get(`/seller/order/${orderId}`);
  return response.data;
};

export const updateOrderStatus = async (orderId, { status }) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to update order status', code: 401, isBigError: false };
  const response = await apiClient.put(`/seller/order/${orderId}/status`, { status });
  return response.data;
};

export const cancelOrder = async (orderId) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to cancel an order', code: 401, isBigError: false };
  const response = await apiClient.post(`/seller/order/cancel/${orderId}`);
  return response.data;
};

export default {
  createProduct: (productData) => apiRequest(() => createProduct(productData)),
  getSellerProducts: (params) => apiRequest(() => getSellerProducts(params)),
  updateProduct: (productId, productData) => apiRequest(() => updateProduct(productId, productData)),
  deleteProduct: (productId) => apiRequest(() => deleteProduct(productId)),
  getSellerOrders: (params) => apiRequest(() => getSellerOrders(params)),
  getOrderById: (orderId) => apiRequest(() => getOrderById(orderId)),
  updateOrderStatus: (orderId, statusData) => apiRequest(() => updateOrderStatus(orderId, statusData)),
  cancelOrder: (orderId) => apiRequest(() => cancelOrder(orderId)),
};