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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin', 'seller', 'courier']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/dashboard/analytics" element={<AnalyticsRoute />} />
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
          path="/dashboard/profile"
          element={
            <ProtectedRoute allowedRoles={['admin', 'seller', 'courier']}>
              <Dashboard>
                <UserProfile />
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
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<ErrorPage message="Page Not Found" code={404} />} />
      </Routes>
    </LoadingWrapper>
  );
};

export default AppRoutes;