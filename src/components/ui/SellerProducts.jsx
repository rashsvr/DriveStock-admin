import React, { useState, useEffect } from 'react';
import sellerApi from '../../services/sellerApi';
import Alert from './Alert';
import LoadingAnimation from '../function/LoadingAnimation';

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', category: '', stock: '', condition: 'new',
    brand: '', oem: false, aftermarket: false, material: '', makeModel: '', years: [], images: [],
  });

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [pagination.page]);

  const fetchCategories = async () => {
    try {
      const response = await sellerApi.getAllCategories(); // Assume this exists or adjust
      setCategories(response.data);
    } catch (error) {
      setAlert({ type: 'error', message: error.message, onClose: () => setAlert(null) });
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await sellerApi.getSellerProducts({ page: pagination.page, limit: pagination.limit });
      setProducts(response.data);
      setPagination((prev) => ({ ...prev, total: response.pagination.total }));
    } catch (error) {
      setAlert({ type: 'error', message: error.message, onClose: () => setAlert(null) });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sellerApi.createProduct({
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        years: formData.years.split(',').map((y) => parseInt(y.trim())),
      });
      setAlert({ type: 'success', message: 'Product created successfully', onClose: () => setAlert(null) });
      setShowCreateModal(false);
      setFormData({ title: '', description: '', price: '', category: '', stock: '', condition: 'new',
        brand: '', oem: false, aftermarket: false, material: '', makeModel: '', years: [], images: [] });
      fetchProducts();
    } catch (error) {
      setAlert({ type: 'error', message: error.message, onClose: () => setAlert(null) });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sellerApi.updateProduct(selectedProduct._id, {
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        description: formData.description,
      });
      setAlert({ type: 'success', message: 'Product updated successfully', onClose: () => setAlert(null) });
      setShowUpdateModal(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (error) {
      setAlert({ type: 'error', message: error.message, onClose: () => setAlert(null) });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setLoading(true);
    try {
      await sellerApi.deleteProduct(productId);
      setAlert({ type: 'success', message: 'Product deleted successfully', onClose: () => setAlert(null) });
      fetchProducts();
    } catch (error) {
      setAlert({ type: 'error', message: error.message, onClose: () => setAlert(null) });
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const openUpdateModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description || '',
    });
    setShowUpdateModal(true);
  };

  if (loading) return <LoadingAnimation />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Products</h2>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <button
        className="btn btn-primary mb-4"
        onClick={() => setShowCreateModal(true)}
      >
        Add Product
      </button>

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="table w-full bg-[#1A2526] text-white">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.title}</td>
                  <td>${product.price?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td>{product.stock}</td>
                  <td>{typeof product.category === 'string'
                    ? categories.find((cat) => cat._id === product.category)?.name || 'N/A'
                    : product.category?.name || 'N/A'}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary mr-2"
                      onClick={() => openUpdateModal(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
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

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button
          className="btn btn-primary mr-2"
          disabled={pagination.page === 1}
          onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
        >
          Previous
        </button>
        <span className="text-white">
          Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
        </span>
        <button
          className="btn btn-primary ml-2"
          disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
          onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
        >
          Next
        </button>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal modal-open">
          <div className="modal-box bg-[#1A2526] text-white">
            <h3 className="font-bold text-lg">Add New Product</h3>
            <form onSubmit={handleCreate}>
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="Title"
                  className="input input-bordered w-full text-black"
                  required
                />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Description"
                  className="textarea textarea-bordered w-full text-black"
                />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleFormChange}
                  placeholder="Price"
                  className="input input-bordered w-full text-black"
                  required
                />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  className="select select-bordered w-full text-black"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleFormChange}
                  placeholder="Stock"
                  className="input input-bordered w-full text-black"
                  required
                />
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleFormChange}
                  className="select select-bordered w-full text-black"
                >
                  <option value="new">New</option>
                  <option value="used">Used</option>
                  <option value="refurbished">Refurbished</option>
                </select>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleFormChange}
                  placeholder="Brand"
                  className="input input-bordered w-full text-black"
                />
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="oem"
                    checked={formData.oem}
                    onChange={handleFormChange}
                    className="checkbox mr-2"
                  />
                  OEM
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="aftermarket"
                    checked={formData.aftermarket}
                    onChange={handleFormChange}
                    className="checkbox mr-2"
                  />
                  Aftermarket
                </label>
                <input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleFormChange}
                  placeholder="Material"
                  className="input input-bordered w-full text-black"
                />
                <input
                  type="text"
                  name="makeModel"
                  value={formData.makeModel}
                  onChange={handleFormChange}
                  placeholder="Make & Model"
                  className="input input-bordered w-full text-black"
                />
                <input
                  type="text"
                  name="years"
                  value={formData.years.join(',')}
                  onChange={handleFormChange}
                  placeholder="Years (comma-separated)"
                  className="input input-bordered w-full text-black"
                />
              </div>
              <div className="modal-action">
                <button type="submit" className="btn btn-primary">Create</button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="modal modal-open">
          <div className="modal-box bg-[#1A2526] text-white">
            <h3 className="font-bold text-lg">Update Product</h3>
            <form onSubmit={handleUpdate}>
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Description"
                  className="input input-bordered w-full text-black"
                />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleFormChange}
                  placeholder="Price"
                  className="input input-bordered w-full text-black"
                  required
                />
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleFormChange}
                  placeholder="Stock"
                  className="input input-bordered w-full text-black"
                  required
                />
              </div>
              <div className="modal-action">
                <button type="submit" className="btn btn-primary">Update</button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowUpdateModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProducts;