import React, { useState, useEffect } from 'react';
import sellerApi from '../../services/sellerApi';
import Alert from './Alert';
import LoadingAnimation from '../function/LoadingAnimation';

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({ status: '' });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [pagination.page, filters.status]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await sellerApi.getSellerOrders({ page: pagination.page, limit: pagination.limit });
      setOrders(response.data);
      setPagination((prev) => ({ ...prev, total: response.pagination?.total || response.data.length }));
    } catch (error) {
      setAlert({ type: 'error', message: error.message, onClose: () => setAlert(null) });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    setLoading(true);
    try {
      await sellerApi.updateOrderStatus(orderId, { status });
      setAlert({ type: 'success', message: 'Order status updated', onClose: () => setAlert(null) });
      fetchOrders();
    } catch (error) {
      setAlert({ type: 'error', message: error.message, onClose: () => setAlert(null) });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setLoading(true);
    try {
      await sellerApi.cancelOrder(orderId);
      setAlert({ type: 'success', message: 'Order cancelled', onClose: () => setAlert(null) });
      fetchOrders();
    } catch (error) {
      setAlert({ type: 'error', message: error.message, onClose: () => setAlert(null) });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  if (loading) return <LoadingAnimation />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Filters */}
      <form className="mb-6 bg-[#1A2526] p-4 rounded-lg text-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </div>
      </form>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="table w-full bg-[#1A2526] text-white">
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Buyer</th>
              <th>Total Amount</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.status}</td>
                  <td>{order.buyerId?.name || order.buyerId?._id || 'N/A'}</td>
                  <td>
                    {order.totalAmount
                      ? `$${order.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                      : 'N/A'}
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className="select select-sm select-bordered text-black"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                    <button
                      className="btn btn-sm btn-error ml-2"
                      onClick={() => handleCancel(order._id)}
                      disabled={order.status === 'cancelled' || order.status === 'delivered'}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-gray-400">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button
          className="btn btn-primary mr-2"
          disabled={pagination.page === 1}
          onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
        >
          Previous
        </button>
        <span className="text-white">
          Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
        </span>
        <button
          className="btn btn-primary ml-2"
          disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
          onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SellerOrders;