import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import Alert from './Alert';
import LoadingAnimation from '../function/LoadingAnimation';

const AdminAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', phone: '' });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAllAdmins();
      setAdmins(data.data);
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      await adminApi.createAdmin(formData);
      setAlert({ type: 'success', message: 'Admin created successfully' });
      fetchAdmins();
      setFormData({ email: '', password: '', name: '', phone: '' });
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (adminId) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) return;
    setLoading(true);
    try {
      await adminApi.deleteAdmin(adminId);
      setAlert({ type: 'success', message: 'Admin deleted successfully' });
      fetchAdmins();
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingAnimation />;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Admins</h2>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="input input-bordered w-full"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="input input-bordered w-full"
            required
          />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="input input-bordered w-full"
            required
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="input input-bordered w-full"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-4">
          Create Admin
        </button>
      </form>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin._id}>
                <td>{admin.email}</td>
                <td>{admin.name}</td>
                <td>{admin.phone}</td>
                <td>{admin.status}</td>
                <td>
                  <button
                    onClick={() => handleDelete(admin._id)}
                    className="btn btn-error btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAdmins;