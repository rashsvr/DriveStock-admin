import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import sharedApi from '../../services/sharedApi';
import Alert from './Alert';
import LoadingAnimation from '../function/LoadingAnimation';

const AdminProfile = () => {
  const { user } = useContext(AuthContext); // Get initial user data
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', password: '', profileImage: '' });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await sharedApi.getProfile();
      const fullProfile = data.data;
      setProfile(fullProfile);
      setFormData({
        name: fullProfile.name || '',
        phone: fullProfile.phone || '',
        password: '',
        profileImage: fullProfile.profileImage || '',
      });
      // Update localStorage with full profile data
      localStorage.setItem('user', JSON.stringify({
        userId: fullProfile._id,
        role: fullProfile.role,
        email: fullProfile.email,
        name: fullProfile.name,
        phone: fullProfile.phone,
      }));
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('media', file);
      const response = await sharedApi.uploadMedia(formData);
      setFormData((prev) => ({ ...prev, profileImage: response.data[0].url }));
      setAlert({ type: 'success', message: 'Profile image uploaded successfully' });
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      const updatedProfile = await sharedApi.updateProfile(formData);
      setAlert({ type: 'success', message: 'Profile updated successfully' });
      setProfile(updatedProfile.data);
      localStorage.setItem('user', JSON.stringify({
        userId: updatedProfile.data._id,
        role: updatedProfile.data.role,
        email: updatedProfile.data.email,
        name: updatedProfile.data.name,
        phone: updatedProfile.data.phone,
      }));
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to deactivate your profile?')) return;
    setLoading(true);
    try {
      await sharedApi.deleteProfile();
      setAlert({ type: 'success', message: 'Profile deactivated. Logging out...' });
      setTimeout(() => window.location.href = '/login', 2000);
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingAnimation />;
  if (!user) return <div>Please log in to view your profile.</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Email (Read-only)</label>
            <input
              type="email"
              value={user.email}
              className="input input-bordered w-full"
              disabled
            />
          </div>
          <div>
            <label className="label">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label className="label">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label className="label">New Password (Optional)</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Leave blank to keep current"
            />
          </div>
          <div>
            <label className="label">Profile Image</label>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/jpeg,image/png"
              className="file-input file-input-bordered w-full"
            />
            {formData.profileImage && (
              <img src={formData.profileImage} alt="Profile" className="mt-2 w-32 h-32 object-cover rounded" />
            )}
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-4">
          Update Profile
        </button>
        <button type="button" onClick={handleDelete} className="btn btn-error mt-4 ml-4">
          Deactivate Profile
        </button>
      </form>
    </div>
  );
};

export default AdminProfile;