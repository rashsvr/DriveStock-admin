import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import Alert from './Alert';
import LoadingAnimation from '../function/LoadingAnimation';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    usersByRole: {},
    orderStatusBreakdown: {},
    topProducts: [],
    topSellers: [],
    courierPerformance: [],
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getAnalytics();
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

      {/* Key Metrics Cards */}
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

      {/* Users by Role */}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Users by Role</h3>
        <div className="bg-[#1A2526] p-4 rounded-lg text-white">
          {Object.keys(analytics.usersByRole).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(analytics.usersByRole).map(([role, count]) => (
                <div key={role} className="flex items-center">
                  <span className="w-1/4 capitalize">{role}</span>
                  <div className="w-3/4 bg-gray-700 rounded h-4">
                    <div
                      className="bg-highlight-teal h-4 rounded"
                      style={{ width: `${(count / Math.max(...Object.values(analytics.usersByRole))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="ml-4">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No user data available.</p>
          )}
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Order Status Breakdown</h3>
        <div className="bg-[#1A2526] p-4 rounded-lg text-white">
          {Object.keys(analytics.orderStatusBreakdown).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(analytics.orderStatusBreakdown).map(([status, count]) => (
                <div key={status} className="flex items-center">
                  <span className="w-1/4 capitalize">{status}</span>
                  <div className="w-3/4 bg-gray-700 rounded h-4">
                    <div
                      className="bg-highlight-teal h-4 rounded"
                      style={{
                        width: `${(count / Math.max(...Object.values(analytics.orderStatusBreakdown))) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="ml-4">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No order status data available.</p>
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
                <th>Name</th>
                <th>Sales</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {analytics.topProducts.length > 0 ? (
                analytics.topProducts.map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>{product.sales}</td>
                    <td>${product.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-gray-400">
                    No top products available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Sellers Table */}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Top Sellers</h3>
        <div className="overflow-x-auto">
          <table className="table w-full bg-[#1A2526] text-white">
            <thead>
              <tr>
                <th>Name</th>
                <th>Sales</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {analytics.topSellers.length > 0 ? (
                analytics.topSellers.map((seller) => (
                  <tr key={seller._id}>
                    <td>{seller.name}</td>
                    <td>{seller.sales}</td>
                    <td>${seller.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-gray-400">
                    No top sellers available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Courier Performance Table */}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Courier Performance</h3>
        <div className="overflow-x-auto">
          <table className="table w-full bg-[#1A2526] text-white">
            <thead>
              <tr>
                <th>Name</th>
                <th>Orders</th>
                <th>On-Time Rate</th>
              </tr>
            </thead>
            <tbody>
              {analytics.courierPerformance.length > 0 ? (
                analytics.courierPerformance.map((courier) => (
                  <tr key={courier._id}>
                    <td>{courier.name}</td>
                    <td>{courier.orders}</td>
                    <td>{(courier.onTimeRate * 100).toFixed(1)}%</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-gray-400">
                    No courier performance data available.
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

export default AdminAnalytics;