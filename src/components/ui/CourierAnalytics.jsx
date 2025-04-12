import React, { useState, useEffect } from 'react';
import courierApi from '../../services/courierApi';
import Alert from './Alert';
import LoadingAnimation from '../function/LoadingAnimation';

const CourierAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    statusBreakdown: {},
    successRate: '0%',
    averageDeliveryTime: 'N/A',
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await courierApi.getAnalytics();
      console.log('Analytics:', response.data); // Debug log
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="card bg-[#1A2526] text-white shadow-xl">
          <div className="card-body">
            <h3 className="text-lg font-semibold">Success Rate</h3>
            <p className="text-2xl">{analytics.successRate}</p>
          </div>
        </div>
        <div className="card bg-[#1A2526] text-white shadow-xl">
          <div className="card-body">
            <h3 className="text-lg font-semibold">Average Delivery Time</h3>
            <p className="text-2xl">{analytics.averageDeliveryTime}</p>
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
    </div>
  );
};

export default CourierAnalytics;