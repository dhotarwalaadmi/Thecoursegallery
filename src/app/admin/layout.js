'use client';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Close sidebar on navigation change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/');
    }
  }, [status, session]);

  if (status === 'loading') {
    return <div className="empty-state"><p>Loading...</p></div>;
  }

  if (session?.user?.role !== 'admin') {
    return <div className="empty-state"><p>Access denied</p></div>;
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/products', label: 'Products', icon: '📦' },
    { href: '/admin/categories', label: 'Categories', icon: '🏷️' },
    { href: '/admin/coupons', label: 'Coupons', icon: '🎟️' },
    { href: '/admin/orders', label: 'Orders', icon: '📋' },
    { href: '/admin/course-requests', label: 'Course Requests', icon: '📝' },
    { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
    { href: '/', label: 'View Store', icon: '🏪' },
  ];

  return (
    <div className="admin-layout">
      {/* Mobile Top Header */}
      <div className="admin-mobile-header" style={{
        display: 'none',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        background: '#0f172a',
        color: 'white',
        borderBottom: '1px solid #1e293b',
        position: 'sticky',
        top: 0,
        zIndex: 2000,
      }}>
        <button 
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)} 
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          ☰
        </button>
        <div style={{ fontWeight: '800', color: '#3b82f6', letterSpacing: '0.5px' }}>ADMIN PANEL</div>
        <div style={{ width: '24px' }}></div> {/* Spacer */}
      </div>

      {/* Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="admin-sidebar-overlay" onClick={() => setMobileSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <div className={`admin-sidebar ${mobileSidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-brand">Admin Panel</div>
        <ul className="admin-nav">
          {navItems.map(item => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={pathname === item.href ? 'active' : ''}
              >
                <span>{item.icon}</span> {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
}
