import apiClient, { isAuthenticated, apiRequest } from './apiClient';

/**
 * Shared API Requests (used by multiple roles)
 */

/**
 * Uploads media files to the server
 * @param {Array<File>} files - Array of files to upload (images/videos)
 * @returns {Promise<{success: boolean, data: Array<{id: string, url: string}>}>}
 */
export const uploadMedia = async (files) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to upload media', code: 401 };
  const formData = new FormData();
  files.forEach(file => formData.append('media', file));
  const response = await apiClient.post('/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

/**
 * Gets user profile information
 * @returns {Promise<{success: boolean, data: {name: string, email: string, phone: string, addresses: Array, role: string}}>}
 */
export const getProfile = async () => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view profile', code: 401 };
  const response = await apiClient.get('/profile');
  return response.data;
};

/**
 * Updates user profile
 * @param {{name?: string, phone?: string, profileImage?: string, password?: string, addresses?: Array}} profileData - Profile data to update
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const updateProfile = async (profileData) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to update profile', code: 401 };
  const response = await apiClient.put('/profile', profileData);
  return response.data;
};

/**
 * Gets all product categories
 * @returns {Promise<{success: boolean, data: Array<{_id: string, name: string, categoryOption: Array}>}>}
 */
export const getAllCategories = async () => {
  const response = await apiClient.get('/categories');
  return response.data;
};

/**
 * Gets product filter options
 * @returns {Promise<{success: boolean, data: {condition: Array, brand: Array, oem: Array, material: Array, availability: Array, aftermarket: Array, make: Array, model: Array, years: Array, category: Array, priceRange: {min: number, max: number}}}>}
 */
export const getProductFilterOptions = async () => {
  const response = await apiClient.get('/product-filter-options');
  return response.data;
};

/**
 * Buyer-specific API Requests
 */

/**
 * Gets all active products with pagination
 * @param {{page?: number, limit?: number, category?: string}} params - Pagination and filtering parameters
 * @returns {Promise<{success: boolean, data: Array, pagination: {page: number, limit: number, total: number}}>}
 */
export const getBuyerProducts = async ({ page = 1, limit = 10, category } = {}) => {
  const response = await apiClient.get('/products', { params: { page, limit, category } });
  return response.data;
};

/**
 * Searches products with filters
 * @param {{keyword?: string, minPrice?: number, maxPrice?: number, condition?: string, brand?: string, oem?: string, aftermarket?: boolean, availability?: string, make?: string, model?: string, years?: string, material?: string, sellerLocation?: string}} filters - Search filters
 * @returns {Promise<{success: boolean, data: Array}>}
 */
export const searchProducts = async (filters = {}) => {
  const response = await apiClient.get('/products/search', { params: filters });
  return response.data;
};

/**
 * Gets product by ID
 * @param {string} productId - Product ID
 * @returns {Promise<{success: boolean, data: {_id: string, title: string, description: string, price: number, images: Array, ...}}>}
 */
export const getProductById = async (productId) => {
  const response = await apiClient.get(`/products/${productId}`);
  return response.data;
};

/**
 * Adds product to cart
 * @param {string} productId - Product ID
 * @param {number} quantity - Quantity to add (default: 1)
 * @returns {Promise<{success: boolean, message: string, data: {items: Array, total: number}}>}
 */
export const addToCart = async (productId, quantity = 1) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to add to cart', code: 401 };
  const response = await apiClient.post('/cart/add', { productId, quantity });
  return response.data;
};

/**
 * Creates a new order
 * @param {{items?: Array<{productId: string, quantity: number}>, shippingAddress: {street: string, city: string, district: string, country: string, postalCode: string}}} orderData - Order data
 * @returns {Promise<{success: boolean, data: {orderId: string, payhereData: object}}>}
 */
export const createOrder = async (orderData) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to create order', code: 401 };
  const response = await apiClient.post('/order', orderData);
  return response.data;
};

/**
 * Gets buyer's orders
 * @returns {Promise<{success: boolean, data: Array}>}
 */
export const getBuyerOrders = async () => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view orders', code: 401 };
  const response = await apiClient.get('/orders');
  return response.data;
};

/**
 * Seller-specific API Requests
 */

/**
 * Creates a new product
 * @param {{title: string, description: string, price: number, category: string, stock: number, condition: string, brand: string, oem: string, aftermarket: boolean, material: string, makeModel: Array, years: Array, images: Array}} productData - Product data
 * @returns {Promise<{success: boolean, data: {productId: string, title: string}}>}
 */
export const createProduct = async (productData) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to create product', code: 401 };
  const response = await apiClient.post('/seller/products', productData);
  return response.data;
};

/**
 * Gets seller's products
 * @param {{page?: number, limit?: number}} params - Pagination parameters
 * @returns {Promise<{success: boolean, data: Array, pagination: {page: number, limit: number, total: number}}>}
 */
export const getSellerProducts = async ({ page = 1, limit = 10 } = {}) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view products', code: 401 };
  const response = await apiClient.get('/seller/products', { params: { page, limit } });
  return response.data;
};

/**
 * Updates a product
 * @param {string} productId - Product ID
 * @param {{title?: string, description?: string, price?: number, category?: string, stock?: number, condition?: string, brand?: string, oem?: string, aftermarket?: boolean, material?: string, makeModel?: Array, years?: Array, images?: Array}} productData - Product data to update
 * @returns {Promise<{success: boolean, message: string, data: {productId: string, title: string}}>}
 */
export const updateProduct = async (productId, productData) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to update product', code: 401 };
  const response = await apiClient.put(`/seller/products/${productId}`, productData);
  return response.data;
};

