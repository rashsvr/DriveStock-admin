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
      // Clean filters: only include non-empty values
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.district) params.district = filters.district;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      console.log('Fetching orders with params:', params); // Debug log
      const response = await adminApi.getAllOrders(params);
      console.log('Orders response:', response.data); // Debug log
      setOrders(response.data || []);
    } catch (error) {
      const status = error.code || error.response?.status;
      const messages = {
        400: 'Invalid filter parameters provided.',
        401: 'Unauthorized: Please log in.',
        403: 'Forbidden: Admin access required.',
        404: 'No orders found with the specified filters.',
        500: 'Server error. Please try again later.',
      };
      setAlert({
        type: 'error',
        message: messages[status] || error.message || 'Failed to fetch orders.',
        onClose: () => setAlert(null),
      });
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = async (e) => {
    e.preventDefault();
    await fetchOrders();
  };

  const resetFilters = async () => {
    setFilters({ status: '', district: '', startDate: '', endDate: '' });
    setLoading(true);
    try {
      console.log('Resetting filters, fetching all orders'); // Debug log
      const response = await adminApi.getAllOrders({});
      console.log('Reset orders response:', response.data); // Debug log
      setOrders(response.data || []);
    } catch (error) {
      const status = error.code || error.response?.status;
      const messages = {
        400: 'Invalid request.',
        401: 'Unauthorized: Please log in.',
        403: 'Forbidden: Admin access required.',
        500: 'Server error. Please try again later.',
      };
      setAlert({
        type: 'error',
        message: messages[status] || error.message || 'Failed to fetch orders.',
        onClose: () => setAlert(null),
      });
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingAnimation />;

  return (
    <div className="p-4 bg-[#1A2526] text-white">
      <h2 className="text-2xl font-bold mb-4 text-blue-500">Manage Orders</h2>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Filters */}
      <form onSubmit={applyFilters} className="mb-6 bg-[#1A2526] p-4 rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="label text-sm text-white">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="select select-bordered w-full text-black"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="label text-sm text-white">District</label>
            <input
              type="text"
              name="district"
              value={filters.district}
              onChange={handleFilterChange}
              placeholder="Enter district (e.g., Colombo)"
              className="input input-bordered w-full text-black"
            />
          </div>
          <div>
            <label className="label text-sm text-white">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="input input-bordered w-full text-black"
            />
          </div>
          <div>
            <label className="label text-sm text-white">End Date</label>
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
          <button type="submit" className="btn bg-teal-500 border-none hover:bg-teal-600 text-white">
            Apply Filters
          </button>
          <button type="button" onClick={resetFilters} className="btn bg-orange-500 border-none hover:bg-orange-600 text-white">
            Reset
          </button>
        </div>
      </form>

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-lg">
        <table className="table w-full bg-[#1A2526] text-white">
          <thead className="text-blue-500">
            <tr>
              <th>ID</th>
              <th>Seller Status</th>
              <th>Courier Status</th>
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
                  <td>{order.item.sellerStatus || 'N/A'}</td>
                  <td>{order.item.courierStatus || 'N/A'}</td>
                  <td>{order.shippingAddress?.district || 'N/A'}</td>
                  <td>{new Date(order.orderCreatedAt).toLocaleDateString()}</td>
                  <td>
                    {order.item.price
                      ? `$${order.item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                      : 'N/A'}
                  </td>
                  <td>{order.buyer?._id || 'N/A'}</td>
                  <td>{order.item.product.seller || 'N/A'}</td>
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