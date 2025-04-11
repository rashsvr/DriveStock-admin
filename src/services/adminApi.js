import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request headers:', config.headers); // Debug log
    return config;
  },
  (error) => Promise.reject(error)
);

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
      message = error.response?.data?.message || 'Session expired. Please log in again.';
      code = 401;
      // Only clear token and redirect if explicitly unauthorized
      if (error.response?.data?.message === 'No token, authorization denied' || 
          error.response?.data?.message === 'Token is not valid') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
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

    console.error('API Response Error:', { status, message, error }); // Debug log
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

// Admin Management
export const getAllAdmins = async () => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view admins', code: 401, isBigError: false };
  const response = await apiClient.get('/admin/admins');
  return response.data;
};

export const createAdmin = async ({ email, password, name, phone }) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to create an admin', code: 401, isBigError: false };
  const response = await apiClient.post('/admin/admins', { email, password, name, phone });
  return response.data;
};

export const deleteAdmin = async (adminId) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to delete an admin', code: 401, isBigError: false };
  const response = await apiClient.delete(`/admin/admins/${adminId}`);
  return response.data;
};

// Courier Management
export const getAllCouriers = async () => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view couriers', code: 401, isBigError: false };
  const response = await apiClient.get('/admin/couriers');
  return response.data;
};

export const createCourier = async ({ email, password, name, phone, region }) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to create a courier', code: 401, isBigError: false };
  const response = await apiClient.post('/admin/couriers', { email, password, name, phone, region });
  return response.data;
};

export const updateCourier = async (courierId, { email, name, phone, region }) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to update a courier', code: 401, isBigError: false };
  const response = await apiClient.put(`/admin/couriers/${courierId}`, { email, name, phone, region });
  return response.data;
};

export const deleteCourier = async (courierId) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to delete a courier', code: 401, isBigError: false };
  const response = await apiClient.delete(`/admin/couriers/${courierId}`);
  return response.data;
};

// Seller Management
export const getPendingSellers = async () => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view pending sellers', code: 401, isBigError: false };
  const response = await apiClient.get('/admin/sellers/pending');
  return response.data;
};

export const getAllSellers = async () => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view sellers', code: 401, isBigError: false };
  const response = await apiClient.get('/admin/sellers');
  return response.data;
};

export const approveSeller = async (sellerId) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to approve a seller', code: 401, isBigError: false };
  const response = await apiClient.put(`/admin/sellers/${sellerId}`);
  return response.data;
};

export const deleteSeller = async (sellerId) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to delete a seller', code: 401, isBigError: false };
  const response = await apiClient.delete(`/admin/sellers/${sellerId}`);
  return response.data;
};

// Buyer Management
export const getAllBuyers = async () => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view buyers', code: 401, isBigError: false };
  const response = await apiClient.get('/admin/buyers');
  return response.data;
};

export const deleteBuyer = async (buyerId) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to delete a buyer', code: 401, isBigError: false };
  const response = await apiClient.delete(`/admin/buyers/${buyerId}`);
  return response.data;
};

// Category Management
export const getAllCategories = async () => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view categories', code: 401, isBigError: false };
  const response = await apiClient.get('/admin/categories');
  return response.data;
};

export const createCategory = async ({ name, parentCategory }) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to create a category', code: 401, isBigError: false };
  const response = await apiClient.post('/admin/categories', { name, parentCategory });
  return response.data;
};

export const updateCategory = async (categoryId, { name, parentCategory }) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to update a category', code: 401, isBigError: false };
  const response = await apiClient.put(`/admin/categories/${categoryId}`, { name, parentCategory });
  return response.data;
};

export const deleteCategory = async (categoryId) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to delete a category', code: 401, isBigError: false };
  const response = await apiClient.delete(`/admin/categories/${categoryId}`);
  return response.data;
};

export default {
  getAllAdmins: () => apiRequest(() => getAllAdmins()),
  createAdmin: (adminData) => apiRequest(() => createAdmin(adminData)),
  deleteAdmin: (adminId) => apiRequest(() => deleteAdmin(adminId)),
  getAllCouriers: () => apiRequest(() => getAllCouriers()),
  createCourier: (courierData) => apiRequest(() => createCourier(courierData)),
  updateCourier: (courierId, courierData) => apiRequest(() => updateCourier(courierId, courierData)),
  deleteCourier: (courierId) => apiRequest(() => deleteCourier(courierId)),
  getPendingSellers: () => apiRequest(() => getPendingSellers()),
  getAllSellers: () => apiRequest(() => getAllSellers()),
  approveSeller: (sellerId) => apiRequest(() => approveSeller(sellerId)),
  deleteSeller: (sellerId) => apiRequest(() => deleteSeller(sellerId)),
  getAllBuyers: () => apiRequest(() => getAllBuyers()),
  deleteBuyer: (buyerId) => apiRequest(() => deleteBuyer(buyerId)),
  getAllCategories: () => apiRequest(() => getAllCategories()),
  createCategory: (categoryData) => apiRequest(() => createCategory(categoryData)),
  updateCategory: (categoryId, categoryData) => apiRequest(() => updateCategory(categoryId, categoryData)),
  deleteCategory: (categoryId) => apiRequest(() => deleteCategory(categoryId)),
};