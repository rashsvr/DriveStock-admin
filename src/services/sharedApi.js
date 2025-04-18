import apiClient, { isAuthenticated, apiRequest } from './apiClient';

export const logout = () => {
  localStorage.removeItem('AdminToken');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export const login = async ({ email, password }) => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
};

export const register = async ({ email, password, role, name, phone }) => {
  const response = await apiClient.post('/auth/register', { email, password, role, name, phone });
  return response.data;
};

export const uploadMedia = async (formData) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to upload media', code: 401, isBigError: false };
  const response = await apiClient.post('/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getProfile = async () => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view profile', code: 401, isBigError: false };
  const response = await apiClient.get('/profile');
  return response.data;
};

export const updateProfile = async (profileData) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to update profile', code: 401, isBigError: false };
  const response = await apiClient.put('/profile', profileData);
  return response.data;
};

export const deleteProfile = async () => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to delete profile', code: 401, isBigError: false };
  const response = await apiClient.delete('/profile');
  localStorage.removeItem('AdminToken');
  localStorage.removeItem('user');
  return response.data;
};

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