'use client';
import { useState, useEffect } from 'react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', imageUrl: '', oldPrice: '', newPrice: '',
    discountBadge: '', isFeatured: false, isPopular: false, downloadUrl: '', categoryIds: []
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('/api/admin/products');
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
  };

  const fetchCategories = async () => {
    const res = await fetch('/api/admin/categories');
    const data = await res.json();
    setCategories(Array.isArray(data) ? data : []);
  };

  const openAdd = () => {
    setEditingProduct(null);
    setForm({ title: '', description: '', imageUrl: '', oldPrice: '', newPrice: '', discountBadge: '', isFeatured: false, isPopular: false, downloadUrl: '', categoryIds: [] });
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setForm({
      title: product.title,
      description: product.description || '',
      imageUrl: product.imageUrl,
      oldPrice: product.oldPrice.toString(),
      newPrice: product.newPrice.toString(),
      discountBadge: product.discountBadge,
      isFeatured: product.isFeatured,
      isPopular: product.isPopular,
      downloadUrl: product.downloadUrl || '',
      categoryIds: product.categories?.map(c => c.id) || [],
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    const method = editingProduct ? 'PUT' : 'POST';
    const body = editingProduct ? { id: editingProduct.id, ...form } : form;

    const res = await fetch('/api/admin/products', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setShowModal(false);
      fetchProducts();
    } else {
      const data = await res.json();
      alert(data.error || 'Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const res = await fetch('/api/admin/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) fetchProducts();
  };

  const toggleCategory = (catId) => {
    setForm(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(catId)
        ? prev.categoryIds.filter(id => id !== catId)
        : [...prev.categoryIds, catId]
    }));
  };

  return (
    <>
      <h1>Products</h1>
      <button className="btn-admin-add" onClick={openAdd}>+ Add Product</button>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Old Price</th>
            <th>New Price</th>
            <th>Discount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td style={{ maxWidth: '200px' }}>{product.title}</td>
              <td style={{ fontSize: '11px', maxWidth: '150px' }}>{product.categories?.map(c => c.name).join(', ')}</td>
              <td>₹{product.oldPrice.toLocaleString()}</td>
              <td>₹{product.newPrice.toLocaleString()}</td>
              <td>{product.discountBadge}</td>
              <td>
                <button className="btn-admin btn-admin-edit" onClick={() => openEdit(product)}>Edit</button>
                <button className="btn-admin btn-admin-delete" onClick={() => handleDelete(product.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="admin-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="admin-modal">
            <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
            <div className="form-group">
              <label>Title</label>
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="form-group">
                <label>Old Price (₹)</label>
                <input type="number" value={form.oldPrice} onChange={e => setForm({...form, oldPrice: e.target.value})} />
              </div>
              <div className="form-group">
                <label>New Price (₹)</label>
                <input type="number" value={form.newPrice} onChange={e => setForm({...form, newPrice: e.target.value})} />
              </div>
            </div>
            <div className="form-group">
              <label>Discount Badge (e.g. -93%)</label>
              <input value={form.discountBadge} onChange={e => setForm({...form, discountBadge: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Download URL (optional)</label>
              <input value={form.downloadUrl} onChange={e => setForm({...form, downloadUrl: e.target.value})} />
            </div>
            <div className="form-group">
              <label style={{ marginBottom: '8px', display: 'block' }}>Categories</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    style={{
                      padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600',
                      border: form.categoryIds.includes(cat.id) ? '2px solid #0b2de6' : '1px solid #ddd',
                      background: form.categoryIds.includes(cat.id) ? '#e8f0fe' : 'white',
                      color: form.categoryIds.includes(cat.id) ? '#0b2de6' : '#555',
                      cursor: 'pointer',
                    }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({...form, isFeatured: e.target.checked})} />
                Featured
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                <input type="checkbox" checked={form.isPopular} onChange={e => setForm({...form, isPopular: e.target.checked})} />
                Popular
              </label>
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
