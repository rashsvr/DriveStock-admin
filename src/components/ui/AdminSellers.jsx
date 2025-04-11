import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import Alert from './Alert';
import LoadingAnimation from '../function/LoadingAnimation';

const AdminSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [pendingSellers, setPendingSellers] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSellers();
    fetchPendingSellers();
  }, []);

  const fetchSellers = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAllSellers();
      setSellers(data.data);
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingSellers = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getPendingSellers();
      setPendingSellers(data.data);
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (sellerId) => {
    setLoading(true);
    try {
      await adminApi.approveSeller(sellerId);
      setAlert({ type: 'success', message: 'Seller approved successfully' });
      fetchSellers();
      fetchPendingSellers();
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (sellerId) => {
    if (!window.confirm('Are you sure you want to delete this seller?')) return;
    setLoading(true);
    try {
      await adminApi.deleteSeller(sellerId);
      setAlert({ type: 'success', message: 'Seller deleted successfully' });
      fetchSellers();
      fetchPendingSellers();
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingAnimation />;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Sellers</h2>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
      <h3 className="text-xl font-semibold mb-2">Pending Sellers</h3>
      <div className="overflow-x-auto mb-6">
        <table className="table w-full">
          <thead>
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
                    className="btn btn-success btn-sm mr-2"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDelete(seller._id)}
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
      <h3 className="text-xl font-semibold mb-2">Approved Sellers</h3>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
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

export default AdminSellers;