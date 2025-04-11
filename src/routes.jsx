import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
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
import AdminProfile from './components/ui/AdminProfile';
import AdminAnalytics from './components/ui/AdminAnalytics';
import LoadingAnimation from './components/function/LoadingAnimation';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <LoadingAnimation />;

  console.log('ProtectedRoute check:', { user, allowedRoles }); // Debug log

  if (!user) return <Navigate to="/login" />;

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
            <ProtectedRoute allowedRoles={['admin']}>
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
          path="/dashboard/profile"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Dashboard>
                <AdminProfile />
              </Dashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/analytics"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Dashboard>
                <AdminAnalytics />
              </Dashboard>
            </ProtectedRoute>
          }
        />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<ErrorPage message="Page Not Found" code={404} />} />
      </Routes>
    </LoadingWrapper>
  );
};

export default AppRoutes;