'use client';
import { useState, useEffect } from 'react';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState({ code: '', discountPercent: '', maxUses: '', isActive: true });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/admin/coupons');
      const data = await res.json();
      setCoupons(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to fetch coupons', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing 
        ? `/api/admin/coupons?id=${currentCoupon.id}`
        : '/api/admin/coupons';
      
      const method = isEditing ? 'PATCH' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentCoupon)
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        fetchCoupons();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to save coupon');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCoupons();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openCreateModal = () => {
    setCurrentCoupon({ code: '', discountPercent: '', maxUses: '0', isActive: true });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (coupon) => {
    setCurrentCoupon({ ...coupon });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  if (loading) return <div className="empty-state">Loading...</div>;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Manage Coupons</h1>
        <button className="btn-auth" onClick={openCreateModal} style={{ width: 'auto', padding: '10px 20px' }}>+ Add Coupon</button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Discount (%)</th>
              <th>Usage</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map(coupon => (
              <tr key={coupon.id}>
                <td><strong>{coupon.code}</strong></td>
                <td>{coupon.discountPercent}%</td>
                <td>{coupon.usedCount} / {coupon.maxUses === 0 ? '∞' : coupon.maxUses}</td>
                <td>
                  <span className={`status-badge ${coupon.isActive ? 'status-approved' : 'status-pending'}`}>
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <button className="btn-edit" onClick={() => openEditModal(coupon)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(coupon.id)} style={{ marginLeft: '10px' }}>Delete</button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No coupons found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{isEditing ? 'Edit Coupon' : 'Create Coupon'}</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
              <div className="form-group">
                <label>Coupon Code</label>
                <input 
                  type="text" 
                  value={currentCoupon.code} 
                  onChange={e => setCurrentCoupon({...currentCoupon, code: e.target.value.toUpperCase()})}
                  required 
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div className="form-group">
                <label>Discount Percentage (%)</label>
                <input 
                  type="number" 
                  min="0"
                  max="100"
                  step="0.1"
                  value={currentCoupon.discountPercent} 
                  onChange={e => setCurrentCoupon({...currentCoupon, discountPercent: e.target.value})}
                  required 
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div className="form-group">
                <label>Max Uses (0 for unlimited)</label>
                <input 
                  type="number" 
                  min="0"
                  value={currentCoupon.maxUses} 
                  onChange={e => setCurrentCoupon({...currentCoupon, maxUses: e.target.value})}
                  required 
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input 
                    type="checkbox" 
                    checked={currentCoupon.isActive} 
                    onChange={e => setCurrentCoupon({...currentCoupon, isActive: e.target.checked})}
                  />
                  Is Active?
                </label>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn-auth" style={{ background: '#6c757d' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-auth">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
