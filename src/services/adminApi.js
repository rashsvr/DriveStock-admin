import { apiClient, apiRequest, isAuthenticated } from './sharedApi';

// Admin Management API Calls
export const getAllAdmins = async () => {
  // No request body or params required
  if (!isAuthenticated()) throw { message: 'User must be logged in to view admins', code: 401, isBigError: false };
  const response = await apiClient.get('/admin/admins');
  return response.data;
};

export const createAdmin = async ({ email, password, name, phone }) => {
  // Expected data structure:
  // {
  //   email: "newadmin@example.com",
  //   password: "securepassword",
  //   name: "New Admin",
  //   phone: "+94770470323"
  // }
  if (!isAuthenticated()) throw { message: 'User must be logged in to create an admin', code: 401, isBigError: false };
  const response = await apiClient.post('/admin/admins', { email, password, name, phone });
  return response.data;
};

export const deleteAdmin = async (adminId) => {
  // Expected: adminId as string, e.g., "67ed88035b2e5327f9a92963"
  if (!isAuthenticated()) throw { message: 'User must be logged in to delete an admin', code: 401, isBigError: false };
  const response = await apiClient.delete(`/admin/admins/${adminId}`);
  return response.data;
};

// Courier Management API Calls
export const getAllCouriers = async () => {
  // No request body or params required
  if (!isAuthenticated()) throw { message: 'User must be logged in to view couriers', code: 401, isBigError: false };
  const response = await apiClient.get('/admin/couriers');
  return response.data;
};

export const createCourier = async ({ email, password, name, phone, region }) => {
  // Expected data structure:
  // {
  //   email: "newcourier@mail.com",
  //   password: "123",
  //   name: "New Courier",
  //   phone: "+94770470323",
  //   region: "Galle"
  // }
  if (!isAuthenticated()) throw { message: 'User must be logged in to create a courier', code: 401, isBigError: false };
  const response = await apiClient.post('/admin/couriers', { email, password, name, phone, region });
  return response.data;
};

export const updateCourier = async (courierId, { email, name, phone, region }) => {
  // Expected data structure:
  // {
  //   email: "updatedcourier@mail.com",
  //   name: "Updated Courier",
  //   phone: "+94770470323",
  //   region: "Colombo"
  // }
  if (!isAuthenticated()) throw { message: 'User must be logged in to update a courier', code: 401, isBigError: false };
  const response = await apiClient.put(`/admin/couriers/${courierId}`, { email, name, phone, region });
  return response.data;
};

export const deleteCourier = async (courierId) => {
  // Expected: courierId as string, e.g., "67ed88da5b2e5327f9a9296a"
  if (!isAuthenticated()) throw { message: 'User must be logged in to delete a courier', code: 401, isBigError: false };
  const response = await apiClient.delete(`/admin/couriers/${courierId}`);
  return response.data;
};

// Seller Management API Calls
export const getPendingSellers = async () => {
  // No request body or params required
  if (!isAuthenticated()) throw { message: 'User must be logged in to view pending sellers', code: 401, isBigError: false };
  const response = await apiClient.get('/admin/sellers/pending');
  return response.data;
};

export const getAllSellers = async () => {
  // No request body or params required
  if (!isAuthenticated()) throw { message: 'User must be logged in to view sellers', code: 401, isBigError: false };
  const response = await apiClient.get('/admin/sellers');
  return response.data;
};

export const approveSeller = async (sellerId) => {
  // Expected: sellerId as string, e.g., "67ed871c5b2e5327f9a9295f"
  if (!isAuthenticated()) throw { message: 'User must be logged in to approve a seller', code: 401, isBigError: false };
  const response = await apiClient.put(`/admin/sellers/${sellerId}`);
  return response.data;
};

export const deleteSeller = async (sellerId) => {
  // Expected: sellerId as string, e.g., "67ed871c5b2e5327f9a9295f"
  if (!isAuthenticated()) throw { message: 'User must be logged in to delete a seller', code: 401, isBigError: false };
  const response = await apiClient.delete(`/admin/sellers/${sellerId}`);
  return response.data;
};

// Buyer Management API Calls
export const getAllBuyers = async () => {
  // No request body or params required
  if (!isAuthenticated()) throw { message: 'User must be logged in to view buyers', code: 401, isBigError: false };
  const response = await apiClient.get('/admin/buyers');
  return response.data;
};

export const deleteBuyer = async (buyerId) => {
  // Expected: buyerId as string, e.g., "67e754164d954ec2d0057524"
  if (!isAuthenticated()) throw { message: 'User must be logged in to delete a buyer', code: 401, isBigError: false };
  const response = await apiClient.delete(`/admin/buyers/${buyerId}`);
  return response.data;
};

// Category Management API Calls
export const getAllCategories = async () => {
  // No request body or params required
  if (!isAuthenticated()) throw { message: 'User must be logged in to view categories', code: 401, isBigError: false };
  const response = await apiClient.get('/admin/categories');
  return response.data;
};

export const getCategoryById = async (categoryId) => {
  // Expected: categoryId as string, e.g., "67e8ba833dc8d3b9b6c6660d"
  if (!isAuthenticated()) throw { message: 'User must be logged in to view a category', code: 401, isBigError: false };
  const response = await apiClient.get(`/admin/categories/${categoryId}`);
  return response.data;
};

export const createCategory = async ({ name, parentCategory }) => {
  // Expected data structure:
  // {
  //   name: "New Category",
  //   parentCategory: "67e8bcea6b8eda334c2d2b2c" // Optional
  // }
  if (!isAuthenticated()) throw { message: 'User must be logged in to create a category', code: 401, isBigError: false };
  const response = await apiClient.post('/admin/categories', { name, parentCategory });
  return response.data;
};

export const updateCategory = async (categoryId, { name, parentCategory }) => {
  // Expected data structure:
  // {
  //   name: "Updated Category",
  //   parentCategory: "67e8bcea6b8eda334c2d2b2c" // Optional
  // }
  if (!isAuthenticated()) throw { message: 'User must be logged in to update a category', code: 401, isBigError: false };
  const response = await apiClient.put(`/admin/categories/${categoryId}`, { name, parentCategory });
  return response.data;
};

export const deleteCategory = async (categoryId) => {
  // Expected: categoryId as string, e.g., "67e8ba833dc8d3b9b6c6660d"
  if (!isAuthenticated()) throw { message: 'User must be logged in to delete a category', code: 401, isBigError: false };
  const response = await apiClient.delete(`/admin/categories/${categoryId}`);
  return response.data;
};

// Export wrapped functions
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
};