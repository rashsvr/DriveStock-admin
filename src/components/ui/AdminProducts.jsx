import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import Alert from './Alert';
import LoadingAnimation from '../function/LoadingAnimation';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
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
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await adminApi.getAllCategories();
      setCategories(response.data);
    } catch (error) {
      setAlert({ type: 'error', message: error.message, onClose: () => setAlert(null) });
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        status: filters.status || undefined,
        category: filters.category || undefined,
        sellerId: filters.sellerId || undefined,
      };
      const response = await adminApi.getAllProducts(params);
      console.log('Products:', response.data); // Debug log
      setProducts(response.data);
    } catch (error) {
      setAlert({ type: 'error', message: error.message, onClose: () => setAlert(null) });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const resetFilters = () => {
    setFilters({ status: '', category: '', sellerId: '' });
    fetchProducts();
  };

  if (loading) return <LoadingAnimation />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Filters */}
      <form onSubmit={applyFilters} className="mb-6 bg-[#1A2526] p-4 rounded-lg text-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="label text-sm">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="select select-bordered w-full text-black"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="label text-sm">Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="select select-bordered w-full text-black"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label text-sm">Seller ID</label>
            <input
              type="text"
              name="sellerId"
              value={filters.sellerId}
              onChange={handleFilterChange}
              placeholder="Enter Seller ID"
              className="input input-bordered w-full text-black"
            />
          </div>
        </div>
        <div className="mt-4 flex space-x-2">
          <button type="submit" className="btn btn-primary">
            Apply Filters
          </button>
          <button type="button" onClick={resetFilters} className="btn btn-ghost">
            Reset
          </button>
        </div>
      </form>

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="table w-full bg-[#1A2526] text-white">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Category</th>
              <th>Seller ID</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.status}</td>
                  <td>
                    {typeof product.category === 'string'
                      ? categories.find((cat) => cat._id === product.category)?.name || 'N/A'
                      : product.category?.name || 'N/A'}
                  </td>
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
    </div>
  );
};

export default AdminProducts;