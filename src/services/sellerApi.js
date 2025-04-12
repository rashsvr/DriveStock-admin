import apiClient, { isAuthenticated, apiRequest } from './apiClient';

/**
 * Creates a new product
 * @param {Object} productData - Product details
 * @returns {Promise<{ success: boolean, data: { productId: string, title: string } }>}
 */
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

/**
 * Gets seller's products
 * @param {{ page?: number, limit?: number }} params - Pagination parameters
 * @returns {Promise<{ success: boolean, data: Array, pagination: { page: number, limit: number, total: number } }>}
 */
export const getSellerProducts = async ({ page = 1, limit = 10 } = {}) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view products', code: 401, isBigError: false };
  const response = await apiClient.get('/seller/products', { params: { page, limit } });
  return response.data;
};

/**
 * Updates a product
 * @param {string} productId - Product ID
 * @param {{ price?: number, stock?: number, description?: string }} productData - Product details to update
 * @returns {Promise<{ success: boolean, message: string, data: { productId: string, title: string } }>}
 */
export const updateProduct = async (productId, { price, stock, description }) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to update a product', code: 401, isBigError: false };
  const response = await apiClient.put(`/seller/products/${productId}`, { price, stock, description });
  return response.data;
};

/**
 * Deletes a product
 * @param {string} productId - Product ID
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const deleteProduct = async (productId) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to delete a product', code: 401, isBigError: false };
  const response = await apiClient.delete(`/seller/products/${productId}`);
  return response.data;
};

/**
 * Gets seller's orders
 * @param {{ page?: number, limit?: number }} params - Pagination parameters
 * @returns {Promise<{ success: boolean, data: Array }>}
 */
export const getSellerOrders = async ({ page = 1, limit = 10 } = {}) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view orders', code: 401, isBigError: false };
  const response = await apiClient.get('/seller/orders', { params: { page, limit } });
  return response.data;
};

/**
 * Gets an order by ID
 * @param {string} orderId - Order ID
 * @returns {Promise<{ success: boolean, data: Object }>}
 */
export const getOrderById = async (orderId) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view an order', code: 401, isBigError: false };
  const response = await apiClient.get(`/seller/order/${orderId}`);
  return response.data;
};

/**
 * Updates order status
 * @param {string} orderId - Order ID
 * @param {{ status: string }} statusData - New status
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const updateOrderStatus = async (orderId, { status }) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to update order status', code: 401, isBigError: false };
  const response = await apiClient.put(`/seller/order/${orderId}/status`, { status });
  return response.data;
};

/**
 * Cancels an order
 * @param {string} orderId - Order ID
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const cancelOrder = async (orderId) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to cancel an order', code: 401, isBigError: false };
  const response = await apiClient.post(`/seller/order/cancel/${orderId}`);
  return response.data;
};

/**
 * Gets seller analytics
 * @returns {Promise<{ success: boolean, data: { totalOrders: number, totalRevenue: number, statusBreakdown: Object, topProducts: Array, lowStockProducts: Array } }>}
 */
export const getAnalytics = async () => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view analytics', code: 401, isBigError: false };
  const response = await apiClient.get('/seller/analytics');
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
  getAnalytics: () => apiRequest(() => getAnalytics()),
};