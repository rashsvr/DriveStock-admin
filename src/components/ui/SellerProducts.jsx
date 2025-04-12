import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import Table from './Table';
import Alert from './Alert';
import ConfirmationModal from './ConfirmationModal';
import LoadingAnimation from '../function/LoadingAnimation';

const SellerProducts = () => {
  const { createProduct, getSellerProducts, updateProduct, deleteProduct } = useAuth();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    condition: 'New',
  });
  const [updateData, setUpdateData] = useState({});

  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => getSellerProducts({ page: 1, limit: 100 }), // Fetch all for simplicity
  });

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      setIsCreateModalOpen(false);
      setNewProduct({ title: '', description: '', price: '', category: '', stock: '', condition: 'New' });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ productId, productData }) => updateProduct(productId, productData),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      setUpdateData({});
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      setIsDeleteModalOpen(false);
      setSelectedProductId(null);
    },
  });

  const handleCreateProduct = () => {
    createProductMutation.mutate({
      ...newProduct,
      price: parseFloat(newProduct.price) || 0,
      stock: parseInt(newProduct.stock) || 0,
    });
  };

  const handleUpdateProduct = (productId, field, value) => {
    const updatedValue = field === 'price' ? parseFloat(value) : field === 'stock' ? parseInt(value) : value;
    setUpdateData((prev) => ({ ...prev, [field]: updatedValue }));
    updateProductMutation.mutate({ productId, productData: { [field]: updatedValue } });
  };

  const handleDeleteProduct = (productId) => {
    setSelectedProductId(productId);
    setIsDeleteModalOpen(true);
  };

  if (isLoading) {
    return <LoadingAnimation />;
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert type="error" message={error.message || 'Failed to load products'} />
      </div>
    );
  }

  const products = data?.data || [];

  const columns = [
    { key: 'title', label: 'Title' },
    {
      key: 'price',
      label: 'Price',
      render: (item) => (
        <input
          type="number"
          defaultValue={item.price}
          onBlur={(e) => handleUpdateProduct(item._id, 'price', e.target.value)}
          className="input input-bordered input-sm bg-[#2A3536] text-white w-24"
        />
      ),
    },
    {
      key: 'stock',
      label: 'Stock',
      render: (item) => (
        <input
          type="number"
          defaultValue={item.stock}
          onBlur={(e) => handleUpdateProduct(item._id, 'stock', e.target.value)}
          className="input input-bordered input-sm bg-[#2A3536] text-white w-24"
        />
      ),
    },
    { key: 'availability', label: 'Availability' },
  ];

  const actions = [
    {
      label: 'Delete',
      className: 'btn-error bg-red-600 hover:bg-red-700',
      onClick: (product) => handleDeleteProduct(product._id),
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-base-100 text-white">
      <h1 className="text-2xl sm:text-3xl font-bold">Seller Products</h1>

      {(createProductMutation.isError || updateProductMutation.isError || deleteProductMutation.isError) && (
        <Alert
          type="error"
          message={
            createProductMutation.error?.message ||
            updateProductMutation.error?.message ||
            deleteProductMutation.error?.message ||
            'An error occurred'
          }
        />
      )}

      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="btn btn-primary bg-highlight-blue hover:bg-blue-700"
      >
        Add Product
      </button>

      <div className="card bg-[#2A3536] shadow-xl">
        <div className="card-body">
          <Table
            data={products}
            columns={columns}
            actions={actions}
            emptyMessage="No products found"
          />
        </div>
      </div>

      {/* Create Product Modal */}
      <ConfirmationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onConfirm={handleCreateProduct}
        title="Create New Product"
        message={
          <div className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text text-white">Title</span>
              </label>
              <input
                type="text"
                value={newProduct.title}
                onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                className="input input-bordered w-full bg-[#2A3536] text-white"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text text-white">Description</span>
              </label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="textarea textarea-bordered w-full bg-[#2A3536] text-white"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text text-white">Price</span>
              </label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                className="input input-bordered w-full bg-[#2A3536] text-white"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text text-white">Category</span>
              </label>
              <input
                type="text"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="input input-bordered w-full bg-[#2A3536] text-white"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text text-white">Stock</span>
              </label>
              <input
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                className="input input-bordered w-full bg-[#2A3536] text-white"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text text-white">Condition</span>
              </label>
              <select
                value={newProduct.condition}
                onChange={(e) => setNewProduct({ ...newProduct, condition: e.target.value })}
                className="select select-bordered w-full bg-[#2A3536] text-white"
              >
                <option value="New">New</option>
                <option value="Used">Used</option>
                <option value="Refurbished">Refurbished</option>
              </select>
            </div>
          </div>
        }
        confirmText={createProductMutation.isLoading ? 'Creating...' : 'Create'}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => deleteProductMutation.mutate(selectedProductId)}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText={deleteProductMutation.isLoading ? 'Deleting...' : 'Delete'}
      />
    </div>
  );
};

export default SellerProducts;