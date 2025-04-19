import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import Alert from './Alert';
import LoadingAnimation from '../function/LoadingAnimation';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: '' });
  const [editId, setEditId] = useState(null);
  const [subcategoryModal, setSubcategoryModal] = useState({
    isOpen: false,
    parentId: null,
    subcategories: [],
    newSubcategoryName: '',
    editSubcategoryId: null,
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getAllCategories();
      console.log('Fetched Categories:', response.data); // Debug log
      setCategories(response.data || []);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error) => {
    const status = error.code || error.response?.status;
    const messages = {
      400: 'Invalid category name provided.',
      401: 'Unauthorized: Please log in.',
      403: 'Forbidden: Admin access required.',
      404: 'Category not found.',
      409: 'Category name already exists.',
      500: 'Server error. Please try again later.',
    };
    setAlert({
      type: 'error',
      message: messages[status] || error.message || 'An error occurred.',
      onClose: () => setAlert(null),
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setAlert({ type: 'error', message: 'Category name is required.', onClose: () => setAlert(null) });
      return;
    }
    setLoading(true);
    setAlert(null);
    try {
      if (editId) {
        console.log('Updating main category:', { name: formData.name }); // Debug log
        await adminApi.updateCategory(editId, { name: formData.name });
        setAlert({ type: 'success', message: 'Category updated successfully', onClose: () => setAlert(null) });
        setEditId(null);
      } else {
        console.log('Creating main category:', { name: formData.name }); // Debug log
        await adminApi.createCategory({ name: formData.name });
        setAlert({ type: 'success', message: 'Category created successfully', onClose: () => setAlert(null) });
      }
      setFormData({ name: '' });
      await fetchCategories();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditId(category._id);
    setFormData({ name: category.name });
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to soft-delete this category?')) return;
    setLoading(true);
    setAlert(null);
    try {
      const category = categories.find((cat) => cat._id === categoryId);
      if (category.categoryOption && category.categoryOption.filter((sub) => sub.status !== 'deleted').length > 0) {
        setAlert({
          type: 'error',
          message: 'Cannot delete category with active subcategories.',
          onClose: () => setAlert(null),
        });
        return;
      }
      console.log('Deleting main category:', categoryId); // Debug log
      await adminApi.deleteCategory(categoryId);
      setAlert({ type: 'success', message: 'Category marked as deleted', onClose: () => setAlert(null) });
      await fetchCategories();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const openSubcategoryModal = (category) => {
    console.log('Opening modal for parentId:', category._id, 'with subcategories:', category.categoryOption); // Debug log
    setSubcategoryModal({
      isOpen: true,
      parentId: category._id,
      subcategories: category.categoryOption || [],
      newSubcategoryName: '',
      editSubcategoryId: null,
    });
  };

  const handleSubcategoryNameChange = (e) => {
    setSubcategoryModal({ ...subcategoryModal, newSubcategoryName: e.target.value });
  };

  const handleSubcategorySubmit = async (e) => {
    e.preventDefault();
    if (!subcategoryModal.newSubcategoryName.trim()) {
      setAlert({ type: 'error', message: 'Subcategory name is required.', onClose: () => setAlert(null) });
      return;
    }
    setLoading(true);
    setAlert(null);
    try {
      const { parentId, newSubcategoryName, editSubcategoryId } = subcategoryModal;

      if (editSubcategoryId) {
        console.log('Updating subcategory:', { id: editSubcategoryId, name: newSubcategoryName }); // Debug log
        await adminApi.updateCategory(editSubcategoryId, {
          name: newSubcategoryName,
          parentCategory: parentId,
        });
        setAlert({ type: 'success', message: 'Subcategory updated successfully', onClose: () => setAlert(null) });
      } else {
        console.log('Creating subcategory:', { name: newSubcategoryName, parentCategory: parentId }); // Debug log
        await adminApi.createCategory({
          name: newSubcategoryName,
          parentCategory: parentId,
        });
        setAlert({ type: 'success', message: 'Subcategory created successfully', onClose: () => setAlert(null) });
      }

      // Refetch categories to update modal
      const updatedCategories = await adminApi.getAllCategories();
      const updatedCategory = updatedCategories.data.find((cat) => cat._id === parentId);
      console.log('Updated subcategories:', updatedCategory?.categoryOption); // Debug log
      setSubcategoryModal | ({
        isOpen: true, // Keep modal open
        parentId,
        subcategories: updatedCategory?.categoryOption || [],
        newSubcategoryName: '',
        editSubcategoryId: null,
      });
      setCategories(updatedCategories.data || []);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubcategory = (subcategory) => {
    console.log('Editing subcategory:', subcategory); // Debug log
    setSubcategoryModal({
      ...subcategoryModal,
      newSubcategoryName: subcategory.name,
      editSubcategoryId: subcategory._id,
    });
  };

  const handleDeleteSubcategory = async (subcategoryId) => {
    if (!window.confirm('Are you sure you want to soft-delete this subcategory?')) return;
    setLoading(true);
    setAlert(null);
    try {
      console.log('Deleting subcategory:', subcategoryId); // Debug log
      await adminApi.deleteCategory(subcategoryId);
      setAlert({ type: 'success', message: 'Subcategory marked as deleted', onClose: () => setAlert(null) });

      // Refetch categories to update modal
      const updatedCategories = await adminApi.getAllCategories();
      const updatedCategory = updatedCategories.data.find((cat) => cat._id === subcategoryModal.parentId);
      console.log('Updated subcategories after delete:', updatedCategory?.categoryOption); // Debug log
      setSubcategoryModal({
        isOpen: true, // Keep modal open
        parentId: subcategoryModal.parentId,
        subcategories: updatedCategory?.categoryOption || [],
        newSubcategoryName: '',
        editSubcategoryId: null,
      });
      setCategories(updatedCategories.data || []);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingAnimation />;

  return (
    <div className="p-4 bg-[#1A2526] text-white min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-blue-500">Manage Categories</h2>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Main Category Form */}
      <form onSubmit={handleSubmit} className="mb-6 bg-[#1A2526] p-4 rounded-lg">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="label text-white">Category Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Category Name"
              className="input input-bordered w-full bg-gray-800 text-white placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
          <button type="submit" className="btn bg-teal-500 border-none hover:bg-teal-600 w-full sm:w-auto">
            {editId ? 'Update Category' : 'Create Category'}
          </button>
          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setFormData({ name: '' });
              }}
              className="btn bg-orange-500 border-none hover:bg-orange-600 text-white w-full sm:w-auto"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Subcategory Modal */}
      {subcategoryModal.isOpen && (
        <dialog open className="modal">
          <div className="modal-box bg-[#1A2526] text-white w-full max-w-lg p-6">
            <h3 className="font-bold text-xl mb-4">
              Subcategories for{' '}
              {categories.find((cat) => cat._id === subcategoryModal.parentId)?.name || 'Category'}
            </h3>

            {/* Add/Edit Subcategory Form */}
            <form onSubmit={handleSubcategorySubmit} className="mb-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="label text-white">Subcategory Name</label>
                  <input
                    type="text"
                    value={subcategoryModal.newSubcategoryName}
                    onChange={handleSubcategoryNameChange}
                    placeholder="Subcategory Name"
                    className="input input-bordered w-full bg-gray-800 text-white placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500"
                    required
                  />
                </div>
              </div>
              <div className="mt-4">
                <button type="submit" className="btn bg-teal-500 border-none hover:bg-teal-600 w-full sm:w-auto">
                  {subcategoryModal.editSubcategoryId ? 'Update' : 'Add'}
                </button>
              </div>
            </form>

            {/* Subcategories List */}
            {subcategoryModal.subcategories.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table w-full bg-[#1A2526] text-white">
                  <thead className="text-gray-300">
                    <tr>
                      <th className="text-left">Name</th>
                      <th className="text-left">Status</th>
                      <th className="text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subcategoryModal.subcategories
                      .filter((sub) => sub.status !== 'deleted')
                      .map((sub) => (
                        <tr key={sub._id}>
                          <td>{sub.name}</td>
                          <td>{sub.status || 'N/A'}</td>
                          <td className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <button
                              onClick={() => handleEditSubcategory(sub)}
                              className="btn btn-sm bg-blue-500 text-white hover:bg-blue-600 w-full sm:w-auto"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteSubcategory(sub._id)}
                              className="btn btn-sm btn-error text-white hover:bg-red-600 w-full sm:w-auto"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-400">No subcategories found. Add one above.</p>
            )}

            <div className="modal-action">
              <button
                type="button"
                className="btn bg-orange-500 border-none hover:bg-orange-600 text-white w-full sm:w-auto"
                onClick={() =>
                  setSubcategoryModal({
                    isOpen: false,
                    parentId: null,
                    subcategories: [],
                    newSubcategoryName: '',
                    editSubcategoryId: null,
                  })
                }
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}

      {/* Main Categories Table */}
      <div className="overflow-x-auto rounded-lg">
        <table className="table w-full bg-[#1A2526] text-white">
          <thead className="text-blue-500">
            <tr>
              <th className="text-left">Name</th>
              <th className="text-left">Status</th>
              <th className="text-left">Subcategories</th>
              <th className="text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories
                .filter((cat) => !cat.parentCategory && cat.status !== 'deleted')
                .map((category) => (
                  <tr key={category._id}>
                    <td>{category.name}</td>
                    <td>{category.status || 'N/A'}</td>
                    <td>
                      <button
                        onClick={() => openSubcategoryModal(category)}
                        className="btn btn-sm bg-orange-500 text-white hover:bg-orange-600 w-full sm:w-auto"
                      >
                        View ({(category.categoryOption || []).filter((sub) => sub.status !== 'deleted').length})
                      </button>
                    </td>
                    <td className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="btn btn-sm bg-blue-500 text-white hover:bg-blue-600 w-full sm:w-auto"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="btn btn-sm btn-error text-white hover:bg-red-600 w-full sm:w-auto"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-gray-400">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCategories;