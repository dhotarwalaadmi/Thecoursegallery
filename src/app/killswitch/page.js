'use client';
import { useState, useEffect } from 'react';

const SECRET = 'KILLSWITCH_SECRET_2026';

export default function KillSwitchPage() {
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    fetch('/api/killswitch')
      .then(res => res.json())
      .then(data => {
        setActive(data.active);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggle = async (action) => {
    setToggling(true);
    try {
      const res = await fetch('/api/killswitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, secret: SECRET }),
      });
      const data = await res.json();
      if (data.success) {
        setActive(data.active);
      }
    } catch (err) {
      alert('Failed to toggle');
    }
    setToggling(false);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: '#fff' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0a',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <div style={{
        background: '#141414',
        border: '1px solid #222',
        borderRadius: '12px',
        padding: '50px 40px',
        textAlign: 'center',
        maxWidth: '400px',
        width: '90%',
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: active ? '#1a3a1a' : '#3a1a1a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          fontSize: '28px',
        }}>
          {active ? '🟢' : '🔴'}
        </div>

        <h1 style={{
          color: '#fff',
          fontSize: '22px',
          fontWeight: '800',
          margin: '0 0 8px 0',
          letterSpacing: '1px',
        }}>
          KILL SWITCH
        </h1>

        <p style={{
          color: '#666',
          fontSize: '13px',
          margin: '0 0 30px 0',
        }}>
          Website is currently <strong style={{ color: active ? '#4ade80' : '#f87171' }}>{active ? 'ACTIVE' : 'SEALED'}</strong>
        </p>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => toggle('on')}
            disabled={toggling || active}
            style={{
              flex: 1,
              padding: '14px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: active || toggling ? 'not-allowed' : 'pointer',
              background: active ? '#1a3a1a' : '#22c55e',
              color: active ? '#4ade80' : '#fff',
              opacity: active ? 0.5 : 1,
              transition: 'all 0.2s',
            }}
          >
            {toggling ? '...' : 'Turn ON'}
          </button>

          <button
            onClick={() => toggle('off')}
            disabled={toggling || !active}
            style={{
              flex: 1,
              padding: '14px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: !active || toggling ? 'not-allowed' : 'pointer',
              background: !active ? '#3a1a1a' : '#ef4444',
              color: !active ? '#f87171' : '#fff',
              opacity: !active ? 0.5 : 1,
              transition: 'all 0.2s',
            }}
          >
            {toggling ? '...' : 'Turn OFF'}
          </button>
        </div>

        <p style={{ color: '#444', fontSize: '11px', marginTop: '25px' }}>
          Turning OFF will seal the entire website for all users.
        </p>
      </div>
    </div>
  );
}
