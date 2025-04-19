import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import sharedApi from '../services/sharedApi';
import adminApi from '../services/adminApi';
import sellerApi from '../services/sellerApi';
import courierApi from '../services/courierApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('AdminToken');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    } else {
      localStorage.removeItem('AdminToken');
      localStorage.removeItem('user');
      setUser(null);
    }
    setIsAuthChecked(true);
  }, []);

  const handleAuthError = () => {
    localStorage.removeItem('AdminToken');
    localStorage.removeItem('user');
    setUser(null);
    queryClient.clear();
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  };

  const loginMutation = useMutation({
    mutationFn: sharedApi.login,
    onSuccess: (data) => {
      localStorage.setItem('AdminToken', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
      setUser(data.data);
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      if (error.code === 401) {
        handleAuthError();
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: sharedApi.register,
    onSuccess: (data) => {
      localStorage.setItem('AdminToken', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
      setUser(data.data);
      queryClient.invalidateQueries();
      localStorage.removeItem('AdminToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    },
    onError: (error) => {
      if (error.code === 401) {
        handleAuthError();
      }
    },
  });

  const logout = () => {
    sharedApi.logout();
    setUser(null);
    queryClient.clear();
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  };

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: sharedApi.getProfile,
    enabled: sharedApi.isAuthenticated() && !!user,
    onError: (error) => {
      if (error.code === 401) {
        handleAuthError();
      }
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: sharedApi.updateProfile,
    onMutate: async (profileData) => {
      await queryClient.cancelQueries(['profile']);
      const previousProfile = queryClient.getQueryData(['profile']);
      queryClient.setQueryData(['profile'], (old) => ({
        ...old,
        data: { ...old.data, ...profileData },
      }));
      return { previousProfile };
    },
    onError: (err, newData, context) => {
      queryClient.setQueryData(['profile'], context.previousProfile);
      if (err.code === 401) {
        handleAuthError();
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(['profile']);
    },
  });

  const deleteProfileMutation = useMutation({
    mutationFn: sharedApi.deleteProfile,
    onSuccess: () => {
      logout();
    },
    onError: (error) => {
      if (error.code === 401) {
        handleAuthError();
      }
    },
  });

  const deleteAdminMutation = useMutation({
    mutationFn: adminApi.deleteAdmin,
    onMutate: async (adminId) => {
      await queryClient.cancelQueries(['admins']);
      const previousAdmins = queryClient.getQueryData(['admins']);
      queryClient.setQueryData(['admins'], (old) => ({
        ...old,
        data: old.data.filter((admin) => admin._id !== adminId),
      }));
      return { previousAdmins };
    },
    onError: (err, adminId, context) => {
      queryClient.setQueryData(['admins'], context.previousAdmins);
      if (err.code === 401) {
        handleAuthError();
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(['admins']);
    },
  });

  const deleteCourierMutation = useMutation({
    mutationFn: adminApi.deleteCourier,
    onMutate: async (courierId) => {
      await queryClient.cancelQueries(['couriers']);
      const previousCouriers = queryClient.getQueryData(['couriers']);
      queryClient.setQueryData(['couriers'], (old) => ({
        ...old,
        data: old.data.filter((courier) => courier._id !== courierId),
      }));
      return { previousCouriers };
    },
    onError: (err, courierId, context) => {
      queryClient.setQueryData(['couriers'], context.previousCouriers);
      if (err.code === 401) {
        handleAuthError();
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(['couriers']);
    },
  });

  const deleteSellerMutation = useMutation({
    mutationFn: adminApi.deleteSeller,
    onMutate: async (sellerId) => {
      await queryClient.cancelQueries(['sellers']);
      const previousSellers = queryClient.getQueryData(['sellers']);
      queryClient.setQueryData(['sellers'], (old) => ({
        ...old,
        data: old.data.filter((seller) => seller._id !== sellerId),
      }));
      return { previousSellers };
    },
    onError: (err, sellerId, context) => {
      queryClient.setQueryData(['sellers'], context.previousSellers);
      if (err.code === 401) {
        handleAuthError();
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(['sellers']);
    },
  });

  const deleteBuyerMutation = useMutation({
    mutationFn: adminApi.deleteBuyer,
    onMutate: async (buyerId) => {
      await queryClient.cancelQueries(['buyers']);
      const previousBuyers = queryClient.getQueryData(['buyers']);
      queryClient.setQueryData(['buyers'], (old) => ({
        ...old,
        data: old.data.filter((buyer) => buyer._id !== buyerId),
      }));
      return { previousBuyers };
    },
    onError: (err, buyerId, context) => {
      queryClient.setQueryData(['buyers'], context.previousBuyers);
      if (err.code === 401) {
        handleAuthError();
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(['buyers']);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: adminApi.deleteCategory,
    onMutate: async (categoryId) => {
      await queryClient.cancelQueries(['categories']);
      const previousCategories = queryClient.getQueryData(['categories']);
      queryClient.setQueryData(['categories'], (old) => ({
        ...old,
        data: old.data.filter((category) => category._id !== categoryId),
      }));
      return { previousCategories };
    },
    onError: (err, categoryId, context) => {
      queryClient.setQueryData(['categories'], context.previousCategories);
      if (err.code === 401) {
        handleAuthError();
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(['categories']);
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: sellerApi.deleteProduct,
    onMutate: async (productId) => {
      await queryClient.cancelQueries(['products']);
      const previousProducts = queryClient.getQueryData(['products']);
      queryClient.setQueryData(['products'], (old) => ({
        ...old,
        data: old.data.filter((product) => product._id !== productId),
      }));
      return { previousProducts };
    },
    onError: (err, productId, context) => {
      queryClient.setQueryData(['products'], context.previousProducts);
      if (err.code === 401) {
        handleAuthError();
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(['products']);
    },
  });

  const value = {
    user,
    isAuthChecked,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
    isAuthenticated: sharedApi.isAuthenticated,
    profile: profileQuery.data?.data,
    updateProfile: updateProfileMutation.mutateAsync,
    deleteProfile: deleteProfileMutation.mutateAsync,
    getAllAdmins: () => queryClient.fetchQuery(['admins'], adminApi.getAllAdmins),
    createAdmin: adminApi.createAdmin,
    deleteAdmin: deleteAdminMutation.mutateAsync,
    getAllCouriers: () => queryClient.fetchQuery(['couriers'], adminApi.getAllCouriers),
    createCourier: adminApi.createCourier,
    updateCourier: adminApi.updateCourier,
    deleteCourier: deleteCourierMutation.mutateAsync,
    getPendingSellers: () => queryClient.fetchQuery(['pendingSellers'], adminApi.getPendingSellers),
    getAllSellers: () => queryClient.fetchQuery(['sellers'], adminApi.getAllSellers),
    approveSeller: adminApi.approveSeller,
    deleteSeller: deleteSellerMutation.mutateAsync,
    getAllBuyers: () => queryClient.fetchQuery(['buyers'], adminApi.getAllBuyers),
    deleteBuyer: deleteBuyerMutation.mutateAsync,
    getAllCategories: () => queryClient.fetchQuery(['categories'], adminApi.getAllCategories),
    createCategory: adminApi.createCategory,
    updateCategory: adminApi.updateCategory,
    deleteCategory: deleteCategoryMutation.mutateAsync,
    getAllOrders: (params) => queryClient.fetchQuery(['orders', params], () => adminApi.getAllOrders(params)),
    getAllProducts: (params) => queryClient.fetchQuery(['products', params], () => adminApi.getAllProducts(params)),
    getAdminAnalytics: () => queryClient.fetchQuery(['adminAnalytics'], adminApi.getAnalytics),
    createProduct: sellerApi.createProduct,
    getSellerProducts: (params) => queryClient.fetchQuery(['products', params], () => sellerApi.getSellerProducts(params)),
    updateProduct: sellerApi.updateProduct,
    deleteProduct: deleteProductMutation.mutateAsync,
    getSellerOrders: (params) => queryClient.fetchQuery(['sellerOrders', params], () => sellerApi.getSellerOrders(params)),
    getOrderById: (orderId) => queryClient.fetchQuery(['order', orderId], () => sellerApi.getOrderById(orderId)),
    updateOrderStatus: sellerApi.updateOrderStatus,
    cancelOrder: sellerApi.cancelOrder,
    getSellerAnalytics: () => queryClient.fetchQuery(['sellerAnalytics'], sellerApi.getAnalytics),
    getAssignedOrders: (params) => queryClient.fetchQuery(['courierOrders', params], () => courierApi.getAssignedOrders(params)),
    getCourierOrderById: (orderId) => queryClient.fetchQuery(['courierOrder', orderId], () => courierApi.getOrderById(orderId)),
    updateCourierOrderStatus: courierApi.updateOrderStatus,
    reportDeliveryIssue: courierApi.reportDeliveryIssue,
    getCourierAnalytics: () => queryClient.fetchQuery(['courierAnalytics'], courierApi.getAnalytics),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};