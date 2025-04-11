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
        setEditId(null);
      } else {
        await adminApi.createCourier(formData);
        setAlert({ type: 'success', message: 'Courier created successfully' });
      }
      fetchCouriers();
      setFormData({ email: '', password: '', name: '', phone: '', region: '' });
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (courier) => {
    setEditId(courier._id);
    setFormData({ email: courier.email, password: '', name: courier.name, phone: courier.phone, region: courier.region });
  };

  const handleDelete = async (courierId) => {
    if (!window.confirm('Are you sure you want to delete this courier?')) return;
    setLoading(true);
    try {
      await adminApi.deleteCourier(courierId);
      setAlert({ type: 'success', message: 'Courier deleted successfully' });
      fetchCouriers();
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingAnimation />;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Couriers</h2>
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
            disabled={editId} // Disable password on edit
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
          <input
            type="text"
            name="region"
            value={formData.region}
            onChange={handleChange}
            placeholder="Region"
            className="input input-bordered w-full"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-4">
          {editId ? 'Update Courier' : 'Create Courier'}
        </button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setFormData({ email: '', password: '', name: '', phone: '', region: '' });
            }}
            className="btn btn-ghost mt-4 ml-2"
          >
            Cancel
          </button>
        )}
      </form>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
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
                  <button
                    onClick={() => handleEdit(courier)}
                    className="btn btn-warning btn-sm mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(courier._id)}
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

export default AdminCouriers;