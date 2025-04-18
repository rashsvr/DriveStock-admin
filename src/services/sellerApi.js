import apiClient, { isAuthenticated, apiRequest } from './apiClient';
import { uploadMedia } from './sharedApi';

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
  image,
}) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to create a product', code: 401, isBigError: false };

  let imageUrl = '';
  if (image) {
    if (!['image/jpeg', 'image/png'].includes(image.type)) {
      throw { message: 'Only JPG/PNG images are allowed', code: 400, isBigError: false };
    }
    const formData = new FormData();
    formData.append('media', image);
    const uploadResponse = await uploadMedia(formData);
    if (!uploadResponse.success || !uploadResponse.data[0]?.url) {
      throw { message: 'Failed to upload image', code: 400, isBigError: false };
    }
    imageUrl = uploadResponse.data[0].url;
  }

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
    images: imageUrl ? [imageUrl] : [],
  });
  return response.data;
};

export const getSellerProducts = async ({ page = 1, limit = 10, status, category } = {}) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view products', code: 401, isBigError: false };
  const params = { page, limit };
  if (status) params.status = status;
  if (category) params.category = category;
  const response = await apiClient.get('/seller/products', { params });
  return response.data;
};

/**
 * Updates a product with all fields
 * @param {string} productId - Product ID
 * @param {Object} productData - Product details to update
 * @returns {Promise<{ success: boolean, message: string, data: { productId: string, title: string } }>}
 */
export const updateProduct = async (productId, {
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
  image,
}) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to update a product', code: 401, isBigError: false };

  let imageUrl = '';
  if (image) {
    if (!['image/jpeg', 'image/png'].includes(image.type)) {
      throw { message: 'Only JPG/PNG images are allowed', code: 400, isBigError: false };
    }
    const formData = new FormData();
    formData.append('media', image);
    const uploadResponse = await uploadMedia(formData);
    if (!uploadResponse.success || !uploadResponse.data[0]?.url) {
      throw { message: 'Failed to upload image', code: 400, isBigError: false };
    }
    imageUrl = uploadResponse.data[0].url;
  }

  const updateData = {
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
  };
  if (imageUrl) updateData.images = [imageUrl];

  const response = await apiClient.put(`/seller/products/${productId}`, updateData);
  return response.data;
};

export const deleteProduct = async (productId) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to delete a product', code: 401, isBigError: false };
  const response = await apiClient.delete(`/seller/products/${productId}`);
  return response.data;
};

export const getSellerOrders = async ({ page = 1, limit = 10, status, startDate, endDate } = {}) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view orders', code: 401, isBigError: false };
  const params = { page, limit };
  if (status) params.status = status;
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  const response = await apiClient.get('/seller/orders', { params });
  return response.data;
};

export const getOrderById = async (orderId) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view an order', code: 401, isBigError: false };
  const response = await apiClient.get(`/seller/order/${orderId}`);
  return response.data;
};

export const updateOrderStatus = async (orderId, { status, productId }) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to update order status', code: 401, isBigError: false };
  const response = await apiClient.put(`/seller/order/${orderId}/status`, { status, productId });
  return response.data;
};

export const orderHandover = async (orderId, { productId }) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to update order status', code: 401, isBigError: false };
  const response = await apiClient.put(`/seller/order/${orderId}/handover`, { productId });
  return response.data;
};

export const cancelOrder = async (orderId) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to cancel an order', code: 401, isBigError: false };
  const response = await apiClient.post(`/seller/order/cancel/${orderId}`);
  return response.data;
};

export const getAnalytics = async () => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view analytics', code: 401, isBigError: false };
  const response = await apiClient.get('/seller/analytics');
  return response.data;
};

// New function: getAllCategories
/**
 * Gets all categories
 * @returns {Promise<{ success: boolean, data: Array<{ _id: string, name: string, parentCategory: string | null, categoryOption?: Array }> }>}
 */
export const getAllCategories = async () => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view categories', code: 401, isBigError: false };
  const response = await apiClient.get('/seller/categories');
  return response.data;
};

export const resolveComplaint = async (orderId, data) => {
  const response = await apiClient.post(`/seller/order/${orderId}/complaint/resolve`, data);
  return response.data;
};


export default {
  createProduct: (productData) => apiRequest(() => createProduct(productData)),
  getSellerProducts: (params) => apiRequest(() => getSellerProducts(params)),
  updateProduct: (productId, productData) => apiRequest(() => updateProduct(productId, productData)),
  deleteProduct: (productId) => apiRequest(() => deleteProduct(productId)),
  getSellerOrders: (params) => apiRequest(() => getSellerOrders(params)),
  getOrderById: (orderId) => apiRequest(() => getOrderById(orderId)),
  updateOrderStatus: (orderId, statusData, productId) => apiRequest(() => updateOrderStatus(orderId, statusData, productId)),
  orderHandover: (orderId, productId) => apiRequest(() => orderHandover(orderId, productId)),
  cancelOrder: (orderId) => apiRequest(() => cancelOrder(orderId)),
  getAnalytics: () => apiRequest(() => getAnalytics()),
  getAllCategories: () => apiRequest(() => getAllCategories()),
  resolveComplaint: (orderId, data) => apiRequest(() => resolveComplaint(orderId, data)),
};