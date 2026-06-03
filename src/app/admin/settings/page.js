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

  // Backup & Restore settings
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

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

  const handleExportData = async () => {
    setExporting(true);
    try {
      const res = await fetch('/api/admin/backup');
      if (!res.ok) throw new Error('Failed to fetch backup');
      const data = await res.json();
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', url);
      const dateStr = new Date().toISOString().split('T')[0];
      downloadAnchor.setAttribute('download', `course-gallery-backup-${dateStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Export failed: ' + e.message);
    } finally {
      setExporting(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleImportData = async () => {
    if (!selectedFile) return;
    
    const confirmRestore = window.confirm(
      "WARNING: Importing data will completely overwrite the existing products, categories, orders, coupons, settings, and users in your database. This action CANNOT be undone. Are you sure you want to proceed?"
    );
    if (!confirmRestore) return;

    setImporting(true);
    try {
      const fileReader = new FileReader();
      fileReader.onload = async (event) => {
        try {
          const parsedData = JSON.parse(event.target.result);
          
          if (!parsedData.products || !parsedData.categories) {
            throw new Error("Invalid backup file format: Missing 'products' or 'categories' keys.");
          }

          const res = await fetch('/api/admin/backup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parsedData),
          });

          const resData = await res.json();
          if (res.ok) {
            alert('✓ Database imported and restored successfully!');
            window.location.reload();
          } else {
            alert('Import failed: ' + (resData.error || 'Server error'));
          }
        } catch (err) {
          alert('Failed to parse file: ' + err.message);
        } finally {
          setImporting(false);
        }
      };
      fileReader.readAsText(selectedFile);
    } catch (e) {
      alert('Import failed: ' + e.message);
      setImporting(false);
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
        <h3>Backup / Restore Data (Export & Import)</h3>
        <p style={{ color: '#666', fontSize: '13px', marginBottom: '15px' }}>
          Export all products, categories, coupons, settings, and customer order records to a JSON file. You can import this file later to restore all records.
        </p>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button 
            className="btn-admin-add" 
            onClick={handleExportData} 
            disabled={exporting}
            style={{ margin: 0, background: '#10b981' }}
          >
            {exporting ? 'Exporting...' : 'Export Data (JSON)'}
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '1px dashed #cbd5e1', padding: '10px 15px', borderRadius: '8px', background: '#f8fafc' }}>
            <input 
              type="file" 
              accept=".json" 
              onChange={handleFileChange} 
              style={{ fontSize: '13px' }}
            />
            <button 
              className="btn-admin-add" 
              onClick={handleImportData} 
              disabled={importing || !selectedFile}
              style={{ margin: 0, background: '#ef4444' }}
            >
              {importing ? 'Importing...' : 'Import Data (JSON)'}
            </button>
          </div>
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
