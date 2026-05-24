'use client';
import { useState, useEffect } from 'react';

export default function AdminSettingsPage() {
  const [upiId, setUpiId] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.upi_id) setUpiId(data.upi_id);
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
