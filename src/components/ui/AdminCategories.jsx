import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import Alert from './Alert';
import LoadingAnimation from '../function/LoadingAnimation';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: '', parentCategory: '' });
  const [editId, setEditId] = useState(null);
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
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      if (editId) {
        await adminApi.updateCategory(editId, formData);
        setAlert({ type: 'success', message: 'Category updated successfully' });
        setEditId(null);
      } else {
        await adminApi.createCategory(formData);
        setAlert({ type: 'success', message: 'Category created successfully' });
      }
      fetchCategories();
      setFormData({ name: '', parentCategory: '' });
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditId(category._id);
    setFormData({ name: category.name, parentCategory: category.parentCategory || '' });
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    setLoading(true);
    try {
      await adminApi.deleteCategory(categoryId);
      setAlert({ type: 'success', message: 'Category deleted successfully' });
      fetchCategories();
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingAnimation />;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Categories</h2>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Category Name"
            className="input input-bordered w-full"
            required
          />
          <select
            name="parentCategory"
            value={formData.parentCategory}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            <option value="">No Parent</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary mt-4">
          {editId ? 'Update Category' : 'Create Category'}
        </button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setFormData({ name: '', parentCategory: '' });
            }}
            className="btn btn-ghost mt-4 ml-2"
          >
            Cancel
          </button>
        )}
      </form>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Parent Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>{category.parentCategory ? categories.find(c => c._id === category.parentCategory)?.name || 'N/A' : 'None'}</td>
                <td>{category.status}</td>
                <td>
                  <button
                    onClick={() => handleEdit(category)}
                    className="btn btn-warning btn-sm mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
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