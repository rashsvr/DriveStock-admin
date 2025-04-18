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
 * @returns {Promise<{ success: boolean, data: Array<{ _id: string, email: string, name: string, phone: string, region: string, status: string }> }>}
 */
export const getAllCouriers = async () => {
  if (!isAuthenticated()) {
    throw { message: 'User must be logged in to view couriers', code: 401, isBigError: false };
  }
  const response = await apiClient.get('/admin/couriers');
  return response.data;
};

/**
 * Creates a new courier
 * @param {{ email: string, password: string, name: string, phone: string, region: string }} courierData - Courier details
 * @returns {Promise<{ success: boolean, data: { courierId: string } }>}
 */
export const createCourier = async ({ email, password, name, phone, region }) => {
  if (!isAuthenticated()) {
    throw { message: 'User must be logged in to create a courier', code: 401, isBigError: false };
  }
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
  if (!isAuthenticated()) {
    throw { message: 'User must be logged in to update a courier', code: 401, isBigError: false };
  }
  const response = await apiClient.put(`/admin/couriers/${courierId}`, { email, name, phone, region });
  return response.data;
};

/**
 * Deletes a courier
 * @param {string} courierId - Courier ID
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const deleteCourier = async (courierId) => {
  if (!isAuthenticated()) {
    throw { message: 'User must be logged in to delete a courier', code: 401, isBigError: false };
  }
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
 * @returns {Promise<{ success: boolean, data: Array<{ _id: string, name: string, parentCategory: string | null, status: string, createdAt: string, updatedAt: string, __v: number, categoryOption?: Array<{ _id: string, name: string, parentCategory: { _id: string, name: string }, status: string, createdAt: string, updatedAt: string, __v: number }> }> }>}
 */
export const getAllCategories = async () => {
  if (!isAuthenticated()) {
    throw { message: 'User must be logged in to view categories', code: 401, isBigError: false };
  }
  const response = await apiClient.get('/admin/categories');
  return response.data;
};

/**
 * Creates a main or subcategory
 * @param {{ name: string, parentCategory?: string | null }} categoryData - Category details
 * @returns {Promise<{ success: boolean, data: { categoryId: string, name: string } }>}
 */
export const createCategory = async ({ name, parentCategory = null }) => {
  if (!isAuthenticated()) {
    throw { message: 'User must be logged in to create a category', code: 401, isBigError: false };
  }
  const response = await apiClient.post('/admin/categories', { name, parentCategory });
  return response.data;
};

/**
 * Updates a category or subcategory
 * @param {string} categoryId - Category or subcategory ID
 * @param {{ name?: string, parentCategory?: string | null, categoryOption?: Array<{ _id?: string, name: string, parentCategory?: { _id: string, name: string }, status?: string }> }} categoryData - Category or subcategory details
 * @returns {Promise<{ success: boolean, message: string, data: { categoryId: string, name: string } }>}
 */
export const updateCategory = async (categoryId, { name, parentCategory, categoryOption }) => {
  if (!isAuthenticated()) {
    throw { message: 'User must be logged in to update a category', code: 401, isBigError: false };
  }
  const response = await apiClient.put(`/admin/categories/${categoryId}`, {
    name,
    parentCategory,
    categoryOption,
  });
  return response.data;
};

/**
 * Deletes a category or subcategory (soft delete)
 * @param {string} categoryId - Category or subcategory ID
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const deleteCategory = async (categoryId) => {
  if (!isAuthenticated()) {
    throw { message: 'User must be logged in to delete a category', code: 401, isBigError: false };
  }
  const response = await apiClient.delete(`/admin/categories/${categoryId}`);
  return response.data;
};
 
/**
 * Gets all orders with optional filters
 * @param {{ status?: string, district?: string, startDate?: string, endDate?: string }} params - Filter parameters
 * @returns {Promise<{ success: boolean, data: Array<{ _id: string, status: string, shippingAddress: { district: string }, createdAt: string, total: number, buyerId: { _id: string }, sellerId: { _id: string } }> }>}
 */
export const getAllOrders = async (params = {}) => {
  if (!isAuthenticated()) {
    throw { message: 'User must be logged in to view orders', code: 401, isBigError: false };
  }
  // Clean params: remove empty or undefined values
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== '' && value !== undefined)
  );
  const response = await apiClient.get('/admin/orders', { params: cleanedParams });
  return response.data;
};

/**
 * Gets all products with optional filters
 * @param {{ status?: string, category?: string, sellerId?: string }} params - Filter parameters
 * @returns {Promise<{ success: boolean, data: Array<{ _id: string, title: string, price: number, category: { _id: string, name: string }, sellerId: { _id: string, name: string }, status: string }> }>}
 */
export const getAllProducts = async (params = {}) => {
  if (!isAuthenticated()) {
    throw { message: 'User must be logged in to view products', code: 401, isBigError: false };
  }
  // Clean params: remove empty or undefined values
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== '' && value !== undefined)
  );
  console.log('API getAllProducts params:', cleanedParams); // Debug log
  const response = await apiClient.get('admin/products', { params: cleanedParams });
  console.log('API getAllProducts response:', response.data); // Debug log
  return response.data;
};


/**
 * Gets admin analytics
 * @returns {Promise<{
*   success: boolean,
*   data: {
*     totalOrders: number,
*     totalRevenue: number,
*     usersByRole: {
*       courier: number,
*       seller: number,
*       admin: number,
*       buyer: number
*     },
*     orderStatusBreakdown: { [key: string]: number },
*     topProducts: Array<{
*       _id: string,
*       title: string,
*       description: string,
*       price: number,
*       category: { _id: string, name: string },
*       stock: number,
*       condition: string,
*       brand: string,
*       oem: string,
*       aftermarket: boolean,
*       material: string,
*       makeModel: Array<{ make: string, model: string, _id: string }>,
*       years: Array<number>,
*       availability: string,
*       images: Array<string>,
*       sellerId: string | null,
*       status: string,
*       createdAt: string,
*       updatedAt: string,
*       __v: number
*     }>,
*     topSellers: Array<{
*       _id: string,
*       role: string,
*       email: string,
*       password: string,
*       name: string,
*       phone: string,
*       status: string,
*       createdAt: string,
*       updatedAt: string,
*       __v: number,
*       addresses: Array<{
*         street: string,
*         city: string,
*         country: string,
*         postalCode: string,
*         isDefault: boolean,
*         _id: string
*       }>,
*       profileImage: string
*     }>,
*     courierPerformance: Array<{
*       _id: string,
*       delivered: number,
*       failed: number,
*       name: string
*     }>
*   }
* }>}
*/
export const getAnalytics = async () => {
 if (!isAuthenticated()) {
   throw { message: 'User must be logged in to view analytics', code: 401, isBigError: false };
 }
 const response = await apiClient.get('/admin/analytics');
 return response.data;
};

export const getAllComplaints = async (params) => {
  const response = await apiClient.get("/admin/complaints", { params });
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
  getAllComplaints: (params) => apiRequest(() => getAllComplaints(params)),
};