import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import Alert from './Alert';
import LoadingAnimation from '../function/LoadingAnimation';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10, // Set a reasonable default for pagination
    total: 0,
  });
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    sellerId: '',
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [pagination.page]); // Fetch products when the page changes

  const fetchCategories = async () => {
    try {
      const response = await adminApi.getAllCategories();
      console.log('Categories:', response.data); // Debug log
      setCategories(response.data || []);
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.message || 'Failed to fetch categories.',
        onClose: () => setAlert(null),
      });
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Clean filters: only include non-empty values
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (filters.status) params.status = filters.status;
      if (filters.category) params.category = filters.category;
      if (filters.sellerId) params.sellerId = filters.sellerId;

      console.log('Fetching products with params:', params); // Debug log
      const response = await adminApi.getAllProducts(params);
      if (!response.success || !Array.isArray(response.data)) {
        console.error('Invalid products response:', response); // Debug log
        throw new Error('Received invalid product data from server.');
      }
      console.log('Products response:', response.data); // Debug log
      setProducts(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination.total, // Update total based on API response
      }));
    } catch (error) {
      const status = error.code || error.response?.status;
      const messages = {
        400: 'Invalid filter parameters provided.',
        401: 'Unauthorized: Please log in.',
        403: 'Forbidden: Admin access required.',
        404: 'No products found with the specified filters.',
        500: 'Server error. Please try again later.',
      };
      console.error('Fetch products error:', error); // Debug log
      setAlert({
        type: 'error',
        message: messages[status] || error.message || 'Failed to fetch products.',
        onClose: () => setAlert(null),
      });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = async (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to page 1 when applying filters
    await fetchProducts();
  };

  const resetFilters = async () => {
    setFilters({ status: '', category: '', sellerId: '' });
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to page 1 when resetting filters
    setLoading(true);
    try {
      console.log('Resetting filters, fetching all products'); // Debug log
      const response = await adminApi.getAllProducts({ 
        page: 1, 
        limit: pagination.limit 
      });
      if (!response.success || !Array.isArray(response.data)) {
        console.error('Invalid reset products response:', response); // Debug log
        throw new Error('Received invalid product data from server.');
      }
      console.log('Reset products response:', response.data); // Debug log
      setProducts(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination.total,
      }));
    } catch (error) {
      const status = error.code || error.response?.status;
      const messages = {
        400: 'Invalid request.',
        401: 'Unauthorized: Please log in.',
        403: 'Forbidden: Admin access required.',
        500: 'Server error. Please try again later.',
      };
      console.error('Reset products error:', error); // Debug log
      setAlert({
        type: 'error',
        message: messages[status] || error.message || 'Failed to fetch products.',
        onClose: () => setAlert(null),
      });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > Math.ceil(pagination.total / pagination.limit)) return;
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  if (loading) return <LoadingAnimation />;

  return (
    <div className="p-4 bg-[#1A2526] text-white min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-blue-500">Manage Products</h2>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Filters */}
      <form onSubmit={applyFilters} className="mb-6 bg-[#1A2526] p-4 rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="label text-sm text-white">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="select select-bordered w-full bg-gray-800 text-white focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="deleted">Deleted</option>
            </select>
          </div>
          <div>
            <label className="label text-sm text-white">Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="select select-bordered w-full bg-gray-800 text-white focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="">All Categories</option>
              {categories
                .filter((cat) => !cat.parentCategory) // Only main categories
                .map((cat) => (
                  <React.Fragment key={cat._id}>
                    <option value={cat._id}>{cat.name}</option>
                    {cat.categoryOption?.map((sub) => (
                      <option key={sub._id} value={sub._id}>
                        {'\u00A0\u00A0'} {sub.name} {/* Indent subcategories */}
                      </option>
                    ))}
                  </React.Fragment>
                ))}
            </select>
          </div>
          <div>
            <label className="label text-sm text-white">Seller ID</label>
            <input
              type="text"
              name="sellerId"
              value={filters.sellerId}
              onChange={handleFilterChange}
              placeholder="Enter Seller ID"
              className="input input-bordered w-full bg-gray-800 text-white placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
          <button type="submit" className="btn bg-teal-500 border-none hover:bg-teal-600 text-white w-full sm:w-auto">
            Apply Filters
          </button>
          <button type="button" onClick={resetFilters} className="btn bg-orange-500 border-none hover:bg-orange-600 text-white w-full sm:w-auto">
            Reset
          </button>
        </div>
      </form>

      {/* Products Table */}
      <div className="overflow-x-auto rounded-lg">
        <table className="table w-full bg-[#1A2526] text-white">
          <thead className="text-blue-500">
            <tr>
              <th className="text-left">ID</th>
              <th className="text-left">Title</th>
              <th className="text-left">Status</th>
              <th className="text-left">Category</th>
              <th className="text-left">Seller ID</th>
              <th className="text-left">Price</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.title || 'N/A'}</td>
                  <td>{product.status || 'N/A'}</td>
                  <td>{product.category?.name || 'N/A'}</td>
                  <td>{product.sellerId?._id || 'N/A'}</td>
                  <td>
                    {product.price
                      ? `$${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                      : 'N/A'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-gray-400">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {pagination.total > 0 && (
        <div className="flex flex-col sm:flex-row justify-center items-center mt-4 space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="btn bg-teal-500 border-none hover:bg-teal-600 text-white w-full sm:w-auto"
          >
            Previous
          </button>
          <span className="self-center text-white">
            Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
          </span>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
            className="btn bg-teal-500 border-none hover:bg-teal-600 text-white w-full sm:w-auto"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;