import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Alert from './Alert';
import LoadingAnimation from '../function/LoadingAnimation';

const UserProfile = () => {
  const { user, profile, updateProfile, deleteProfile, isAuthenticated, isAuthChecked } = useAuth();
  const [formData, setFormData] = useState({
    email: profile?.email || '',
    name: profile?.name || '',
    phone: profile?.phone || '',
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthChecked) return <LoadingAnimation />;
  if (!isAuthenticated()) return <Navigate to="/login" replace />;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      await updateProfile(formData);
      setAlert({ type: 'success', message: 'Profile updated successfully!' });
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your profile? This cannot be undone.')) return;
    setLoading(true);
    setAlert(null);
    try {
      await deleteProfile();
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to delete profile.' });
      setLoading(false);
    }
  };

  if (loading) return <LoadingAnimation />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-[#1A2526]">
      <div className="w-full max-w-md space-y-6">
        <h2 className="text-3xl font-semibold text-white text-center">My Profile</h2>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <div className="bg-[#121D1E] rounded-2xl shadow-xl p-6 space-y-6">
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-[#1F2D2E] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-highlight-teal"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-[#1F2D2E] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-highlight-teal"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-[#1F2D2E] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-highlight-teal"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-highlight-orange text-black font-semibold hover:bg-teal-400 transition-colors"
              disabled={loading}
            >
              Update Profile
            </button>
          </form>

          <div className="pt-2 border-t border-gray-700">
            <button
              onClick={handleDelete}
              className="w-full py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
              disabled={loading}
            >
              Delete Profile
            </button>
          </div>
        </div>

    
      </div>
    </div>
  );
};

export default UserProfile;
