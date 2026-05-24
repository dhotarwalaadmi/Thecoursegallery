'use client';
import { useState, useEffect } from 'react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch('/api/admin/categories');
    const data = await res.json();
    setCategories(Array.isArray(data) ? data : []);
  };

  const openAdd = () => {
    setEditingCategory(null);
    setName('');
    setShowModal(true);
  };

  const openEdit = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return;

    const method = editingCategory ? 'PUT' : 'POST';
    const body = editingCategory ? { id: editingCategory.id, name: name.trim() } : { name: name.trim() };

    const res = await fetch('/api/admin/categories', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setShowModal(false);
      fetchCategories();
    } else {
      const data = await res.json();
      alert(data.error || 'Failed to save category');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure? This will remove the category from all products.')) return;
    const res = await fetch('/api/admin/categories', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) fetchCategories();
  };

  return (
    <>
      <h1>Categories</h1>
      <button className="btn-admin-add" onClick={openAdd}>+ Add Category</button>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Products</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id}>
              <td style={{ fontWeight: '600' }}>{cat.name}</td>
              <td style={{ fontSize: '12px', color: '#999' }}>{cat.slug}</td>
              <td>{cat._count?.products || 0}</td>
              <td>
                <button className="btn-admin btn-admin-edit" onClick={() => openEdit(cat)}>Edit</button>
                <button className="btn-admin btn-admin-delete" onClick={() => handleDelete(cat.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="admin-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="admin-modal">
            <h2>{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
            <div className="form-group">
              <label>Category Name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. FOREX COURSES"
                onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
              />
            </div>
            <div className="admin-modal-actions">
              <button className="btn-modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-modal-save" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
