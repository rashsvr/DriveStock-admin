import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import Table from './Table';

const AdminBuyers = () => {
  const [buyers, setBuyers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5, // Matches the original itemsPerPage prop in the Table component
    total: 0,
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBuyers();
  }, [pagination.page]); // Fetch buyers when the page changes

  const fetchBuyers = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };
      const response = await adminApi.getAllBuyers(params); // Updated to pass pagination params
      if (!response.success || !Array.isArray(response.data)) {
        throw new Error("Invalid buyers data received.");
      }
      setBuyers(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination.total, // Update total based on API response
      }));
    } catch (error) {
      setAlert({ 
        type: 'error', 
        message: error.message || "Failed to fetch buyers.",
        onClose: () => setAlert(null) 
      });
      setBuyers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (buyer) => {
    if (!window.confirm('Are you sure you want to delete this buyer?')) return;
    setLoading(true);
    try {
      await adminApi.deleteBuyer(buyer._id);
      setAlert({ 
        type: 'success', 
        message: 'Buyer deleted successfully',
        onClose: () => setAlert(null) 
      });
      setPagination((prev) => ({ ...prev, page: 1 })); // Reset to page 1 after deletion
      await fetchBuyers();
    } catch (error) {
      setAlert({ 
        type: 'error', 
        message: error.message || "Failed to delete buyer.",
        onClose: () => setAlert(null) 
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > Math.ceil(pagination.total / pagination.limit)) return;
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const columns = [
    { key: 'email', label: 'Email' },
    { key: 'name', label: 'Name' },
    { key: 'status', label: 'Status', hideOnMobile: true },
  ];

  const actions = [
    {
      label: 'Delete',
      onClick: handleDelete,
      className: 'btn-error text-white',
    },
  ];

  return (
    <div className="p-4 text-white" style={{ backgroundColor: '#1A2526' }}>
      <h2 className="text-2xl font-bold mb-4 text-highlight-blue">Manage Buyers</h2>
      <Table
        data={buyers}
        columns={columns}
        actions={actions}
        loading={loading}
        alert={alert}
        setAlert={setAlert}
        emptyMessage="No buyers found."
        itemsPerPage={pagination.limit} // Use pagination.limit for consistency
      />

      {/* Pagination Controls */}
      {pagination.total > 0 && (
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="btn bg-highlight-teal border-none hover:bg-teal-600 text-white"
          >
            Previous
          </button>
          <span className="self-center text-white">
            Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
          </span>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
            className="btn bg-highlight-teal border-none hover:bg-teal-600 text-white"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminBuyers;