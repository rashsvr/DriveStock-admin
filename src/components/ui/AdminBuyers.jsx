// pages/AdminBuyers.jsx
import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import Table from './Table';

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

  const handleDelete = async (buyer) => {
    if (!window.confirm('Are you sure you want to delete this buyer?')) return;
    setLoading(true);
    try {
      await adminApi.deleteBuyer(buyer._id);
      setAlert({ type: 'success', message: 'Buyer deleted successfully' });
      fetchBuyers();
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
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
        itemsPerPage={5} // Smaller for demo; adjust as needed
      />
    </div>
  );
};

export default AdminBuyers;