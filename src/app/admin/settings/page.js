'use client';
import { useState, useEffect } from 'react';

export default function AdminSettingsPage() {
  const [upiId, setUpiId] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Promo Banner Settings
  const [promoText, setPromoText] = useState('Only for Today 70.00% Discount on All Order ( Except a few ) . Use Code :SAVE70');
  const [promoEnabled, setPromoEnabled] = useState(true);
  const [savingPromo, setSavingPromo] = useState(false);
  const [savedPromo, setSavedPromo] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.upi_id) setUpiId(data.upi_id);
        if (data.promo_text !== undefined) setPromoText(data.promo_text);
        if (data.promo_enabled !== undefined) setPromoEnabled(data.promo_enabled === 'true');
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'upi_id', value: upiId }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (e) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePromo = async () => {
    setSavingPromo(true);
    setSavedPromo(false);
    try {
      const res1 = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'promo_text', value: promoText }),
      });
      const res2 = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'promo_enabled', value: promoEnabled ? 'true' : 'false' }),
      });
      if (res1.ok && res2.ok) {
        setSavedPromo(true);
        setTimeout(() => setSavedPromo(false), 3000);
      } else {
        alert('Failed to save promo settings');
      }
    } catch (e) {
      alert('Failed to save settings');
    } finally {
      setSavingPromo(false);
    }
  };

  return (
    <>
      <h1>Settings</h1>

      <div className="settings-section">
        <h3>UPI Payment Configuration</h3>
        <p style={{ color: '#666', fontSize: '13px', marginBottom: '15px' }}>
          Enter your UPI ID below. This will be used to generate QR codes for customer payments.
        </p>
        <div className="settings-row">
          <input
            type="text"
            value={upiId}
            onChange={e => setUpiId(e.target.value)}
            placeholder="yourname@upi"
          />
          <button className="btn-settings-save" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save'}
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h3>Header Promo Banner Settings</h3>
        <p style={{ color: '#666', fontSize: '13px', marginBottom: '15px' }}>
          Edit the notification text displayed at the very top of all shop pages, or toggle its visibility.
        </p>
        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={promoEnabled}
              onChange={e => setPromoEnabled(e.target.checked)}
              style={{ width: 'auto' }}
            />
            Enable Promo Banner
          </label>
        </div>
        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#444' }}>Promo Text</label>
          <input
            type="text"
            value={promoText}
            onChange={e => setPromoText(e.target.value)}
            placeholder="Enter banner text here..."
            style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
          />
        </div>
        <button className="btn-settings-save" onClick={handleSavePromo} disabled={savingPromo}>
          {savingPromo ? 'Saving...' : savedPromo ? '✓ Saved!' : 'Save Promo'}
        </button>
      </div>

      <div className="settings-section">
        <h3>Admin Credentials</h3>
        <p style={{ color: '#666', fontSize: '13px' }}>
          Current admin: <strong>admin@coursegallery.com</strong>
        </p>
        <p style={{ color: '#999', fontSize: '12px', marginTop: '8px' }}>
          To change admin credentials, update the database directly or modify the seed script.
        </p>
      </div>
    </>
  );
}
