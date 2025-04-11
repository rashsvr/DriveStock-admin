import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import Alert from './Alert';
import LoadingAnimation from '../function/LoadingAnimation';

const AdminBuyers = () => {
  const [buyers, setBuyers] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBuyers();
  }, []);

  const fetchBuyers = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAllBuyers();
      setBuyers(data.data);
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (buyerId) => {
    if (!window.confirm('Are you sure you want to delete this buyer?')) return;
    setLoading(true);
    try {
      await adminApi.deleteBuyer(buyerId);
      setAlert({ type: 'success', message: 'Buyer deleted successfully' });
      fetchBuyers();
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingAnimation />;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Buyers</h2>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
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
            {buyers.map((buyer) => (
              <tr key={buyer._id}>
                <td>{buyer.email}</td>
                <td>{buyer.name}</td>
                <td>{buyer.status}</td>
                <td>
                  <button
                    onClick={() => handleDelete(buyer._id)}
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

export default AdminBuyers;