/**
 * Gets seller's orders
 * @param {{page?: number, limit?: number}} params - Pagination parameters
 * @returns {Promise<{success: boolean, data: Array, pagination: {page: number, limit: number, total: number}}>}
 */
export const getSellerOrders = async ({ page = 1, limit = 10 } = {}) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view orders', code: 401 };
  const response = await apiClient.get('/seller/orders', { params: { page, limit } });
  return response.data;
};

/**
 * Admin-specific API Requests
 */

/**
 * Gets all admins
 * @returns {Promise<{success: boolean, data: Array}>}
 */
export const getAdmins = async () => {
  if (!isAuthenticated()) throw { message: 'User must be logged in as admin', code: 401 };
  const response = await apiClient.get('/admin/admins');
  return response.data;
};

/**
 * Gets pending seller applications
 * @returns {Promise<{success: boolean, data: Array}>}
 */
export const getPendingSellers = async () => {
  if (!isAuthenticated()) throw { message: 'User must be logged in as admin', code: 401 };
  const response = await apiClient.get('/admin/sellers/pending');
  return response.data;
};

/**
 * Approves a seller application
 * @param {string} sellerId - Seller user ID
 * @returns {Promise<{success: boolean, message: string, data: {sellerId: string}}>}
 */
export const approveSeller = async (sellerId) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in as admin', code: 401 };
  const response = await apiClient.put(`/admin/sellers/${sellerId}`);
  return response.data;
};

/**
 * Gets admin analytics
 * @returns {Promise<{success: boolean, data: {totalOrders: number, totalRevenue: number, usersByRole: object, orderStatusBreakdown: object, topProducts: Array, topSellers: Array, courierPerformance: Array}}>}
 */
export const getAdminAnalytics = async () => {
  if (!isAuthenticated()) throw { message: 'User must be logged in as admin', code: 401 };
  const response = await apiClient.get('/admin/analytics');
  return response.data;
};

/**
 * Courier-specific API Requests
 */

/**
 * Gets assigned or available orders
 * @param {{page?: number, limit?: number}} params - Pagination parameters
 * @returns {Promise<{success: boolean, data: Array, pagination: {page: number, limit: number, total: number}}>}
 */
export const getAssignedOrders = async ({ page = 1, limit = 10 } = {}) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in as courier', code: 401 };
  const response = await apiClient.get('/courier/orders', { params: { page, limit } });
  return response.data;
};

/**
 * Updates order status
 * @param {string} orderId - Order ID
 * @param {string} productId - Product ID in the order
 * @param {{status: string, reason?: string}} statusData - Status and optional reason
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const updateOrderStatus = async (orderId, productId, { status, reason }) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in as courier', code: 401 };
  const response = await apiClient.put(`/courier/order/${orderId}/status`, { productId, status, reason });
  return response.data;
};

/**
 * Reports a delivery issue
 * @param {string} orderId - Order ID
 * @param {string} productId - Product ID in the order
 * @param {{reason: string}} issueData - Reason for the issue
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const reportDeliveryIssue = async (orderId, productId, { reason }) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in as courier', code: 401 };
  const response = await apiClient.post(`/courier/order/${orderId}/report-issue`, { productId, reason });
  return response.data;
};

/**
 * Gets courier analytics
 * @returns {Promise<{success: boolean, data: {statusBreakdown: object, successRate: string, averageDeliveryTime: string}}>}
 */
export const getCourierAnalytics = async () => {
  if (!isAuthenticated()) throw { message: 'User must be logged in as courier', code: 401 };
  const response = await apiClient.get('/courier/analytics');
  return response.data;
};

export default {
  // Shared requests
  uploadMedia: (files) => apiRequest(() => uploadMedia(files)),
  getProfile: () => apiRequest(() => getProfile()),
  updateProfile: (profileData) => apiRequest(() => updateProfile(profileData)),
  getAllCategories: () => apiRequest(() => getAllCategories()),
  getProductFilterOptions: () => apiRequest(() => getProductFilterOptions()),

  // Buyer requests
  getBuyerProducts: (params) => apiRequest(() => getBuyerProducts(params)),
  searchProducts: (filters) => apiRequest(() => searchProducts(filters)),
  getProductById: (productId) => apiRequest(() => getProductById(productId)),
  addToCart: (productId, quantity) => apiRequest(() => addToCart(productId, quantity)),
  createOrder: (orderData) => apiRequest(() => createOrder(orderData)),
  getBuyerOrders: () => apiRequest(() => getBuyerOrders()),

  // Seller requests
  createProduct: (productData) => apiRequest(() => createProduct(productData)),
  getSellerProducts: (params) => apiRequest(() => getSellerProducts(params)),
  updateProduct: (productId, productData) => apiRequest(() => updateProduct(productId, productData)),
  getSellerOrders: (params) => apiRequest(() => getSellerOrders(params)),

  // Admin requests
  getAdmins: () => apiRequest(() => getAdmins()),
  getPendingSellers: () => apiRequest(() => getPendingSellers()),
  approveSeller: (sellerId) => apiRequest(() => approveSeller(sellerId)),
  getAdminAnalytics: () => apiRequest(() => getAdminAnalytics()),

  // Courier requests
  getAssignedOrders: (params) => apiRequest(() => getAssignedOrders(params)),
  updateOrderStatus: (orderId, productId, statusData) => apiRequest(() => updateOrderStatus(orderId, productId, statusData)),
  reportDeliveryIssue: (orderId, productId, issueData) => apiRequest(() => reportDeliveryIssue(orderId, productId, issueData)),
  getCourierAnalytics: () => apiRequest(() => getCourierAnalytics()),
};