import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import Alert from './Alert';
import LoadingAnimation from '../function/LoadingAnimation';
import PageContainer from './PageContainer';
import { ShoppingCart, DollarSign } from 'lucide-react';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    usersByRole: { courier: 0, seller: 0, admin: 0, buyer: 0 },
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
    <PageContainer title="Analytics Dashboard" alert={alert}>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          icon={<ShoppingCart className="text-white w-5 h-5" />}
          title="Total Orders"
          value={analytics.totalOrders.toLocaleString()}
          iconBg="bg-highlight-orange"
        />
        <MetricCard
          icon={<DollarSign className="text-white w-5 h-5" />}
          title="Total Revenue"
          value={`$${analytics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          iconBg="bg-highlight-teal"
        />
      </div>


      {/* Users by Role */}
      <Section title="Users by Role">
        {Object.keys(analytics.usersByRole).length > 0 ? (
          <div className="space-y-3">
            {Object.entries(analytics.usersByRole).map(([role, count]) => {
              const max = Math.max(...Object.values(analytics.usersByRole), 1);
              const width = (count / max) * 100;
              return (
                <div key={role} className="flex items-center gap-4">
                  <span className="capitalize w-1/4">{role}</span>
                  <div className="w-full bg-gray-700 rounded h-3">
                    <div
                      className="bg-teal-500 h-3 rounded transition-all duration-300"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <span className="w-10 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyMessage message="No user data available." />
        )}
      </Section>

      {/* Order Status Breakdown */}
      <Section title="Order Status Breakdown">
        {Object.keys(analytics.orderStatusBreakdown).length > 0 ? (
          <div className="space-y-3">
            {Object.entries(analytics.orderStatusBreakdown).map(([status, count]) => {
              const max = Math.max(...Object.values(analytics.orderStatusBreakdown), 1);
              const width = (count / max) * 100;
              return (
                <div key={status} className="flex items-center gap-4">
                  <span className="capitalize w-1/4">{status}</span>
                  <div className="w-full bg-gray-700 rounded h-3">
                    <div
                      className="bg-blue-500 h-3 rounded transition-all duration-300"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <span className="w-10 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyMessage message="No order status data available." />
        )}
      </Section>

      {/* Top Products */}
      <AnalyticsTable
        title="Top Products"
        data={analytics.topProducts}
        columns={['Title', 'Price', 'Category', 'Stock', 'Make/Model']}
        renderRow={(product) => (
          <tr key={product._id} className="hover:bg-[#243233] transition-colors duration-200">
            <td>{product.title}</td>
            <td>${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
            <td>{product.category?.name || 'N/A'}</td>
            <td>{product.stock}</td>
            <td>
              {product.makeModel?.length > 0
                ? product.makeModel.map((mm) => `${mm.make} ${mm.model}`).join(', ')
                : 'N/A'}
            </td>
          </tr>
        )}
      />

      {/* Top Sellers */}
      <AnalyticsTable
        title="Top Sellers"
        data={analytics.topSellers}
        columns={['Name', 'Email', 'Phone', 'Primary Address']}
        renderRow={(seller) => (
          <tr key={seller._id} className="hover:bg-[#243233] transition-colors duration-200">
            <td>{seller.name}</td>
            <td>{seller.email}</td>
            <td>{seller.phone || 'N/A'}</td>
            <td>
              {seller.addresses?.length > 0
                ? seller.addresses.find((a) => a.isDefault)?.street || seller.addresses[0].street
                : 'N/A'}
            </td>
          </tr>
        )}
      />

      {/* Courier Performance */}
      <AnalyticsTable
        title="Courier Performance"
        data={analytics.courierPerformance}
        columns={['Name', 'Delivered', 'Failed', 'Success Rate']}
        renderRow={(courier) => {
          const total = courier.delivered + courier.failed;
          const successRate = total > 0 ? ((courier.delivered / total) * 100).toFixed(1) : 0;
          return (
            <tr key={courier._id} className="hover:bg-[#243233] transition-colors duration-200">
              <td>{courier.name}</td>
              <td>{courier.delivered}</td>
              <td>{courier.failed}</td>
              <td>{successRate}%</td>
            </tr>
          );
        }}
      />
    </PageContainer>
  );
};

// Subcomponents
const Section = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
    <div className="bg-[#1A2526] p-4 rounded-xl text-white shadow">{children}</div>
  </div>
);

const AnalyticsTable = ({ title, data, columns, renderRow }) => (
  <div className="mb-6">
    <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
    <div className="overflow-x-auto shadow-inner rounded-xl">
      <table className="w-full bg-[#1A2526] text-white rounded-xl shadow table-auto">
        <thead className="text-left text-sm text-gray-300 bg-[#223030]">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-4 py-2">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-sm">
          {data.length > 0 ? (
            data.map(renderRow)
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center text-gray-400 py-4">
                No {title.toLowerCase()} available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const MetricCard = ({ icon, title, value, iconBg }) => (
  <div className="bg-[#1A2526]/80 backdrop-blur border border-white/10 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 text-white">
    <div className="flex items-center justify-between mb-3">
      <div className={`rounded-full p-2 ${iconBg} bg-opacity-80 shadow-md`}>
        {icon}
      </div>
    </div>
    <div>
      <p className="text-sm text-gray-300">{title}</p>
      <p className="text-2xl font-semibold mt-1 text-highlight-orange">
        {/* Optionally wrap with animated count up here */}
        {value}
      </p>
    </div>
  </div>
);


const EmptyMessage = ({ message }) => (
  <p className="text-gray-400 text-sm text-center">{message}</p>
);

export default AdminAnalytics;
