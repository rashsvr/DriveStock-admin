import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import Alert from './Alert';
import LoadingAnimation from '../function/LoadingAnimation';

const AdminAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', phone: '' });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAllAdmins();
      setAdmins(res.data);
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setFormData({ email: '', password: '', name: '', phone: '' });
    setIsEditing(false);
    setModalOpen(true);
  };

  const openEditModal = (admin) => {
    setFormData({ email: admin.email, name: admin.name, phone: admin.phone, password: '' });
    setIsEditing(true);
    setEditId(admin._id);
    setModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      if (isEditing) {
        await adminApi.updateAdmin(editId, formData);
        setAlert({ type: 'success', message: 'Admin updated successfully' });
      } else {
        await adminApi.createAdmin(formData);
        setAlert({ type: 'success', message: 'Admin created successfully' });
      }
      fetchAdmins();
      setModalOpen(false);
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) return;
    setLoading(true);
    try {
      await adminApi.deleteAdmin(id);
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
    <div className="p-4 text-white" style={{ backgroundColor: '#1A2526' }}>
      <h2 className="text-2xl font-bold mb-4 text-highlight-blue">Manage Admins</h2>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <button
        onClick={openCreateModal}
        className="btn btn-primary mb-4 bg-highlight-orange border-none"
      >
        Add Admin
      </button>

      {/* Modal */}
      {modalOpen && (
        <dialog open className="modal">
          <div className="modal-box bg-[#1A2526] text-white">
            <h3 className="font-bold text-lg mb-4">{isEditing ? 'Edit Admin' : 'Create Admin'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              {!isEditing && (
                <div>
                  <label className="label">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
              )}
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
              <div className="modal-action flex justify-between">
                <button type="submit" className="btn bg-highlight-teal border-none">
                  {isEditing ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}

      <div className="overflow-x-auto rounded-md">
        <table className="table w-full table-zebra">
          <thead className="text-highlight-blue">
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
                    onClick={() => openEditModal(admin)}
                    className="btn btn-sm bg-highlight-blue text-white mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(admin._id)}
                    className="btn btn-sm btn-error text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {admins.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-gray-400">
                  No admins found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAdmins;
