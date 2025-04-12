import apiClient, { isAuthenticated, apiRequest } from './apiClient';

/**
 * Gets all admins
 * @returns {Promise<{ success: boolean, data: Array }>}
 */
export const getAllAdmins = async () => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view admins', code: 401, isBigError: false };
  const response = await apiClient.get('/admin/admins');
  return response.data;
};

/**
 * Creates a new admin
 * @param {{ email: string, password: string, name: string, phone: string }} adminData - Admin details
 * @returns {Promise<{ success: boolean, data: { adminId: string } }>}
 */
export const createAdmin = async ({ email, password, name, phone }) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to create an admin', code: 401, isBigError: false };
  const response = await apiClient.post('/admin/admins', { email, password, name, phone });
  return response.data;
};

/**
 * Deletes an admin
 * @param {string} adminId - Admin ID
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const deleteAdmin = async (adminId) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to delete an admin', code: 401, isBigError: false };
  const response = await apiClient.delete(`/admin/admins/${adminId}`);
  return response.data;
};

/**
 * Gets all couriers
 * @returns {Promise<{ success: boolean, data: Array }>}
 */
export const getAllCouriers = async () => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view couriers', code: 401, isBigError: false };
  const response = await apiClient.get('/admin/couriers');
  return response.data;
};

/**
 * Creates a new courier
 * @param {{ email: string, password: string, name: string, phone: string, region: string }} courierData - Courier details
 * @returns {Promise<{ success: boolean, data: { courierId: string } }>}
 */
export const createCourier = async ({ email, password, name, phone, region }) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to create a courier', code: 401, isBigError: false };
  const response = await apiClient.post('/admin/couriers', { email, password, name, phone, region });
  return response.data;
};

/**
 * Updates a courier
 * @param {string} courierId - Courier ID
 * @param {{ email?: string, name?: string, phone?: string, region?: string }} courierData - Courier details to update
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const updateCourier = async (courierId, { email, name, phone, region }) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to update a courier', code: 401, isBigError: false };
  const response = await apiClient.put(`/admin/couriers/${courierId}`, { email, name, phone, region });
  return response.data;
};

/**
 * Deletes a courier
 * @param {string} courierId - Courier ID
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const deleteCourier = async (courierId) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to delete a courier', code: 401, isBigError: false };
  const response = await apiClient.delete(`/admin/couriers/${courierId}`);
  return response.data;
};

/**
 * Gets pending sellers
 * @returns {Promise<{ success: boolean, data: Array }>}
 */
export const getPendingSellers = async () => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view pending sellers', code: 401, isBigError: false };
  const response = await apiClient.get('/admin/sellers/pending');
  return response.data;
};

/**
 * Gets all sellers
 * @returns {Promise<{ success: boolean, data: Array }>}
 */
export const getAllSellers = async () => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view sellers', code: 401, isBigError: false };
  const response = await apiClient.get('/admin/sellers');
  return response.data;
};

/**
 * Approves a seller
 * @param {string} sellerId - Seller ID
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const approveSeller = async (sellerId) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to approve a seller', code: 401, isBigError: false };
  const response = await apiClient.put(`/admin/sellers/${sellerId}`);
  return response.data;
};

/**
 * Deletes a seller
 * @param {string} sellerId - Seller ID
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const deleteSeller = async (sellerId) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to delete a seller', code: 401, isBigError: false };
  const response = await apiClient.delete(`/admin/sellers/${sellerId}`);
  return response.data;
};

/**
 * Gets all buyers
 * @returns {Promise<{ success: boolean, data: Array }>}
 */
export const getAllBuyers = async () => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view buyers', code: 401, isBigError: false };
  const response = await apiClient.get('/admin/buyers');
  return response.data;
};

/**
 * Deletes a buyer
 * @param {string} buyerId - Buyer ID
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const deleteBuyer = async (buyerId) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to delete a buyer', code: 401, isBigError: false };
  const response = await apiClient.delete(`/admin/buyers/${buyerId}`);
  return response.data;
};

/**
 * Gets all categories
 * @returns {Promise<{ success: boolean, data: Array }>}
 */
export const getAllCategories = async () => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view categories', code: 401, isBigError: false };
  const response = await apiClient.get('/admin/categories');
  return response.data;
};

/**
 * Gets a single category by ID
 * @param {string} categoryId - Category ID
 * @returns {Promise<{ success: boolean, data: Array }>}
 */
export const getCategoryById = async (categoryId) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view category', code: 401, isBigError: false };
  const response = await apiClient.get(`/admin/categories/${categoryId}`);
  return response.data;
};

/**
 * Creates a new category
 * @param {{ name: string, parentCategory?: string }} categoryData - Category details
 * @returns {Promise<{ success: boolean, data: { categoryId: string } }>}
 */
export const createCategory = async ({ name, parentCategory }) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to create a category', code: 401, isBigError: false };
  const response = await apiClient.post('/admin/categories', { name, parentCategory });
  return response.data;
};

/**
 * Updates a category
 * @param {string} categoryId - Category ID
 * @param {{ name?: string, parentCategory?: string, categoryOption?: Array }} categoryData - Category details to update
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const updateCategory = async (categoryId, { name, parentCategory, categoryOption }) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to update a category', code: 401, isBigError: false };
  const response = await apiClient.put(`/admin/categories/${categoryId}`, { name, parentCategory, categoryOption });
  return response.data;
};

/**
 * Deletes a category
 * @param {string} categoryId - Category ID
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const deleteCategory = async (categoryId) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to delete a category', code: 401, isBigError: false };
  const response = await apiClient.delete(`/admin/categories/${categoryId}`);
  return response.data;
};

/**
 * Gets all orders
 * @param {{ status?: string, district?: string, startDate?: string, endDate?: string }} params - Filter parameters
 * @returns {Promise<{ success: boolean, data: Array }>}
 */
export const getAllOrders = async ({ status, district, startDate, endDate } = {}) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view orders', code: 401, isBigError: false };
  const response = await apiClient.get('/admin/orders', { params: { status, district, startDate, endDate } });
  return response.data;
};

/**
 * Gets all products
 * @param {{ status?: string, category?: string, sellerId?: string }} params - Filter parameters
 * @returns {Promise<{ success: boolean, data: Array }>}
 */
export const getAllProducts = async ({ status, category, sellerId } = {}) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view products', code: 401, isBigError: false };
  const response = await apiClient.get('/admin/products', { params: { status, category, sellerId } });
  return response.data;
};

/**
 * Gets admin analytics
 * @returns {Promise<{ success: boolean, data: { totalOrders: number, totalRevenue: number, usersByRole: Object, orderStatusBreakdown: Object, topProducts: Array, topSellers: Array, courierPerformance: Array } }>}
 */
export const getAnalytics = async () => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view analytics', code: 401, isBigError: false };
  const response = await apiClient.get('/admin/analytics');
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
  getCategoryById: (categoryId) => apiRequest(() => getCategoryById(categoryId)),
  createCategory: (categoryData) => apiRequest(() => createCategory(categoryData)),
  updateCategory: (categoryId, categoryData) => apiRequest(() => updateCategory(categoryId, categoryData)),
  deleteCategory: (categoryId) => apiRequest(() => deleteCategory(categoryId)),
  getAllOrders: (params) => apiRequest(() => getAllOrders(params)),
  getAllProducts: (params) => apiRequest(() => getAllProducts(params)),
  getAnalytics: () => apiRequest(() => getAnalytics()),
};