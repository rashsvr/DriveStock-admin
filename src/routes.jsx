import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { LoadingWrapper } from './components/function/LoadingWrapper'; // Changed to named import
import Login from './components/ui/Login';
import Register from './components/ui/Register';
import Dashboard from './components/ui/Dashboard';
import ErrorPage from './components/ui/ErrorPage';
import LoadingAnimation from './components/function/LoadingAnimation';

const AdminAdmins = () => <div>Manage Admins</div>;
const AdminCouriers = () => <div>Manage Couriers</div>;
const AdminSellers = () => <div>Manage Sellers</div>;
const AdminBuyers = () => <div>Manage Buyers</div>;
const AdminCategories = () => <div>Manage Categories</div>;
const SellerProducts = () => <div>My Products</div>;
const SellerOrders = () => <div>My Orders</div>;
const BuyerProducts = () => <div>Browse Products</div>;
const BuyerCart = () => <div>Cart</div>;
const BuyerOrders = () => <div>My Orders</div>;
const CourierDeliveries = () => <div>My Deliveries</div>;

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <LoadingAnimation />;

  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <ErrorPage message="Access Denied" code={403} />;
  }

  return children;
};

const AppRoutes = () => {
  const { loading } = useContext(AuthContext);

  if (loading) return <LoadingAnimation />;

  return (
    <LoadingWrapper>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin', 'seller', 'buyer', 'courier']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admins"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Dashboard>
                <AdminAdmins />
              </Dashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/couriers"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Dashboard>
                <AdminCouriers />
              </Dashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/sellers"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Dashboard>
                <AdminSellers />
              </Dashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/buyers"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Dashboard>
                <AdminBuyers />
              </Dashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/categories"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Dashboard>
                <AdminCategories />
              </Dashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/products"
          element={
            <ProtectedRoute allowedRoles={['seller']}>
              <Dashboard>
                <SellerProducts />
              </Dashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/orders"
          element={
            <ProtectedRoute allowedRoles={['seller']}>
              <Dashboard>
                <SellerOrders />
              </Dashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/products"
          element={
            <ProtectedRoute allowedRoles={['buyer']}>
              <Dashboard>
                <BuyerProducts />
              </Dashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/cart"
          element={
            <ProtectedRoute allowedRoles={['buyer']}>
              <Dashboard>
                <BuyerCart />
              </Dashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/orders"
          element={
            <ProtectedRoute allowedRoles={['buyer']}>
              <Dashboard>
                <BuyerOrders />
              </Dashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/deliveries"
          element={
            <ProtectedRoute allowedRoles={['courier']}>
              <Dashboard>
                <CourierDeliveries />
              </Dashboard>
            </ProtectedRoute>
          }
        />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </LoadingWrapper>
  );
};

export default AppRoutes;