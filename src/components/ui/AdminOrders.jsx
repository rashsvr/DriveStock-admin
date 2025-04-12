import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import Alert from './Alert';
import LoadingAnimation from '../function/LoadingAnimation';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    district: '',
    startDate: '',
    endDate: '',
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {
        status: filters.status || undefined,
        district: filters.district || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
      };
      const response = await adminApi.getAllOrders(params);
      setOrders(response.data);
    } catch (error) {
      setAlert({ type: 'error', message: error.message, onClose: () => setAlert(null) });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const resetFilters = () => {
    setFilters({ status: '', district: '', startDate: '', endDate: '' });
    fetchOrders();
  };

  if (loading) return <LoadingAnimation />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Orders</h2>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Filters */}
      <form onSubmit={applyFilters} className="mb-6 bg-[#1A2526] p-4 rounded-lg text-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="label text-sm">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="select select-bordered w-full text-black"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="label text-sm">District</label>
            <input
              type="text"
              name="district"
              value={filters.district}
              onChange={handleFilterChange}
              placeholder="Enter district"
              className="input input-bordered w-full text-black"
            />
          </div>
          <div>
            <label className="label text-sm">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="input input-bordered w-full text-black"
            />
          </div>
          <div>
            <label className="label text-sm">End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="input input-bordered w-full text-black"
            />
          </div>
        </div>
        <div className="mt-4 flex space-x-2">
          <button type="submit" className="btn btn-primary">
            Apply Filters
          </button>
          <button type="button" onClick={resetFilters} className="btn btn-ghost">
            Reset
          </button>
        </div>
      </form>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="table w-full bg-[#1A2526] text-white">
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>District</th>
              <th>Date</th>
              <th>Total Amount</th>
              <th>Buyer ID</th>
              <th>Seller ID</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.status}</td>
                  <td>{order.district || 'N/A'}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    {order.totalAmount
                      ? `$${order.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                      : 'N/A'}
                  </td>
                  <td>{order.buyerId?._id || 'N/A'}</td>
                  <td>{order.sellerId?._id || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-gray-400">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;