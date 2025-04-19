import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import Alert from './Alert';
import LoadingAnimation from '../function/LoadingAnimation';

const AdminCouriers = () => {
  const [couriers, setCouriers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [formData, setFormData] = useState({ email: '', password: '', name: '', phone: '', region: '' });
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const regions = [
    "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo",
    "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara",
    "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar",
    "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
    "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
  ];

  useEffect(() => {
    fetchCouriers();
  }, [pagination.page]);

  const fetchCouriers = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };
      const response = await adminApi.getAllCouriers(params);
      if (!response.success || !Array.isArray(response.data)) {
        throw new Error("Invalid couriers data received.");
      }
      console.log('Couriers:', response.data);
      setCouriers(response.data || []);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination.total,
      }));
    } catch (error) {
      setAlert({ 
        type: 'error', 
        message: error.message || "Failed to fetch couriers.",
        onClose: () => setAlert(null) 
      });
      setCouriers([]);
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

    const { email, name, phone, region, password } = formData;
    if (!email || !name || !phone || !region || (!editId && !password)) {
      setAlert({ type: 'error', message: 'All fields are required', onClose: () => setAlert(null) });
      setLoading(false);
      return;
    }

    try {
      if (editId) {
        const updateData = { email, name, phone, region };
        await adminApi.updateCourier(editId, updateData);
        setAlert({ type: 'success', message: 'Courier updated successfully', onClose: () => setAlert(null) });
      } else {
        await adminApi.createCourier(formData);
        setAlert({ type: 'success', message: 'Courier created successfully', onClose: () => setAlert(null) });
      }
      setPagination((prev) => ({ ...prev, page: 1 }));
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
      password: '',
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
      setPagination((prev) => ({ ...prev, page: 1 }));
      await fetchCouriers();
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Delete failed', onClose: () => setAlert(null) });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > Math.ceil(pagination.total / pagination.limit)) return;
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({ email: '', password: '', name: '', phone: '', region: '' });
  };

  if (loading) return <LoadingAnimation />;

  return (
    <div className="p-4 text-white min-h-screen" style={{ backgroundColor: '#1A2526' }}>
      <h2 className="text-2xl font-bold mb-4 text-blue-500">Manage Couriers</h2>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <button
        onClick={() => {
          resetForm();
          setModalOpen(true);
        }}
        className="btn btn-primary mb-4 bg-orange-500 border-none hover:bg-orange-600 w-full sm:w-auto"
      >
        Add Courier
      </button>

      {modalOpen && (
        <dialog open className="modal">
          <div className="modal-box bg-[#1A2526] text-white w-full max-w-md p-4 sm:p-6">
            <h3 className="font-bold text-lg mb-4">{editId ? 'Edit Courier' : 'Create Courier'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label text-white">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-gray-800 text-white placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500"
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
                    className="input input-bordered w-full bg-gray-800 text-white placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500"
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
                  className="input input-bordered w-full bg-gray-800 text-white placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500"
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
                  className="input input-bordered w-full bg-gray-800 text-white placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500"
                  required
                />
              </div>
              <div>
                <label className="label text-white">Region</label>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="select select-bordered w-full bg-gray-800 text-white focus:ring-teal-500 focus:border-teal-500"
                  required
                >
                  <option value="" disabled>Select a region</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-action flex flex-col sm:flex-row justify-between gap-2">
                <button type="submit" className="btn bg-teal-500 border-none hover:bg-teal-600 w-full sm:w-auto">
                  {editId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost text-white w-full sm:w-auto"
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
              <th className="text-left">Email</th>
              <th className="text-left">Name</th>
              <th className="text-left">Phone</th>
              <th className="text-left">Region</th>
              <th className="text-left">Status</th>
              <th className="text-left">Actions</th>
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
                  <td className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button
                      onClick={() => handleEdit(courier)}
                      className="btn btn-sm bg-blue-500 text-white hover:bg-blue-600 w-full sm:w-auto"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(courier._id)}
                      className="btn btn-sm btn-error text-white hover:bg-red-600 w-full sm:w-auto"
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

      {pagination.total > 0 && (
        <div className="flex flex-col sm:flex-row justify-center items-center mt-4 space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="btn bg-teal-500 border-none hover:bg-teal-600 text-white w-full sm:w-auto"
          >
            Previous
          </button>
          <span className="self-center text-white">
            Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
          </span>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
            className="btn bg-teal-500 border-none hover:bg-teal-600 text-white w-full sm:w-auto"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminCouriers;