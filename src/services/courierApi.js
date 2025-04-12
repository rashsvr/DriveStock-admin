import apiClient, { isAuthenticated, apiRequest, validateInput } from './apiClient';
import Joi from 'joi';

/**
 * Gets assigned or available orders
 * @param {{ page?: number, limit?: number }} params - Pagination parameters
 * @returns {Promise<{ success: boolean, data: Array }>}
 */
export const getAssignedOrders = async ({ page = 1, limit = 10 } = {}) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
  });
  validateInput({ page, limit }, schema);

  if (!isAuthenticated()) throw { message: 'User must be logged in to view assigned orders', code: 401, isBigError: false };
  const response = await apiClient.get('/courier/orders', { params: { page, limit } });
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
  const response = await apiClient.get(`/courier/order/${orderId}`);
  return response.data;
};

/**
 * Updates order status
 * @param {string} orderId - Order ID
 * @param {{ status: string, reason?: string }} statusData - Status and optional reason
 * @returns {Promise<{ success: boolean, message: string, trackingNumber?: string }>}
 */
export const updateOrderStatus = async (orderId, { status, reason }) => {
  const schema = Joi.object({
    orderId: Joi.string().required(),
    status: Joi.string().valid('Picked Up', 'In Transit', 'Out for Delivery', 'Delivered', 'Failed Delivery').required(),
    reason: Joi.string().when('status', { is: 'Failed Delivery', then: Joi.required(), otherwise: Joi.optional() }),
  });
  validateInput({ orderId, status, reason }, schema);

  if (!isAuthenticated()) throw { message: 'User must be logged in to update order status', code: 401, isBigError: false };
  const response = await apiClient.put(`/courier/order/${orderId}/status`, { status, reason });
  return response.data;
};

/**
 * Reports a delivery issue
 * @param {string} orderId - Order ID
 * @param {{ reason: string }} issueData - Reason for the issue
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const reportDeliveryIssue = async (orderId, { reason }) => {
  const schema = Joi.object({
    orderId: Joi.string().required(),
    reason: Joi.string().required(),
  });
  validateInput({ orderId, reason }, schema);

  if (!isAuthenticated()) throw { message: 'User must be logged in to report an issue', code: 401, isBigError: false };
  const response = await apiClient.post(`/courier/order/${orderId}/report-issue`, { reason });
  return response.data;
};

/**
 * Gets courier analytics
 * @returns {Promise<{ success: boolean, data: { statusBreakdown: Object, successRate: string, averageDeliveryTime: string } }>}
 */
export const getAnalytics = async () => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view analytics', code: 401, isBigError: false };
  const response = await apiClient.get('/courier/analytics');
  return response.data;
};

export default {
  getAssignedOrders: (params) => apiRequest(() => getAssignedOrders(params)),
  getOrderById: (orderId) => apiRequest(() => getOrderById(orderId)),
  updateOrderStatus: (orderId, statusData) => apiRequest(() => updateOrderStatus(orderId, statusData)),
  reportDeliveryIssue: (orderId, issueData) => apiRequest(() => reportDeliveryIssue(orderId, issueData)),
  getAnalytics: () => apiRequest(() => getAnalytics()),
};