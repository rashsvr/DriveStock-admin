import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import Alert from './Alert'; // Adjust path as needed
import LoadingAnimation from '../function/LoadingAnimation';

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    status: '',
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null); // Track expanded row

  useEffect(() => {
    fetchComplaints();
  }, [pagination.page]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (filters.status) params.status = filters.status;

      console.log('Fetching complaints with params:', params);
      const response = await adminApi.getAllComplaints(params);
      if (!response.success || !Array.isArray(response.data)) {
        console.error('Invalid complaints response:', response);
        throw new Error('Received invalid complaint data from server.');
      }
      console.log('Complaints response:', response.data);
      setComplaints(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination.total,
      }));
    } catch (error) {
      const status = error.code || error.response?.status;
      const messages = {
        400: 'Invalid filter parameters provided.',
        401: 'Unauthorized: Please log in.',
        403: 'Forbidden: Admin access required.',
        404: 'No complaints found with the specified filters.',
        500: 'Server error. Please try again later.',
      };
      console.error('Fetch complaints error:', error);
      setAlert({
        type: 'error',
        message: messages[status] || error.message || 'Failed to fetch complaints.',
        onClose: () => setAlert(null),
      });
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = async (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    setExpandedRow(null); // Collapse any expanded row on filter
    await fetchComplaints();
  };

  const resetFilters = async () => {
    setFilters({ status: '' });
    setPagination((prev) => ({ ...prev, page: 1 }));
    setExpandedRow(null); // Collapse any expanded row on reset
    setLoading(true);
    try {
      console.log('Resetting filters, fetching all complaints');
      const response = await adminApi.getAllComplaints({
        page: 1,
        limit: pagination.limit,
      });
      if (!response.success || !Array.isArray(response.data)) {
        console.error('Invalid reset complaints response:', response);
        throw new Error('Received invalid complaint data from server.');
      }
      console.log('Reset complaints response:', response.data);
      setComplaints(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination.total,
      }));
    } catch (error) {
      const status = error.code || error.response?.status;
      const messages = {
        400: 'Invalid request.',
        401: 'Unauthorized: Please log in.',
        403: 'Forbidden: Admin access required.',
        500: 'Server error. Please try again later.',
      };
      console.error('Reset complaints error:', error);
      setAlert({
        type: 'error',
        message: messages[status] || error.message || 'Failed to fetch complaints.',
        onClose: () => setAlert(null),
      });
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > Math.ceil(pagination.total / pagination.limit)) return;
    setPagination((prev) => ({ ...prev, page: newPage }));
    setExpandedRow(null); // Collapse any expanded row on page change
  };

  const toggleRow = (key) => {
    setExpandedRow(expandedRow === key ? null : key); // Toggle expansion
  };

  if (loading) return <LoadingAnimation />;

  return (
    <div className="p-4 bg-[#1A2526] text-white">
      <h2 className="text-2xl font-bold mb-4 text-blue-500">Manage Complaints</h2>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Filters */}
      <form onSubmit={applyFilters} className="mb-6 bg-[#1A2526] p-4 rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="label text-sm text-white">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="select select-bordered w-full text-black"
            >
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
              <option value="Refund Approved">Refund Approved</option>
              <option value="Refund Rejected">Refund Rejected</option>
            </select>
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

      {/* Complaints Table */}
      <div className="overflow-x-auto rounded-lg">
        <table className="table w-full bg-[#1A2526] text-white">
          <thead className="text-blue-500">
            <tr>
              <th>Order ID</th>
              <th>Product Title</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Buyer</th>
              <th>Seller</th>
              <th>Seller Email</th>
              <th>Complaint Status</th>
              <th>Refund Requested</th>
              <th>Created At</th>
              <th>Resolved By</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length > 0 ? (
              complaints.map((complaint) => {
                const rowKey = `${complaint.orderId}-${complaint.productId}`;
                return (
                  <React.Fragment key={rowKey}>
                    <tr
                      className="cursor-pointer hover:bg-gray-700"
                      onClick={() => toggleRow(rowKey)}
                    >
                      <td>{complaint.orderId.slice(-6)}</td>
                      <td>{complaint.productTitle || 'N/A'}</td>
                      <td>{complaint.item.quantity || 'N/A'}</td>
                      <td>
                        {complaint.item.totalPrice
                          ? `$${complaint.item.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                          : 'N/A'}
                      </td>
                      <td>
                        {complaint.buyer.name || complaint.buyer.email || complaint.buyer.id || 'N/A'}
                      </td>
                      <td>
                        {complaint.seller.name || complaint.seller.id || 'N/A'}
                      </td>
                      <td>{complaint.seller.email || 'N/A'}</td>
                      <td>{complaint.complaint.status || 'N/A'}</td>
                      <td>
                        {complaint.complaint.refundRequested
                          ? `Yes (${complaint.complaint.refundAmount ? `$${complaint.complaint.refundAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : 'N/A'})`
                          : 'No'}
                      </td>
                      <td>
                        {complaint.complaint.createdAt
                          ? new Date(complaint.complaint.createdAt).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td>{complaint.complaint.resolvedBy || 'N/A'}</td>
                    </tr>
                    {expandedRow === rowKey && (
                      <tr>
                        <td colSpan="11" className="p-0">
                          <div className="bg-gray-800 p-4 rounded-lg m-2">
                            <h3 className="text-lg font-semibold text-teal-500 mb-2">
                              Complaint Details
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <p><strong>Full Order ID:</strong> {complaint.orderId || 'N/A'}</p>
                                <p><strong>Product ID:</strong> {complaint.productId || 'N/A'}</p>
                                <p><strong>Product Title:</strong> {complaint.productTitle || 'N/A'}</p>
                                <p>
                                  <strong>Item Price (Unit):</strong>{' '}
                                  {complaint.item.price
                                    ? `$${complaint.item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                                    : 'N/A'}
                                </p>
                                <p>
                                  <strong>Item Total Price:</strong>{' '}
                                  {complaint.item.totalPrice
                                    ? `$${complaint.item.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                                    : 'N/A'}
                                </p>
                                <p><strong>Quantity:</strong> {complaint.item.quantity || 'N/A'}</p>
                                <p>
                                  <strong>Seller Status:</strong> {complaint.item.sellerStatus || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p><strong>Buyer ID:</strong> {complaint.buyer.id || 'N/A'}</p>
                                <p><strong>Buyer Name:</strong> {complaint.buyer.name || 'N/A'}</p>
                                <p><strong>Buyer Email:</strong> {complaint.buyer.email || 'N/A'}</p>
                                <p><strong>Buyer Phone:</strong> {complaint.buyer.phone || 'N/A'}</p>
                                <p><strong>Seller ID:</strong> {complaint.seller.id || 'N/A'}</p>
                                <p><strong>Seller Name:</strong> {complaint.seller.name || 'N/A'}</p>
                                <p><strong>Seller Email:</strong> {complaint.seller.email || 'N/A'}</p>
                              </div>
                            </div>
                            <div className="mt-4">
                              <p>
                                <strong>Complaint Description:</strong>{' '}
                                {complaint.complaint.description || 'N/A'}
                              </p>
                              <p>
                                <strong>Complaint Status:</strong> {complaint.complaint.status || 'N/A'}
                              </p>
                              <p>
                                <strong>Refund Requested:</strong>{' '}
                                {complaint.complaint.refundRequested ? 'Yes' : 'No'}
                              </p>
                              <p>
                                <strong>Refund Amount:</strong>{' '}
                                {complaint.complaint.refundAmount
                                  ? `$${complaint.complaint.refundAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                                  : 'N/A'}
                              </p>
                              <p>
                                <strong>Created At:</strong>{' '}
                                {complaint.complaint.createdAt
                                  ? new Date(complaint.complaint.createdAt).toLocaleString()
                                  : 'N/A'}
                              </p>
                              <p>
                                <strong>Resolved At:</strong>{' '}
                                {complaint.complaint.resolvedAt
                                  ? new Date(complaint.complaint.resolvedAt).toLocaleString()
                                  : 'N/A'}
                              </p>
                              <p>
                                <strong>Resolved By:</strong> {complaint.complaint.resolvedBy || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan="11" className="text-center text-gray-400">
                  No complaints found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {pagination.total > 0 && (
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="btn bg-teal-500 border-none hover:bg-teal-600 text-white"
          >
            Previous
          </button>
          <span className="self-center text-white">
            Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
          </span>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
            className="btn bg-teal-500 border-none hover:bg-teal-600 text-white"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminComplaints;