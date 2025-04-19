import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Alert from './Alert';
import LoadingAnimation from '../function/LoadingAnimation';

const Login = () => {
  const { login, isAuthenticated, isAuthChecked } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthChecked) return <LoadingAnimation />;

  if (isAuthenticated()) {
    return <Navigate to="/dashboard/analytics" replace />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      const { data } = await login({ email: formData.email, password: formData.password });
      setAlert({ type: 'success', message: 'Login successful!' });
      setTimeout(() => {
        // Redirect to analytics for admin, seller, courier
        navigate('/dashboard/analytics');
      }, 1000);
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.message || 'Login failed. Please check your email and password.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingAnimation />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A2526] px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-2xl shadow-2xl bg-[#121D1E] p-6 sm:p-8 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center text-white">Welcome Back</h2>
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full input input-bordered bg-gray-800 text-white placeholder-gray-400 border-gray-600 focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full input input-bordered bg-gray-800 text-white placeholder-gray-400 border-gray-600 focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full btn bg-orange-500 border-none hover:bg-orange-600 text-white transition-colors"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-500 hover:underline">
            Register (Sellers Only)
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;