import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import Alert from './Alert';
import LoadingAnimation from '../function/LoadingAnimation';

const AdminSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [pendingSellers, setPendingSellers] = useState([]);
  const [sellersPagination, setSellersPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
  });
  const [pendingSellersPagination, setPendingSellersPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSellers();
  }, [sellersPagination.page]); // Fetch approved sellers when page changes

  useEffect(() => {
    fetchPendingSellers();
  }, [pendingSellersPagination.page]); // Fetch pending sellers when page changes

  const fetchSellers = async () => {
    setLoading(true);
    try {
      const params = {
        page: sellersPagination.page,
        limit: sellersPagination.limit,
      };
      const response = await adminApi.getAllSellers(params); // Updated to pass pagination params
      if (!response.success || !Array.isArray(response.data)) {
        throw new Error("Invalid sellers data received.");
      }
      setSellers(response.data);
      setSellersPagination((prev) => ({
        ...prev,
        total: response.pagination.total, // Update total based on API response
      }));
    } catch (error) {
      setAlert({ 
        type: 'error', 
        message: error.message || "Failed to fetch approved sellers.",
        onClose: () => setAlert(null) 
      });
      setSellers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingSellers = async () => {
    setLoading(true);
    try {
      const params = {
        page: pendingSellersPagination.page,
        limit: pendingSellersPagination.limit,
      };
      const response = await adminApi.getPendingSellers(params); // Updated to pass pagination params
      if (!response.success || !Array.isArray(response.data)) {
        throw new Error("Invalid pending sellers data received.");
      }
      setPendingSellers(response.data);
      setPendingSellersPagination((prev) => ({
        ...prev,
        total: response.pagination.total, // Update total based on API response
      }));
    } catch (error) {
      setAlert({ 
        type: 'error', 
        message: error.message || "Failed to fetch pending sellers.",
        onClose: () => setAlert(null) 
      });
      setPendingSellers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (sellerId) => {
    setLoading(true);
    try {
      await adminApi.approveSeller(sellerId);
      setAlert({ 
        type: 'success', 
        message: 'Seller approved successfully',
        onClose: () => setAlert(null) 
      });
      setSellersPagination((prev) => ({ ...prev, page: 1 })); // Reset to page 1
      setPendingSellersPagination((prev) => ({ ...prev, page: 1 })); // Reset to page 1
      await Promise.all([fetchSellers(), fetchPendingSellers()]); // Fetch both lists
    } catch (error) {
      setAlert({ 
        type: 'error', 
        message: error.message || "Failed to approve seller.",
        onClose: () => setAlert(null) 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (sellerId) => {
    if (!window.confirm('Are you sure you want to delete this seller?')) return;
    setLoading(true);
    try {
      await adminApi.deleteSeller(sellerId);
      setAlert({ 
        type: 'success', 
        message: 'Seller deleted successfully',
        onClose: () => setAlert(null) 
      });
      setSellersPagination((prev) => ({ ...prev, page: 1 })); // Reset to page 1
      setPendingSellersPagination((prev) => ({ ...prev, page: 1 })); // Reset to page 1
      await Promise.all([fetchSellers(), fetchPendingSellers()]); // Fetch both lists
    } catch (error) {
      setAlert({ 
        type: 'error', 
        message: error.message || "Failed to delete seller.",
        onClose: () => setAlert(null) 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSellersPageChange = (newPage) => {
    if (newPage < 1 || newPage > Math.ceil(sellersPagination.total / sellersPagination.limit)) return;
    setSellersPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handlePendingSellersPageChange = (newPage) => {
    if (newPage < 1 || newPage > Math.ceil(pendingSellersPagination.total / pendingSellersPagination.limit)) return;
    setPendingSellersPagination((prev) => ({ ...prev, page: newPage }));
  };

  if (loading) return <LoadingAnimation />;

  return (
    <div className="p-4 text-white" style={{ backgroundColor: '#1A2526' }}>
      <h2 className="text-2xl font-bold mb-4 text-highlight-blue">Manage Sellers</h2>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <h3 className="text-xl font-semibold mb-2 text-highlight-orange">Pending Sellers</h3>
      <div className="overflow-x-auto mb-6 rounded-md">
        <table className="table w-full table-zebra">
          <thead className="text-highlight-blue">
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingSellers.map((seller) => (
              <tr key={seller._id}>
                <td>{seller.email}</td>
                <td>{seller.name}</td>
                <td>{seller.status}</td>
                <td>
                  <button
                    onClick={() => handleApprove(seller._id)}
                    className="btn btn-sm bg-highlight-teal text-white mr-2"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDelete(seller._id)}
                    className="btn btn-sm btn-error text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {pendingSellers.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-gray-400">
                  No pending sellers.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination for Pending Sellers */}
      {pendingSellersPagination.total > 0 && (
        <div className="flex justify-center mt-4 mb-6 space-x-2">
          <button
            onClick={() => handlePendingSellersPageChange(pendingSellersPagination.page - 1)}
            disabled={pendingSellersPagination.page === 1}
            className="btn bg-highlight-teal border-none hover:bg-teal-600 text-white"
          >
            Previous
          </button>
          <span className="self-center text-white">
            Page {pendingSellersPagination.page} of {Math.ceil(pendingSellersPagination.total / pendingSellersPagination.limit)}
          </span>
          <button
            onClick={() => handlePendingSellersPageChange(pendingSellersPagination.page + 1)}
            disabled={pendingSellersPagination.page >= Math.ceil(pendingSellersPagination.total / pendingSellersPagination.limit)}
            className="btn bg-highlight-teal border-none hover:bg-teal-600 text-white"
          >
            Next
          </button>
        </div>
      )}

      <h3 className="text-xl font-semibold mb-2 text-highlight-orange">Approved Sellers</h3>
      <div className="overflow-x-auto rounded-md">
        <table className="table w-full table-zebra">
          <thead className="text-highlight-blue">
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller) => (
              <tr key={seller._id}>
                <td>{seller.email}</td>
                <td>{seller.name}</td>
                <td>{seller.status}</td>
                <td>
                  <button
                    onClick={() => handleDelete(seller._id)}
                    className="btn btn-sm btn-error text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {sellers.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-gray-400">
                  No approved sellers.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination for Approved Sellers */}
      {sellersPagination.total > 0 && (
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => handleSellersPageChange(sellersPagination.page - 1)}
            disabled={sellersPagination.page === 1}
            className="btn bg-highlight-teal border-none hover:bg-teal-600 text-white"
          >
            Previous
          </button>
          <span className="self-center text-white">
            Page {sellersPagination.page} of {Math.ceil(sellersPagination.total / sellersPagination.limit)}
          </span>
          <button
            onClick={() => handleSellersPageChange(sellersPagination.page + 1)}
            disabled={sellersPagination.page >= Math.ceil(sellersPagination.total / sellersPagination.limit)}
            className="btn bg-highlight-teal border-none hover:bg-teal-600 text-white"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminSellers;