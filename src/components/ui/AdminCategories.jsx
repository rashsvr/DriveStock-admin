import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import Alert from './Alert';
import LoadingAnimation from '../function/LoadingAnimation';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: '', parentCategory: '' });
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
      const data = await adminApi.getAllCategories();
      setCategories(data.data);
    } catch (error) {
      setAlert({ type: 'error', message: error.message, onClose: () => setAlert(null) });
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    setLoading(true);
    try {
      // Try getCategoryById first
      const data = await adminApi.getCategoryById(categoryId);
      console.log('getCategoryById response:', data); // Debug log
      // Handle array response
      const category = data.data && data.data[0] ? data.data[0] : null;
      if (category && category.categoryOption) {
        return category.categoryOption;
      }
      // Fallback to getAllCategories if categoryOption is missing
      console.warn('categoryOption missing in getCategoryById, falling back to getAllCategories');
      const allCategoriesData = await adminApi.getAllCategories();
      const matchingCategory = allCategoriesData.data.find((cat) => cat._id === categoryId);
      return matchingCategory && matchingCategory.categoryOption ? matchingCategory.categoryOption : [];
    } catch (error) {
      console.error('fetchSubcategories error:', error); // Debug log
      setAlert({ type: 'error', message: error.message, onClose: () => setAlert(null) });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleMainCategoryChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMainCategorySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      if (editId) {
        await adminApi.updateCategory(editId, formData);
        setAlert({ type: 'success', message: 'Category updated successfully', onClose: () => setAlert(null) });
        setEditId(null);
      } else {
        await adminApi.createCategory(formData);
        setAlert({ type: 'success', message: 'Category created successfully', onClose: () => setAlert(null) });
      }
      setFormData({ name: '', parentCategory: '' });
      fetchCategories();
    } catch (error) {
      setAlert({ type: 'error', message: error.message, onClose: () => setAlert(null) });
    } finally {
      setLoading(false);
    }
  };

  const handleEditMainCategory = (category) => {
    setEditId(category._id);
    setFormData({ name: category.name, parentCategory: category.parentCategory || '' });
  };

  const handleDeleteMainCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category and its subcategories?')) return;
    setLoading(true);
    setAlert(null);
    try {
      await adminApi.deleteCategory(categoryId);
      setAlert({ type: 'success', message: 'Category deleted successfully', onClose: () => setAlert(null) });
      fetchCategories();
    } catch (error) {
      setAlert({ type: 'error', message: error.message, onClose: () => setAlert(null) });
    } finally {
      setLoading(false);
    }
  };

  const openSubcategoryModal = async (categoryId) => {
    const subcategories = await fetchSubcategories(categoryId);
    console.log('Loaded subcategories:', subcategories); // Debug log
    setSubcategoryModal({
      isOpen: true,
      parentId: categoryId,
      subcategories,
      newSubcategoryName: '',
      editSubcategoryId: null,
    });
  };

  const handleSubcategoryNameChange = (e) => {
    setSubcategoryModal({ ...subcategoryModal, newSubcategoryName: e.target.value });
  };

  const handleSubcategorySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      const { parentId, newSubcategoryName, editSubcategoryId, subcategories } = subcategoryModal;
      let updatedSubcategories = [...subcategories];

      if (editSubcategoryId) {
        updatedSubcategories = updatedSubcategories.map((sub) =>
          sub._id === editSubcategoryId ? { ...sub, name: newSubcategoryName } : sub
        );
      } else {
        updatedSubcategories.push({
          _id: `temp-${Date.now()}`,
          name: newSubcategoryName,
          parentCategory: {
            _id: parentId,
            name: categories.find((cat) => cat._id === parentId)?.name || '',
          },
          status: 'active',
        });
      }

      const parentCategory = categories.find((cat) => cat._id === parentId);
      await adminApi.updateCategory(parentId, {
        name: parentCategory.name,
        parentCategory: parentCategory.parentCategory || null,
        categoryOption: updatedSubcategories,
      });

      setAlert({
        type: 'success',
        message: editSubcategoryId ? 'Subcategory updated successfully' : 'Subcategory created successfully',
        onClose: () => setAlert(null),
      });

      const refreshedSubcategories = await fetchSubcategories(parentId);
      setSubcategoryModal({
        ...subcategoryModal,
        subcategories: refreshedSubcategories,
        newSubcategoryName: '',
        editSubcategoryId: null,
      });

      fetchCategories();
    } catch (error) {
      setAlert({ type: 'error', message: error.message, onClose: () => setAlert(null) });
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubcategory = (subcategory) => {
    setSubcategoryModal({
      ...subcategoryModal,
      newSubcategoryName: subcategory.name,
      editSubcategoryId: subcategory._id,
    });
  };

  const handleDeleteSubcategory = async (subcategoryId) => {
    if (!window.confirm('Are you sure you want to delete this subcategory?')) return;
    setLoading(true);
    setAlert(null);
    try {
      const { parentId, subcategories } = subcategoryModal;
      const updatedSubcategories = subcategories.filter((sub) => sub._id !== subcategoryId);

      const parentCategory = categories.find((cat) => cat._id === parentId);
      await adminApi.updateCategory(parentId, {
        name: parentCategory.name,
        parentCategory: parentCategory.parentCategory || null,
        categoryOption: updatedSubcategories,
      });

      setAlert({ type: 'success', message: 'Subcategory deleted successfully', onClose: () => setAlert(null) });
      setSubcategoryModal({
        ...subcategoryModal,
        subcategories: updatedSubcategories,
      });

      fetchCategories();
    } catch (error) {
      setAlert({ type: 'error', message: error.message, onClose: () => setAlert(null) });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingAnimation />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Categories</h2>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Main Category Form */}
      <form onSubmit={handleMainCategorySubmit} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleMainCategoryChange}
            placeholder="Category Name"
            className="input input-bordered w-full"
            required
          />
          <select
            name="parentCategory"
            value={formData.parentCategory}
            onChange={handleMainCategoryChange}
            className="select select-bordered w-full"
          >
            <option value="">No Parent</option>
            {categories
              .filter((cat) => cat._id !== editId)
              .map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>
        <div className="mt-4 flex space-x-2">
          <button type="submit" className="btn btn-primary">
            {editId ? 'Update Category' : 'Create Category'}
          </button>
          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setFormData({ name: '', parentCategory: '' });
              }}
              className="btn btn-ghost"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Subcategory Modal */}
      {subcategoryModal.isOpen && (
        <dialog open className="modal">
          <div className="modal-box bg-[#1A2526] text-white max-w-lg mx-auto p-4 sm:p-6">
            <h3 className="font-bold text-lg sm:text-xl mb-4">
              Subcategories for {categories.find((cat) => cat._id === subcategoryModal.parentId)?.name || 'Category'}
            </h3>

            {/* Add/Edit Subcategory Form */}
            <form onSubmit={handleSubcategorySubmit} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={subcategoryModal.newSubcategoryName}
                  onChange={handleSubcategoryNameChange}
                  placeholder="Subcategory Name"
                  className="input input-bordered w-full text-sm sm:text-base"
                  required
                />
                <button
                  type="submit"
                  className="btn bg-highlight-teal border-none hover:bg-teal-600 text-sm sm:text-base"
                >
                  {subcategoryModal.editSubcategoryId ? 'Update' : 'Add'}
                </button>
              </div>
            </form>

            {/* Subcategories List */}
            {subcategoryModal.subcategories.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subcategoryModal.subcategories.map((sub) => (
                      <tr key={sub._id}>
                        <td>{sub.name}</td>
                        <td>{sub.status || 'N/A'}</td>
                        <td>
                          <button
                            onClick={() => handleEditSubcategory(sub)}
                            className="btn btn-warning btn-xs mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSubcategory(sub._id)}
                            className="btn btn-error btn-xs"
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
                className="btn btn-ghost text-sm sm:text-base"
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

      {/* Categories Table */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Parent Category</th>
              <th>Subcategories</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>
                  {category.parentCategory
                    ? categories.find((c) => c._id === category.parentCategory)?.name || 'N/A'
                    : 'None'}
                </td>
                <td>
                  <button
                    onClick={() => openSubcategoryModal(category._id)}
                    className="btn btn-xs btn-outline btn-accent"
                  >
                    View Subcategories
                  </button>
                </td>
                <td>{category.status}</td>
                <td>
                  <button
                    onClick={() => handleEditMainCategory(category)}
                    className="btn btn-warning btn-sm mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMainCategory(category._id)}
                    className="btn btn-error btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCategories;