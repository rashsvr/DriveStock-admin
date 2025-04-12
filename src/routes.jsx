import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { LoadingWrapper } from './components/function/LoadingWrapper';
import Login from './components/ui/Login';
import Register from './components/ui/Register';
import Dashboard from './components/ui/Dashboard';
import ErrorPage from './components/ui/ErrorPage';
import AdminAdmins from './components/ui/AdminAdmins';
import AdminCouriers from './components/ui/AdminCouriers';
import AdminSellers from './components/ui/AdminSellers';
import AdminBuyers from './components/ui/AdminBuyers';
import AdminCategories from './components/ui/AdminCategories';
import AdminOrders from './components/ui/AdminOrders';
import AdminProducts from './components/ui/AdminProducts';
import UserProfile from './components/ui/UserProfile';
import AdminAnalytics from './components/ui/AdminAnalytics';
import SellerProducts from './components/ui/SellerProducts';
import SellerOrders from './components/ui/SellerOrders';
import SellerAnalytics from './components/ui/SellerAnalytics';
import CourierDeliveries from './components/ui/CourierDeliveries';
import CourierAnalytics from './components/ui/CourierAnalytics';
import LoadingAnimation from './components/function/LoadingAnimation';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthChecked } = useAuth();

  if (!isAuthChecked) return <LoadingAnimation />;

  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) {
    if (user.role === 'buyer') {
      return (
        <ErrorPage
          message="You are a Customer. Please use the relevant site: http://localhost:5173"
          code={403}
          redirectUrl="http://localhost:5173"
        />
      );
    }
    return <ErrorPage message="Access Denied" code={403} />;
  }

  return children;
};

const AnalyticsRoute = () => {
  const { user } = useAuth();
  const analyticsComponents = {
    admin: AdminAnalytics,
    seller: SellerAnalytics,
    courier: CourierAnalytics,
  };
  const Component = analyticsComponents[user?.role] || ErrorPage;
  return (
    <ProtectedRoute allowedRoles={['admin', 'seller', 'courier']}>
      <Dashboard>
        <Component
          {...(Component === ErrorPage && {
            message: 'Invalid Role',
            code: 403,
          })}
        />
      </Dashboard>
    </ProtectedRoute>
  );
};

const AppRoutes = () => {
  const { isAuthChecked } = useAuth();

  if (!isAuthChecked) return <LoadingAnimation />;

  return (
    <LoadingWrapper>
      <Routes>
        <Route path="/login" element={<Login />} id="login" />
        <Route path="/register" element={<Register />} id="register" />
        {/* Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin', 'seller', 'courier']}>
              <Dashboard />
            </ProtectedRoute>
          }
          id="dashboard"
        />
        <Route path="/dashboard/analytics" element={<AnalyticsRoute />} id="analytics" />
        <Route
          path="/dashboard/admins"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Dashboard>
                <AdminAdmins />
              </Dashboard>
            </ProtectedRoute>
          }
          id="admin-admins"
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
          id="admin-couriers"
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
          id="admin-sellers"
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
          id="admin-buyers"
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
          id="admin-categories"
        />
        <Route
          path="/dashboard/orders"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Dashboard>
                <AdminOrders />
              </Dashboard>
            </ProtectedRoute>
          }
          id="admin-orders"
        />
        <Route
          path="/dashboard/products"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Dashboard>
                <AdminProducts />
              </Dashboard>
            </ProtectedRoute>
          }
          id="admin-products"
        />
        <Route
          path="/dashboard/profile"
          element={
            <ProtectedRoute allowedRoles={['admin', 'seller', 'courier']}>
              <Dashboard>
                <UserProfile />
              </Dashboard>
            </ProtectedRoute>
          }
          id="profile"
        />
        <Route
          path="/dashboard/seller-products"
          element={
            <ProtectedRoute allowedRoles={['seller']}>
              <Dashboard>
                <SellerProducts />
              </Dashboard>
            </ProtectedRoute>
          }
          id="seller-products"
        />
        <Route
          path="/dashboard/seller-orders"
          element={
            <ProtectedRoute allowedRoles={['seller']}>
              <Dashboard>
                <SellerOrders />
              </Dashboard>
            </ProtectedRoute>
          }
          id="seller-orders"
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
          id="courier-deliveries"
        />
        <Route path="/error" element={<ErrorPage />} id="error" />
        <Route path="/" element={<Navigate to="/login" replace />} id="root" />
        <Route path="*" element={<ErrorPage message="Page Not Found" code={404} />} id="not-found" />
      </Routes>
    </LoadingWrapper>
  );
};

export default AppRoutes;