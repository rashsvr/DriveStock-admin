import React, { useState, useEffect } from 'react';
import sellerApi from '../../services/sellerApi';
import Alert from './Alert';
import LoadingAnimation from '../function/LoadingAnimation';

const SellerAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    statusBreakdown: {},
    topProducts: [],
    lowStockProducts: [],
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await sellerApi.getAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      setAlert({ type: 'error', message: error.message, onClose: () => setAlert(null) });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingAnimation />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card bg-[#1A2526] text-white shadow-xl">
          <div className="card-body">
            <h3 className="text-lg font-semibold">Total Orders</h3>
            <p className="text-2xl">{analytics.totalOrders.toLocaleString()}</p>
          </div>
        </div>
        <div className="card bg-[#1A2526] text-white shadow-xl">
          <div className="card-body">
            <h3 className="text-lg font-semibold">Total Revenue</h3>
            <p className="text-2xl">${analytics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Order Status Breakdown</h3>
        <div className="bg-[#1A2526] p-4 rounded-lg text-white">
          {Object.keys(analytics.statusBreakdown).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(analytics.statusBreakdown).map(([status, count]) => (
                <div key={status} className="flex items-center">
                  <span className="w-1/4 capitalize">{status}</span>
                  <div className="w-3/4 bg-gray-700 rounded h-4">
                    <div
                      className="bg-teal-500 h-4 rounded"
                      style={{
                        width: `${(count / Math.max(...Object.values(analytics.statusBreakdown))) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="ml-4">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No status data available.</p>
          )}
        </div>
      </div>

      {/* Top Products Table */}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Top Products</h3>
        <div className="overflow-x-auto">
          <table className="table w-full bg-[#1A2526] text-white">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Sales</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {analytics.topProducts.length > 0 ? (
                analytics.topProducts.map((product) => (
                  <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>{product.title}</td>
                    <td>{product.sales}</td>
                    <td>${product.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-gray-400">
                    No top products available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Stock Products Table */}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Low Stock Products</h3>
        <div className="overflow-x-auto">
          <table className="table w-full bg-[#1A2526] text-white">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {analytics.lowStockProducts.length > 0 ? (
                analytics.lowStockProducts.map((product) => (
                  <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>{product.title}</td>
                    <td>{product.stock}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-gray-400">
                    No low stock products available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerAnalytics;