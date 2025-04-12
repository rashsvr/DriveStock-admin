import apiClient, { isAuthenticated, apiRequest, validateInput } from './apiClient';
import Joi from 'joi';

/**
 * Logs out the user by clearing localStorage and redirecting
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

/**
 * Logs in a user
 * @param {{ email: string, password: string }} credentials - User credentials
 * @returns {Promise<{ success: boolean, data: { userId: string, role: string, token: string } }>}
 */
export const login = async ({ email, password }) => {
  const schema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().min(6).required(),
  });
  validateInput({ email, password }, schema);

  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
};

/**
 * Registers a new user
 * @param {{ email: string, password: string, role: string, name: string, phone: string }} userData - User details
 * @returns {Promise<{ success: boolean, data: { userId: string, token: string } }>}
 */
export const register = async ({ email, password, role, name, phone }) => {
  const schema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('seller', 'buyer').required(),
    name: Joi.string().min(2).required(),
    phone: Joi.string().pattern(/^\+\d+$/).required(),
  });
  validateInput({ email, password, role, name, phone }, schema);

  const response = await apiClient.post('/auth/register', { email, password, role, name, phone });
  return response.data;
};

/**
 * Uploads media files
 * @param {FormData} formData - FormData with media files
 * @returns {Promise<{ success: boolean, message: string, data: Array<{ id: string, url: string }> }>}
 */
export const uploadMedia = async (formData) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to upload media', code: 401, isBigError: false };
  const response = await apiClient.post('/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/**
 * Gets the user profile
 * @returns {Promise<{ success: boolean, data: { _id: string, role: string, email: string, name: string, phone: string, ... } }>}
 */
export const getProfile = async () => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view profile', code: 401, isBigError: false };
  const response = await apiClient.get('/profile');
  return response.data;
};

/**
 * Updates the user profile
 * @param {Object} profileData - Profile details to update
 * @returns {Promise<{ success: boolean, message: string, data: Object }>}
 */
export const updateProfile = async (profileData) => {
  const schema = Joi.object({
    name: Joi.string().min(2).optional(),
    phone: Joi.string().pattern(/^\+\d+$/).optional(),
    profileImage: Joi.string().uri().optional(),
    password: Joi.string().min(6).optional(),
    addresses: Joi.array()
      .items(
        Joi.object({
          street: Joi.string().required(),
          city: Joi.string().required(),
          country: Joi.string().required(),
          postalCode: Joi.string().required(),
          isDefault: Joi.boolean().optional(),
        })
      )
      .optional(),
  }).min(1);
  validateInput(profileData, schema);

  if (!isAuthenticated()) throw { message: 'User must be logged in to update profile', code: 401, isBigError: false };
  const response = await apiClient.put('/profile', profileData);
  return response.data;
};

/**
 * Deletes (deactivates) the user profile
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const deleteProfile = async () => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to delete profile', code: 401, isBigError: false };
  const response = await apiClient.delete('/profile');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return response.data;
};

// Default export for compatibility
const sharedApi = {
  login,
  register,
  logout,
  isAuthenticated,
  uploadMedia,
  getProfile,
  updateProfile,
  deleteProfile,
};

export default sharedApi;