import React, { useState, useEffect } from 'react';
import sellerApi from '../../services/sellerApi';
import Alert from './Alert';
import LoadingAnimation from '../function/LoadingAnimation';

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [filters, setFilters] = useState({ status: '', category: '' });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    condition: 'New',
    brand: '',
    oem: '',
    aftermarket: false,
    material: '',
    makeModel: [{ make: '', model: '' }],
    years: [],
    image: null,
  });

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [pagination.page, filters]);

  const fetchCategories = async () => {
    try {
      const response = await sellerApi.getAllCategories();
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
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        status: filters.status || undefined,
        category: filters.category || undefined,
      };
      const response = await sellerApi.getSellerProducts(params);
      if (!response.success || !Array.isArray(response.data)) {
        throw new Error('Invalid products data received.');
      }
      setProducts(response.data);
      setPagination({
        page: response.pagination.page,
        limit: response.pagination.limit,
        total: response.pagination.total,
      });
    } catch (error) {
      const status = error.code || error.response?.status;
      const messages = {
        400: 'Invalid filter parameters.',
        401: 'Unauthorized: Please log in.',
        403: 'Forbidden: Seller access required.',
        404: 'No products found.',
        500: 'Server error. Please try again.',
      };
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
    setPagination({ ...pagination, page: 1 });
  };

  const handleRowClick = (product) => {
    setSelectedProduct(selectedProduct?._id === product._id ? null : product);
  };

  const openAddModal = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      condition: 'New',
      brand: '',
      oem: '',
      aftermarket: false,
      material: '',
      makeModel: [{ make: '', model: '' }],
      years: [],
      image: null,
    });
    setIsEditing(false);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setFormData({
      title: product.title || '',
      description: product.description || '',
      price: product.price || '',
      category: product.category?._id || '',
      stock: product.stock || '',
      condition: product.condition || 'New',
      brand: product.brand || '',
      oem: product.oem || '',
      aftermarket: !!product.aftermarket,
      material: product.material || '',
      makeModel: product.makeModel?.length > 0 ? product.makeModel : [{ make: '', model: '' }],
      years: product.years || [],
      image: null,
    });
    setIsEditing(true);
    setModalOpen(true);
    setSelectedProduct(product);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      if (file && !['image/jpeg', 'image/png'].includes(file.type)) {
        setAlert({
          type: 'error',
          message: 'Only JPEG or PNG images are allowed.',
          onClose: () => setAlert(null),
        });
        return;
      }
      setFormData({ ...formData, image: file });
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleMakeModelChange = (index, field, value) => {
    const updatedMakeModel = [...formData.makeModel];
    updatedMakeModel[index][field] = value;
    setFormData({ ...formData, makeModel: updatedMakeModel });
  };

  const addMakeModel = () => {
    setFormData({
      ...formData,
      makeModel: [...formData.makeModel, { make: '', model: '' }],
    });
  };

  const removeMakeModel = (index) => {
    setFormData({
      ...formData,
      makeModel: formData.makeModel.filter((_, i) => i !== index),
    });
  };

  const handleYearsChange = (e) => {
    const years = e.target.value
      .split(',')
      .map((y) => parseInt(y.trim()))
      .filter((y) => !isNaN(y));
    setFormData({ ...formData, years });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!formData.title) {
      setAlert({
        type: 'error',
        message: 'Title is required.',
        onClose: () => setAlert(null),
      });
      setLoading(false);
      return;
    }
    if (!formData.category) {
      setAlert({
        type: 'error',
        message: 'Category is required.',
        onClose: () => setAlert(null),
      });
      setLoading(false);
      return;
    }
    if (!formData.price || parseFloat(formData.price) < 0) {
      setAlert({
        type: 'error',
        message: 'Price must be a positive number.',
        onClose: () => setAlert(null),
      });
      setLoading(false);
      return;
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      setAlert({
        type: 'error',
        message: 'Stock must be a non-negative number.',
        onClose: () => setAlert(null),
      });
      setLoading(false);
      return;
    }

    try {
      if (isEditing) {
        await sellerApi.updateProduct(selectedProduct._id, {
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          stock: parseInt(formData.stock),
          condition: formData.condition,
          brand: formData.brand,
          oem: formData.oem,
          aftermarket: formData.aftermarket,
          material: formData.material,
          makeModel: formData.makeModel,
          years: formData.years,
          image: formData.image,
        });
        setAlert({
          type: 'success',
          message: 'Product updated successfully.',
          onClose: () => setAlert(null),
        });
      } else {
        await sellerApi.createProduct({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          stock: parseInt(formData.stock),
          condition: formData.condition,
          brand: formData.brand,
          oem: formData.oem,
          aftermarket: formData.aftermarket,
          material: formData.material,
          makeModel: formData.makeModel,
          years: formData.years,
          image: formData.image,
        });
        setAlert({
          type: 'success',
          message: 'Product created successfully.',
          onClose: () => setAlert(null),
        });
      }
      setModalOpen(false);
      setSelectedProduct(null);
      await fetchProducts();
    } catch (error) {
      const status = error.code || error.response?.status;
      const messages = {
        400: isEditing ? 'Invalid update data.' : 'Invalid product data or image.',
        401: 'Unauthorized: Please log in.',
        403: 'Forbidden: Seller access required.',
        404: 'Category or product not found.',
        500: 'Server error. Please try again.',
      };
      setAlert({
        type: 'error',
        message: messages[status] || error.message || 'Failed to save product.',
        onClose: () => setAlert(null),
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setLoading(true);
    try {
      await sellerApi.deleteProduct(productId);
      setAlert({
        type: 'success',
        message: 'Product deleted successfully.',
        onClose: () => setAlert(null),
      });
      setSelectedProduct(null);
      await fetchProducts();
    } catch (error) {
      const status = error.code || error.response?.status;
      const messages = {
        400: 'Invalid request.',
        401: 'Unauthorized: Please log in.',
        403: 'Forbidden: Seller access required.',
        404: 'Product not found.',
        500: 'Server error. Please try again.',
      };
      setAlert({
        type: 'error',
        message: messages[status] || error.message || 'Failed to delete product.',
        onClose: () => setAlert(null),
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > Math.ceil(pagination.total / pagination.limit)) return;
    setPagination({ ...pagination, page: newPage });
  };

  if (loading) return <LoadingAnimation />;

  return (
    <div className="p-4 bg-[#1A2526] text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-500">Manage Products</h2>
        <button
          onClick={openAddModal}
          className="btn bg-teal-500 border-none hover:bg-teal-600 text-white"
        >
          Add Product
        </button>
      </div>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <form className="mb-6 bg-[#1A2526] p-4 rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label text-sm text-white">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="select select-bordered w-full text-black"
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
              className="select select-bordered w-full text-black"
            >
              <option value="">All Categories</option>
              {categories.length > 0 ? (
                categories
                  .filter((cat) => !cat.parentCategory)
                  .map((cat) => (
                    <React.Fragment key={cat._id}>
                      <option value={cat._id}>{cat.name}</option>
                      {cat.categoryOption?.map((sub) => (
                        <option key={sub._id} value={sub._id}>
                          {'\u00A0\u00A0'} {sub.name}
                        </option>
                      ))}
                    </React.Fragment>
                  ))
              ) : (
                <option disabled>No categories available</option>
              )}
            </select>
          </div>
        </div>
      </form>

      <div className="overflow-x-auto rounded-lg">
        <table className="table w-full bg-[#1A2526] text-white">
          <thead className="text-blue-500">
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <React.Fragment key={product._id}>
                  <tr
                    onClick={() => handleRowClick(product)}
                    className="cursor-pointer hover:bg-gray-700"
                  >
                    <td>{product._id}</td>
                    <td>{product.title || 'N/A'}</td>
                    <td>
                      {product.price
                        ? `$${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                        : 'N/A'}
                    </td>
                    <td>{product.stock || 'N/A'}</td>
                    <td>{product.category?.name || 'N/A'}</td>
                    <td>{product.status || 'N/A'}</td>
                    <td>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(product);
                        }}
                        className="btn btn-sm bg-blue-500 border-none hover:bg-blue-600 text-white mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteProduct(product._id);
                        }}
                        className="btn btn-sm bg-red-600 border-none hover:bg-red-700 text-white"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                  {selectedProduct?._id === product._id && (
                    <tr>
                      <td colSpan="7" className="bg-gray-800 p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold text-blue-500">Product Details</h3>
                            <p><strong>Description:</strong> {product.description || 'N/A'}</p>
                            <p><strong>Condition:</strong> {product.condition || 'N/A'}</p>
                            <p><strong>Brand:</strong> {product.brand || 'N/A'}</p>
                            <p><strong>OEM:</strong> {product.oem || 'N/A'}</p>
                            <p><strong>Aftermarket:</strong> {product.aftermarket ? 'Yes' : 'No'}</p>
                            <p><strong>Material:</strong> {product.material || 'N/A'}</p>
                            <p>
                              <strong>Make/Model:</strong>{' '}
                              {product.makeModel
                                ?.map((mm) => `${mm.make} ${mm.model}`)
                                .join(', ') || 'N/A'}
                            </p>
                            <p><strong>Years:</strong> {product.years?.join(', ') || 'N/A'}</p>
                            <p><strong>Availability:</strong> {product.availability || 'N/A'}</p>
                            <p>
                              <strong>Image:</strong>{' '}
                              {product.images?.[0] ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.title}
                                  className="w-24 h-24 object-cover mt-2"
                                />
                              ) : (
                                'N/A'
                              )}
                            </p>
                            <p>
                              <strong>Created At:</strong>{' '}
                              {new Date(product.createdAt).toLocaleString()}
                            </p>
                            <p>
                              <strong>Updated At:</strong>{' '}
                              {new Date(product.updatedAt).toLocaleString()}
                            </p>
                          </div>
                          {/* Removed Edit Product button from here */}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-gray-400">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination.total > 0 && (
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="btn bg-teal-500 border-none hover:bg-teal-600 text-white"
          >
            Previous
          </button>
          <span className="self-center">
            Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
          </span>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
            className="btn bg-teal-500 border-none hover:bg-teal-600 text-white"
          >
            Next
          </button>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1A2526] p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-blue-500">
              {isEditing ? 'Edit Product' : 'Add Product'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="label text-sm text-white">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="input input-bordered w-full text-black"
                />
              </div>
              <div className="mb-4">
                <label className="label text-sm text-white">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="select select-bordered w-full text-black"
                >
                  <option value="">Select Category</option>
                  {categories.length > 0 ? (
                    categories
                      .filter((cat) => !cat.parentCategory)
                      .map((cat) => (
                        <React.Fragment key={cat._id}>
                          <option value={cat._id}>{cat.name}</option>
                          {cat.categoryOption?.map((sub) => (
                            <option key={sub._id} value={sub._id}>
                              {'\u00A0\u00A0'} {sub.name}
                            </option>
                          ))}
                        </React.Fragment>
                      ))
                  ) : (
                    <option disabled>No categories available</option>
                  )}
                </select>
              </div>
              <div className="mb-4">
                <label className="label text-sm text-white">Condition</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  required
                  className="select select-bordered w-full text-black"
                >
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                  <option value="Refurbished">Refurbished</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="label text-sm text-white">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="input input-bordered w-full text-black"
                />
              </div>
              <div className="mb-4">
                <label className="label text-sm text-white">OEM</label>
                <input
                  type="text"
                  name="oem"
                  value={formData.oem}
                  onChange={handleInputChange}
                  className="input input-bordered w-full text-black"
                />
              </div>
              <div className="mb-4">
                <label className="label text-sm text-white">Aftermarket</label>
                <input
                  type="checkbox"
                  name="aftermarket"
                  checked={formData.aftermarket}
                  onChange={handleInputChange}
                  className="checkbox"
                />
              </div>
              <div className="mb-4">
                <label className="label text-sm text-white">Material</label>
                <input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleInputChange}
                  className="input input-bordered w-full text-black"
                />
              </div>
              <div className="mb-4">
                <label className="label text-sm text-white">Make & Model</label>
                {formData.makeModel.map((mm, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      placeholder="Make"
                      value={mm.make}
                      onChange={(e) => handleMakeModelChange(index, 'make', e.target.value)}
                      className="input input-bordered w-1/2 text-black"
                    />
                    <input
                      type="text"
                      placeholder="Model"
                      value={mm.model}
                      onChange={(e) => handleMakeModelChange(index, 'model', e.target.value)}
                      className="input input-bordered w-1/2 text-black"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeMakeModel(index)}
                        className="btn btn-sm bg-red-600 border-none hover:bg-red-700 text-white"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addMakeModel}
                  className="btn btn-sm bg-teal-500 border-none hover:bg-teal-600 text-white mt-2"
                >
                  Add Make/Model
                </button>
              </div>
              <div className="mb-4">
                <label className="label text-sm text-white">Years (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g., 2015,2020"
                  value={formData.years.join(',')}
                  onChange={handleYearsChange}
                  className="input input-bordered w-full text-black"
                />
              </div>
              <div className="mb-4">
                <label className="label text-sm text-white">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered w-full text-black"
                />
              </div>
              <div className="mb-4">
                <label className="label text-sm text-white">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="input input-bordered w-full text-black"
                />
              </div>
              <div className="mb-4">
                <label className="label text-sm text-white">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="input input-bordered w-full text-black"
                />
              </div>
              <div className="mb-4">
                <label className="label text-sm text-white">Image (JPEG/PNG, one only)</label>
                <input
                  type="file"
                  name="image"
                  accept="image/jpeg,image/png"
                  onChange={handleInputChange}
                  className="file-input file-input-bordered w-full text-black"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn bg-orange-500 border-none hover:bg-orange-600 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-teal-500 border-none hover:bg-teal-600 text-white"
                >
                  {isEditing ? 'Update' : 'Create'}
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