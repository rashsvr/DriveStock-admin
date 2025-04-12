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

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
    if (!window.confirm('Are you sure you want to delete your profile? This cannot be undone.')) {
      return;
    }
    setLoading(true);
    setAlert(null);
    try {
      await deleteProfile();
      // deleteProfile triggers logout in AuthContext.jsx, so no redirect needed here
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to delete profile.' });
      setLoading(false);
    }
  };

  if (loading) return <LoadingAnimation />;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">My Profile</h2>
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      <div className="bg-[#121D1E] rounded-2xl shadow-2xl p-8 max-w-md">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
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
            <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
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
            <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
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
            disabled={loading}
          >
            Update Profile
          </button>
        </form>
        <div className="mt-6">
          <button
            onClick={handleDelete}
            className="w-full btn bg-red-600 text-white hover:bg-red-700 transition-colors"
            disabled={loading}
          >
            Delete Profile
          </button>
        </div>
      </div>
      <p className="mt-4 text-gray-400">Role: {user?.role.toUpperCase()}</p>
    </div>
  );
};

export default UserProfile;