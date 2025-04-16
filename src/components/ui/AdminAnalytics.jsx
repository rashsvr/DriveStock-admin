import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import Alert from './Alert';
import LoadingAnimation from '../function/LoadingAnimation';
import PageContainer from './PageContainer';
import { ShoppingCart, DollarSign } from 'lucide-react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    usersByRole: { courier: 0, seller: 0, admin: 0, buyer: 0 },
    orderStatusBreakdown: {},
    topProducts: [],
    topSellers: [],
    courierPerformance: [],
    earnings: {
      daily: [],
      weekly: [],
      monthly: [],
      yearly: [],
    },
    productCategoryDistribution: [],
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [earningsPeriod, setEarningsPeriod] = useState('daily'); // State for toggling earnings period

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

  // Prepare data for Earnings Bar Chart
  const getEarningsChartData = () => {
    const periodData = analytics.earnings[earningsPeriod];
    const labels = periodData.map(item => {
      if (earningsPeriod === 'daily') return item.date;
      if (earningsPeriod === 'weekly') return `Week ${item.week.split('-')[1]} (${item.week.split('-')[0]})`;
      if (earningsPeriod === 'monthly') return item.month;
      return item.year;
    });
    const data = periodData.map(item => item.revenue);

    return {
      labels,
      datasets: [
        {
          label: 'Revenue ($)',
          data,
          backgroundColor: 'rgba(45, 212, 191, 0.6)', // Teal color to match theme
          borderColor: 'rgba(45, 212, 191, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const earningsChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#D1D5DB', // Gray-300 for text in dark theme
        },
      },
      title: {
        display: true,
        text: `Earnings (${earningsPeriod.charAt(0).toUpperCase() + earningsPeriod.slice(1)})`,
        color: '#F97316', // Orange to match theme
        font: {
          size: 16,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#D1D5DB', // Gray-300 for axis labels
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)', // Subtle grid lines
        },
      },
      y: {
        ticks: {
          color: '#D1D5DB',
          callback: (value) => `$${value}`,
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        title: {
          display: true,
          text: 'Revenue ($)',
          color: '#D1D5DB',
        },
      },
    },
  };

  // Prepare data for Product Category Distribution Pie Chart
  const getPieChartData = () => {
    const labels = analytics.productCategoryDistribution.map(item => item.categoryName);
    const data = analytics.productCategoryDistribution.map(item => item.productCount);
    const backgroundColors = [
      'rgba(255, 99, 132, 0.6)',
      'rgba(54, 162, 235, 0.6)',
      'rgba(255, 206, 86, 0.6)',
      'rgba(75, 192, 192, 0.6)',
      'rgba(153, 102, 255, 0.6)',
      'rgba(255, 159, 64, 0.6)',
      'rgba(199, 199, 199, 0.6)',
      'rgba(83, 102, 255, 0.6)',
      'rgba(255, 99, 199, 0.6)',
      'rgba(99, 255, 132, 0.6)',
      // Add more colors as needed for the number of categories
      'rgba(255, 206, 132, 0.6)',
      'rgba(54, 235, 162, 0.6)',
      'rgba(255, 86, 86, 0.6)',
      'rgba(75, 192, 255, 0.6)',
      'rgba(153, 255, 102, 0.6)',
      'rgba(255, 64, 159, 0.6)',
      'rgba(199, 255, 199, 0.6)',
      'rgba(83, 255, 102, 0.6)',
      'rgba(255, 199, 99, 0.6)',
      'rgba(99, 132, 255, 0.6)',
      'rgba(255, 132, 206, 0.6)',
      'rgba(54, 86, 235, 0.6)',
      'rgba(255, 235, 64, 0.6)',
      'rgba(75, 255, 192, 0.6)',
      'rgba(153, 102, 199, 0.6)',
      'rgba(255, 159, 255, 0.6)',
      'rgba(199, 199, 255, 0.6)',
      'rgba(83, 102, 199, 0.6)',
      'rgba(255, 99, 255, 0.6)',
      'rgba(99, 255, 255, 0.6)',
      'rgba(255, 206, 255, 0.6)',
      'rgba(54, 235, 235, 0.6)',
      'rgba(255, 86, 132, 0.6)',
      'rgba(75, 192, 132, 0.6)',
      'rgba(153, 255, 255, 0.6)',
    ];

    return {
      labels,
      datasets: [
        {
          label: 'Product Count',
          data,
          backgroundColor: backgroundColors.slice(0, data.length),
          borderColor: backgroundColors.slice(0, data.length).map(color => color.replace('0.6', '1')),
          borderWidth: 1,
        },
      ],
    };
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#D1D5DB', // Gray-300 for text in dark theme
        },
      },
      title: {
        display: true,
        text: 'Product Distribution by Category',
        color: '#F97316', // Orange to match theme
        font: {
          size: 16,
        },
      },
    },
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

      {/* Earnings Bar Chart */}
      <Section title="Earnings Overview">
        <div className="mb-4 flex justify-end">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            {['daily', 'weekly', 'monthly', 'yearly'].map(period => (
              <button
                key={period}
                onClick={() => setEarningsPeriod(period)}
                className={`px-4 py-2 text-sm font-medium border border-gray-600 transition-colors duration-200 ${
                  earningsPeriod === period
                    ? 'bg-teal-500 text-white'
                    : 'bg-[#1A2526] text-gray-300 hover:bg-gray-700 hover:text-white'
                } ${period === 'daily' ? 'rounded-l-md' : ''} ${
                  period === 'yearly' ? 'rounded-r-md' : ''
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {analytics.earnings[earningsPeriod].length > 0 ? (
          <div className="bg-[#1A2526] p-4 rounded-xl text-white">
            <Bar data={getEarningsChartData()} options={earningsChartOptions} />
          </div>
        ) : (
          <EmptyMessage message={`No ${earningsPeriod} earnings data available.`} />
        )}
      </Section>

      {/* Product Category Distribution Pie Chart */}
      <Section title="Product Category Distribution">
        {analytics.productCategoryDistribution.length > 0 ? (
          <div className="bg-[#1A2526] p-4 rounded-xl text-white">
            <div className="max-w-md mx-auto">
              <Pie data={getPieChartData()} options={pieChartOptions} />
            </div>
          </div>
        ) : (
          <EmptyMessage message="No product category data available." />
        )}
      </Section>

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
                      className="bg-blue-500 h-3 rounded transition-all duration-200"
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
        columns={['Title', 'Price', 'Stock', 'Income']}
        renderRow={(product) => (
          <tr key={product._id} className="hover:bg-[#243233] transition-colors duration-200">
            <td>{product.title}</td>
            <td>{product.itemPrice?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || 'N/A'}</td>
            <td>{product.presentStock}</td>
            <td>{product.revenue}</td>
          </tr>
        )}
      />

      {/* Top Sellers */}
      <AnalyticsTable
        title="Top Sellers"
        data={analytics.topSellers}
        columns={['Name', 'Email', 'Phone', 'Total Earnings']}
        renderRow={(seller) => (
          <tr key={seller._id} className="hover:bg-[#243233] transition-colors duration-200">
            <td>{seller.name}</td>
            <td>{seller.email}</td>
            <td>{seller.phone || 'N/A'}</td>
            <td>{seller.totalEarnings || 'N/A'}</td>
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
              <th key={col} className="px-4 py-2" width="25%">
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
        {value}
      </p>
    </div>
  </div>
);

const EmptyMessage = ({ message }) => (
  <p className="text-gray-400 text-sm text-center">{message}</p>
);

export default AdminAnalytics;