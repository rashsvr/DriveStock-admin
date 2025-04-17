import React, { useState, useEffect } from 'react';
import sellerApi from '../../services/sellerApi';
import Alert from './Alert';
import LoadingAnimation from '../function/LoadingAnimation';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { TrendingUp, PackageCheck } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SellerAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    statusBreakdown: {},
    topProducts: [],
    lowStockProducts: [],
    earnings: { daily: [], weekly: [], monthly: [], yearly: [] },
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chartTimeFrame, setChartTimeFrame] = useState('daily');

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

  const getChartData = () => {
    const data = analytics.earnings[chartTimeFrame];
    const labels = data.map(item =>
      chartTimeFrame === 'daily'
        ? item.date
        : chartTimeFrame === 'weekly'
        ? `Week ${item.week.split('-')[1]} (${item.week.split('-')[0]})`
        : chartTimeFrame === 'monthly'
        ? item.month
        : item.year
    );
    const revenues = data.map(item => item.revenue);

    return {
      labels,
      datasets: [
        {
          label: 'Revenue ($)',
          data: revenues,
          borderColor: '#14b8a6',
          backgroundColor: 'rgba(20, 184, 166, 0.15)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#ccc' } },
      title: {
        display: true,
        text: `${chartTimeFrame.charAt(0).toUpperCase() + chartTimeFrame.slice(1)} Earnings`,
        color: '#fff',
        font: { size: 18 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Revenue ($)', color: '#ccc' },
        ticks: { color: '#ccc' },
        grid: { color: '#333' },
      },
      x: {
        ticks: { color: '#ccc', maxRotation: 45, minRotation: 30 },
        grid: { color: '#333' },
      },
    },
  };

  if (loading) return <LoadingAnimation />;

  const StatCard = ({ icon: Icon, title, value }) => (
    <div className="bg-[#1A2526] hover:bg-[#223032] transition-all duration-300 rounded-2xl p-5 shadow-md flex items-center gap-4">
      <div className="bg-teal-600 p-3 rounded-full">
        <Icon className="text-white w-5 h-5" />
      </div>
      <div className="truncate">
        <div className="text-gray-400 text-sm uppercase truncate">{title}</div>
        <div className="text-white text-xl font-semibold truncate">{value}</div>
      </div>
    </div>
  );

  const DataTable = ({ title, headers, data, renderRow }) => (
    <div className="bg-[#1A2526] p-6 rounded-2xl shadow-md text-white space-y-4">
      <h3 className="text-xl font-semibold">{title}</h3>
      <div className="overflow-x-auto text-sm">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-gray-600 text-gray-400">
              {headers.map((head, i) => (
                <th key={i} className="pb-2 pr-6 whitespace-nowrap">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map(renderRow)
            ) : (
              <tr>
                <td colSpan={headers.length} className="text-center text-gray-500 py-4">No data available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-10 bg-[#0F1A1C] min-h-screen">
      <h2 className="text-2xl md:text-3xl font-bold text-white">Seller Analytics</h2>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard icon={PackageCheck} title="Total Orders" value={analytics.totalOrders.toLocaleString()} />
        <StatCard icon={TrendingUp} title="Total Revenue" value={`$${analytics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} />
      </div>

      {/* Chart */}
      <div className="bg-[#1A2526] p-4 md:p-6 rounded-2xl shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h3 className="text-lg md:text-xl text-white font-semibold">Earnings Over Time</h3>
          <select
            value={chartTimeFrame}
            onChange={(e) => setChartTimeFrame(e.target.value)}
            className="bg-white text-black px-3 py-1 rounded-md text-sm w-full sm:w-auto"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        {analytics.earnings[chartTimeFrame].length > 0 ? (
          <div className="relative h-[300px] sm:h-[400px]">
            <Line data={getChartData()} options={chartOptions} />
          </div>
        ) : (
          <p className="text-gray-400">No earnings data available.</p>
        )}
      </div>

      {/* Status Breakdown */}
      <div className="bg-[#1A2526] p-6 rounded-2xl shadow-md text-white">
        <h3 className="text-xl font-semibold mb-4">Order Status Breakdown</h3>
        <div className="space-y-3 text-sm">
          {Object.keys(analytics.statusBreakdown).length > 0 ? (
            Object.entries(analytics.statusBreakdown).map(([status, count]) => {
              const max = Math.max(...Object.values(analytics.statusBreakdown));
              const width = `${(count / max) * 100}%`;
              return (
                <div key={status} className="flex items-center gap-3">
                  <span className="w-1/3 sm:w-1/5 capitalize text-gray-300 truncate">{status}</span>
                  <div className="w-full bg-gray-700 rounded h-4 relative overflow-hidden">
                    <div className="bg-teal-500 h-4 rounded transition-all duration-500" style={{ width }}></div>
                  </div>
                  <span className="w-10 text-right">{count}</span>
                </div>
              );
            })
          ) : (
            <p className="text-gray-400">No status data available.</p>
          )}
        </div>
      </div>

      {/* Top Products */}
      <DataTable
        title="Top Products"
        headers={['Title', 'Sales', 'Revenue']}
        data={analytics.topProducts}
        renderRow={(product, index) => (
          <tr key={index} className="border-t border-gray-700">
            <td className="py-2 pr-6">{product.title}</td>
            <td className="py-2 pr-6">{product.totalSold}</td>
            <td className="py-2">${product.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
          </tr>
        )}
      />

      {/* Low Stock */}
      <DataTable
        title="Low Stock Products"
        headers={['Title', 'Stock']}
        data={analytics.lowStockProducts}
        renderRow={(product, index) => (
          <tr key={index} className="border-t border-gray-700">
            <td className="py-2 pr-6">{product.title}</td>
            <td className="py-2">{product.stock}</td>
          </tr>
        )}
      />
    </div>
  );
};

export default SellerAnalytics;
