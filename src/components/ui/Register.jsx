import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Alert from './Alert';
import LoadingAnimation from '../function/LoadingAnimation';

const Register = () => {
  const { register, isAuthenticated, isAuthChecked } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthChecked) return <LoadingAnimation />;

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      const { data } = await register({ ...formData, role: 'seller' });
      setAlert({ type: 'success', message: 'Registration successful!' });
      setTimeout(() => {
        navigate('/dashboard/analytics');
      }, 1000);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Registration failed.' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingAnimation />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A2526] px-4">
      <div className="w-full max-w-md rounded-2xl shadow-2xl bg-[#121D1E] p-8 space-y-6">
        <h2 className="text-3xl font-semibold text-center text-white">
          Seller Registration
        </h2>
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full input input-bordered bg-[#1F2D2E] text-white border-gray-600 focus:border-highlight-teal"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full input input-bordered bg-[#1F2D2E] text-white border-gray-600 focus:border-highlight-teal"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full input input-bordered bg-[#1F2D2E] text-white border-gray-600 focus:border-highlight-teal"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full input input-bordered bg-[#1F2D2E] text-white border-gray-600 focus:border-highlight-teal"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full btn bg-highlight-orange text-black hover:bg-teal-400 transition-colors"
          >
            Register
          </button>
        </form>
        <p className="text-center text-sm text-gray-400">
          Already have an account?{' '}
          <a href="/login" className="text-highlight-blue hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;