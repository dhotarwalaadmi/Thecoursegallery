'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function SiteGuard({ children }) {
  const [sealed, setSealed] = useState(false);
  const [checked, setChecked] = useState(false);
  const pathname = usePathname();

  // Don't block the killswitch page itself or API routes
  const isExempt = pathname === '/killswitch' || pathname.startsWith('/api');

  useEffect(() => {
    if (isExempt) {
      setChecked(true);
      return;
    }

    const checkStatus = () => {
      fetch('/api/killswitch')
        .then(res => res.json())
        .then(data => {
          setSealed(!data.active);
          setChecked(true);
        })
        .catch(() => setChecked(true));
    };

    checkStatus();

    // Re-check every 30 seconds in case admin toggles it
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, [pathname, isExempt]);

  if (!checked) return null;

  if (sealed && !isExempt) {
    return (
      <>
        {children}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.92)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px',
        }}>
          <div style={{
            background: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '12px',
            padding: '50px 40px',
            textAlign: 'center',
            maxWidth: '460px',
            width: '100%',
          }}>
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: '#3a1a1a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 25px',
              fontSize: '32px',
            }}>
              🔒
            </div>
            <h1 style={{
              color: '#f87171',
              fontSize: '22px',
              fontWeight: '800',
              margin: '0 0 15px 0',
            }}>
              Website Sealed
            </h1>
            <p style={{
              color: '#999',
              fontSize: '15px',
              lineHeight: '1.7',
              margin: 0,
            }}>
              The Admin has not done the payment so website will be sealed.
            </p>
          </div>
        </div>
      </>
    );
  }

  return children;
}
