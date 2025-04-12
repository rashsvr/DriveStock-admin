import apiClient, { isAuthenticated, apiRequest, validateInput } from './apiClient';
import Joi from 'joi';

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
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    description: Joi.string().min(10).required(),
    price: Joi.number().positive().required(),
    category: Joi.string().required(),
    stock: Joi.number().integer().min(0).required(),
    condition: Joi.string().valid('New', 'Used', 'Refurbished').required(),
    brand: Joi.string().optional(),
    oem: Joi.string().optional(),
    aftermarket: Joi.boolean().optional(),
    material: Joi.string().optional(),
    makeModel: Joi.array()
      .items(Joi.object({ make: Joi.string().required(), model: Joi.string().required() }))
      .optional(),
    years: Joi.array().items(Joi.number().integer().min(1900).max(new Date().getFullYear())).optional(),
    images: Joi.array().items(Joi.string().uri()).optional(),
  });
  validateInput({ title, description, price, category, stock, condition, brand, oem, aftermarket, material, makeModel, years, images }, schema);

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
  const schema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
  });
  validateInput({ page, limit }, schema);

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
  const schema = Joi.object({
    productId: Joi.string().required(),
    price: Joi.number().positive().optional(),
    stock: Joi.number().integer().min(0).optional(),
    description: Joi.string().min(10).optional(),
  }).min(1);
  validateInput({ productId, price, stock, description }, schema);

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
  const schema = Joi.object({
    productId: Joi.string().required(),
  });
  validateInput({ productId }, schema);

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
  const schema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
  });
  validateInput({ page, limit }, schema);

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
  const schema = Joi.object({
    orderId: Joi.string().required(),
  });
  validateInput({ orderId }, schema);

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
  const schema = Joi.object({
    orderId: Joi.string().required(),
    status: Joi.string().valid('Processing', 'Shipped', 'Delivered').required(),
  });
  validateInput({ orderId, status }, schema);

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
  const schema = Joi.object({
    orderId: Joi.string().required(),
  });
  validateInput({ orderId }, schema);

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