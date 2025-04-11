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
      const data = await adminApi.getAllCouriers();
      setCouriers(data.data);
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
      if (editId) {
        await adminApi.updateCourier(editId, formData);
        setAlert({ type: 'success', message: 'Courier updated successfully' });
      } else {
        await adminApi.createCourier(formData);
        setAlert({ type: 'success', message: 'Courier created successfully' });
      }
      fetchCouriers();
      resetForm();
      setModalOpen(false);
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (courier) => {
    setEditId(courier._id);
    setFormData({ email: courier.email, password: '', name: courier.name, phone: courier.phone, region: courier.region });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this courier?')) return;
    setLoading(true);
    try {
      await adminApi.deleteCourier(id);
      setAlert({ type: 'success', message: 'Courier deleted successfully' });
      fetchCouriers();
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
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
      <h2 className="text-2xl font-bold mb-4 text-highlight-blue">Manage Couriers</h2>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <button onClick={() => { resetForm(); setModalOpen(true); }} className="btn btn-primary mb-4 bg-highlight-orange border-none">
        Add Courier
      </button>

      {/* Modal */}
      {modalOpen && (
        <dialog open className="modal">
          <div className="modal-box bg-[#1A2526] text-white">
            <h3 className="font-bold text-lg mb-4">{editId ? 'Edit Courier' : 'Create Courier'}</h3>
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
              <div>
                <label className="label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  disabled={editId}
                  required={!editId}
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
                <label className="label">Region</label>
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="modal-action flex justify-between">
                <button type="submit" className="btn bg-highlight-teal border-none">
                  {editId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
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
        <table className="table w-full table-zebra">
          <thead className="text-highlight-blue">
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
            {couriers.map((courier) => (
              <tr key={courier._id}>
                <td>{courier.email}</td>
                <td>{courier.name}</td>
                <td>{courier.phone}</td>
                <td>{courier.region}</td>
                <td>{courier.status}</td>
                <td>
                  <button onClick={() => handleEdit(courier)} className="btn btn-sm bg-highlight-blue text-white mr-2">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(courier._id)} className="btn btn-sm btn-error text-white">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {couriers.length === 0 && (
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
