import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Alert from './Alert';
import LoadingAnimation from '../function/LoadingAnimation';

const UserProfile = () => {
  const { user, profile, updateProfile, deleteProfile, isAuthenticated, isAuthChecked } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    profileImage: '',
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        email: profile.email || '',
        name: profile.name || '',
        phone: profile.phone || '',
        profileImage: profile.profileImage || '',
      });
      setImagePreview(profile.profileImage || '');
    }
  }, [profile]);

  if (!isAuthChecked) return <LoadingAnimation />;
  if (!isAuthenticated()) return <Navigate to="/login" replace />;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setAlert(null);
    setImagePreview(URL.createObjectURL(file));

    try {
      const formDataImage = new FormData();
      formDataImage.append('media', file);
      const uploadResponse = await fetch('http://localhost:3000/api/media/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('AdminToken')}`,
        },
        body: formDataImage,
      });

      const uploadData = await uploadResponse.json();

      if (uploadData.success) {
        const newProfileImage = uploadData.data[0].url;
        const updatedData = { ...formData, profileImage: newProfileImage };
        await updateProfile(updatedData);
        setFormData(updatedData);
        setAlert({ type: 'success', message: 'Profile image updated successfully!' });
      } else {
        throw new Error('Image upload failed');
      }
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
      setImagePreview(formData.profileImage || '');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      await updateProfile(formData);
      setAlert({ type: 'success', message: 'Profile updated successfully!' });
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your profile? This action is irreversible.')) return;
    setLoading(true);
    setAlert(null);
    try {
      await deleteProfile();
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[#0F1A1C] px-4 py-10 flex items-center justify-center"
    >
      <div className="w-full max-w-3xl bg-[#1A2526] rounded-2xl shadow-xl p-6 md:p-10 space-y-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center">My Profile</h2>

        <AnimatePresence>
          {alert && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Image */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-28 h-28 md:w-36 md:h-36">
            <img
              src={imagePreview || 'https://via.placeholder.com/150?text=User'}
              alt="Profile"
              className="w-full h-full object-cover rounded-full border-4 border-teal-500 shadow-md"
            />
            <label
              htmlFor="profileImage"
              className="absolute bottom-0 right-0 p-2 bg-teal-600 hover:bg-teal-700 text-white rounded-full cursor-pointer transition-colors"
            >
              <Upload size={16} />
              <input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-sm text-gray-400">{user?.name} ({user?.role})</p>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleUpdate} className="space-y-5">
          {['email', 'name', 'phone'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-300 mb-1 capitalize">
                {field}
              </label>
              <input
                type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 md:py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              />
            </div>
          ))}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full py-2 md:py-3 rounded-lg bg-teal-500 text-white font-semibold hover:bg-teal-600 transition-all"
          >
            Update Profile
          </motion.button>
        </form>

        {/* Delete Account */}
        <div className="border-t border-gray-700 pt-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleDelete}
            className="w-full py-2 md:py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-all"
          >
            Delete Account
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default UserProfile;
