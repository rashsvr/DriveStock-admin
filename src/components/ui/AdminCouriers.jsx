import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import Alert from './Alert';
import LoadingAnimation from '../function/LoadingAnimation';

const AdminCouriers = () => {
  const [couriers, setCouriers] = useState([]);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', phone: '', region: '' });
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchCouriers();
  }, []);

  const fetchCouriers = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getAllCouriers();
      console.log('Couriers:', response.data); // Debug log
      setCouriers(response.data || []);
    } catch (error) {
      setAlert({ type: 'error', message: error.message, onClose: () => setAlert(null) });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    // Validate form
    const { email, name, phone, region, password } = formData;
    if (!email || !name || !phone || !region || (!editId && !password)) {
      setAlert({ type: 'error', message: 'All fields are required', onClose: () => setAlert(null) });
      setLoading(false);
      return;
    }

    try {
      if (editId) {
        // Exclude password for updates
        const updateData = { email, name, phone, region };
        await adminApi.updateCourier(editId, updateData);
        setAlert({ type: 'success', message: 'Courier updated successfully', onClose: () => setAlert(null) });
      } else {
        await adminApi.createCourier(formData);
        setAlert({ type: 'success', message: 'Courier created successfully', onClose: () => setAlert(null) });
      }
      await fetchCouriers();
      setModalOpen(false);
      resetForm();
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Operation failed', onClose: () => setAlert(null) });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (courier) => {
    setEditId(courier._id);
    setFormData({
      email: courier.email,
      password: '', // Clear password for edit
      name: courier.name,
      phone: courier.phone,
      region: courier.region,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this courier?')) return;
    setLoading(true);
    setAlert(null);
    try {
      await adminApi.deleteCourier(id);
      setAlert({ type: 'success', message: 'Courier deleted successfully', onClose: () => setAlert(null) });
      await fetchCouriers();
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Delete failed', onClose: () => setAlert(null) });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({ email: '', password: '', name: '', phone: '', region: '' });
  };

  if (loading) return <LoadingAnimation />;

  return (
    <div className="p-4 text-white" style={{ backgroundColor: '#1A2526' }}>
      <h2 className="text-2xl font-bold mb-4 text-blue-500">Manage Couriers</h2>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <button
        onClick={() => {
          resetForm();
          setModalOpen(true);
        }}
        className="btn btn-primary mb-4 bg-orange-500 border-none hover:bg-orange-600"
      >
        Add Courier
      </button>

      {/* Modal */}
      {modalOpen && (
        <dialog open className="modal">
          <div className="modal-box bg-[#1A2526] text-white">
            <h3 className="font-bold text-lg mb-4">{editId ? 'Edit Courier' : 'Create Courier'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label text-white">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input input-bordered w-full text-black"
                  required
                />
              </div>
              {!editId && (
                <div>
                  <label className="label text-white">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input input-bordered w-full text-black"
                    required
                  />
                </div>
              )}
              <div>
                <label className="label text-white">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input input-bordered w-full text-black"
                  required
                />
              </div>
              <div>
                <label className="label text-white">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input input-bordered w-full text-black"
                  required
                />
              </div>
              <div>
                <label className="label text-white">Region</label>
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="input input-bordered w-full text-black"
                  required
                />
              </div>
              <div className="modal-action flex justify-between">
                <button type="submit" className="btn bg-teal-500 border-none hover:bg-teal-600">
                  {editId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost text-white"
                  onClick={() => {
                    setModalOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}

      <div className="overflow-x-auto rounded-md">
        <table className="table w-full table-zebra bg-[#1A2526] text-white">
          <thead className="text-blue-500">
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Region</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {couriers.length > 0 ? (
              couriers.map((courier) => (
                <tr key={courier._id}>
                  <td>{courier.email}</td>
                  <td>{courier.name}</td>
                  <td>{courier.phone}</td>
                  <td>{courier.region}</td>
                  <td>{courier.status || 'N/A'}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(courier)}
                      className="btn btn-sm bg-blue-500 text-white mr-2 hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(courier._id)}
                      className="btn btn-sm btn-error text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-gray-400">
                  No couriers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCouriers;