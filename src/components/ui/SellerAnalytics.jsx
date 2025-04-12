import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import Alert from './Alert';
import { format } from 'date-fns';
import Table from './Table';
import LoadingAnimation from '../function/LoadingAnimation';
 

const SellerAnalytics = () => {
  const { getSellerAnalytics, isAuthenticated, isAuthChecked } = useAuth();

  if (!isAuthChecked) return <LoadingAnimation />;
  if (!isAuthenticated()) return <Navigate to="/login" replace />;

  const { data, isLoading, error } = useQuery({
    queryKey: ['sellerAnalytics'],
    queryFn: getSellerAnalytics,
    enabled: isAuthenticated(),
  });

  if (isLoading) {
    return <LoadingAnimation />;
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert type="error" message={error.message || 'Failed to load analytics'} />
      </div>
    );
  }

  const { totalOrders, totalRevenue, statusBreakdown, topProducts, lowStockProducts } = data.data;

  const statusBreakdownColumns = [
    { key: 'status', label: 'Status' },
    { key: 'count', label: 'Count' },
  ];

  const statusBreakdownData = Object.entries(statusBreakdown).map(([status, count]) => ({
    _id: status,
    status,
    count,
  }));

  const topProductsColumns = [
    { key: 'title', label: 'Product Title' },
    { key: 'sales', label: 'Units Sold', hideOnMobile: true },
  ];

  const lowStockColumns = [
    { key: 'title', label: 'Product Title' },
    { key: 'stock', label: 'Stock Remaining' },
  ];

  return (
    <div className="p-6 bg-[#121D1E] min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-4">Seller Analytics</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-[#1F2D2E] rounded-2xl shadow-2xl p-6">
          <h3 className="text-sm font-medium text-gray-300 mb-2">Total Orders</h3>
          <p className="text-xl font-semibold">{totalOrders}</p>
        </div>
        <div className="bg-[#1F2D2E] rounded-2xl shadow-2xl p-6">
          <h3 className="text-sm font-medium text-gray-300 mb-2">Total Revenue</h3>
          <p className="text-xl font-semibold">${totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="bg-[#1F2D2E] rounded-2xl shadow-2xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-300 mb-4">Order Status Breakdown</h3>
        <Table
          data={statusBreakdownData}
          columns={statusBreakdownColumns}
          emptyMessage="No status data available"
        />
      </div>

      {/* Top Products */}
      <div className="bg-[#1F2D2E] rounded-2xl shadow-2xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-300 mb-4">Top Products</h3>
        <Table
          data={topProducts}
          columns={topProductsColumns}
          emptyMessage="No top products available"
        />
      </div>

      {/* Low Stock Products */}
      <div className="bg-[#1F2D2E] rounded-2xl shadow-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-300 mb-4">Low Stock Products</h3>
        <Table
          data={lowStockProducts}
          columns={lowStockColumns}
          emptyMessage="No low stock products"
        />
      </div>
    </div>
  );
};

export default SellerAnalytics;