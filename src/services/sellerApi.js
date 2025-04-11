import { apiClient, apiRequest, isAuthenticated } from './sharedApi';

// Seller Product Management API Calls
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
  // Expected data structure:
  // {
  //   title: "Toyota Camry Brake Pads",
  //   description: "High-quality ceramic brake pads for Toyota vehicles",
  //   price: 75,
  //   category: "67e8ba893dc8d3b9b6c6665e",
  //   stock: 10,
  //   condition: "New", // "New", "Used", "Refurbished"
  //   brand: "Bosch",
  //   oem: "OEM123",
  //   aftermarket: false,
  //   material: "Ceramic",
  //   makeModel: [
  //     { make: "Toyota", model: "Camry" },
  //     { make: "Toyota", model: "Corolla" }
  //   ],
  //   years: [2015, 2020],
  //   images: ["https://example.com/brake-pads.jpg"]
  // }
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

export const getSellerProducts = async ({ page = 1, limit = 10 }) => {
  // Expected query params:
  // page: 1
  // limit: 10
  if (!isAuthenticated()) throw { message: 'User must be logged in to view products', code: 401, isBigError: false };
  const response = await apiClient.get('/seller/products', { params: { page, limit } });
  return response.data;
};

export const updateProduct = async (productId, { price, stock, description }) => {
  // Expected data structure:
  // {
  //   price: 80,
  //   stock: 100,
  //   description: "Updated description"
  // }
  if (!isAuthenticated()) throw { message: 'User must be logged in to update a product', code: 401, isBigError: false };
  const response = await apiClient.put(`/seller/products/${productId}`, { price, stock, description });
  return response.data;
};

export const deleteProduct = async (productId) => {
  // Expected: productId as string, e.g., "67ed8f885b2e5327f9a9298e"
  if (!isAuthenticated()) throw { message: 'User must be logged in to delete a product', code: 401, isBigError: false };
  const response = await apiClient.delete(`/seller/products/${productId}`);
  return response.data;
};

// Seller Order Management API Calls
export const getSellerOrders = async () => {
  // No request body or params required
  if (!isAuthenticated()) throw { message: 'User must be logged in to view orders', code: 401, isBigError: false };
  const response = await apiClient.get('/seller/orders');
  return response.data;
};

export const getOrderById = async (orderId) => {
  // Expected: orderId as string, e.g., "67eedcf8c2c643224aa2588b"
  if (!isAuthenticated()) throw { message: 'User must be logged in to view an order', code: 401, isBigError: false };
  const response = await apiClient.get(`/seller/order/${orderId}`);
  return response.data;
};

export const updateOrderStatus = async (orderId, { status }) => {
  // Expected data structure:
  // {
  //   status: "Shipped" // "Processing", "Shipped", "Delivered"
  // }
  if (!isAuthenticated()) throw { message: 'User must be logged in to update order status', code: 401, isBigError: false };
  const response = await apiClient.put(`/seller/order/${orderId}/status`, { status });
  return response.data;
};

// Export wrapped functions
export default {
  createProduct: (productData) => apiRequest(() => createProduct(productData)),
  getSellerProducts: (params) => apiRequest(() => getSellerProducts(params)),
  updateProduct: (productId, productData) => apiRequest(() => updateProduct(productId, productData)),
  deleteProduct: (productId) => apiRequest(() => deleteProduct(productId)),
  getSellerOrders: () => apiRequest(() => getSellerOrders()),
  getOrderById: (orderId) => apiRequest(() => getOrderById(orderId)),
  updateOrderStatus: (orderId, statusData) => apiRequest(() => updateOrderStatus(orderId, statusData)),
};