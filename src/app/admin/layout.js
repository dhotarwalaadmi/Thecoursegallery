'use client';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

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
    { href: '/admin/orders', label: 'Orders', icon: '📋' },
    { href: '/admin/course-requests', label: 'Course Requests', icon: '📝' },
    { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
    { href: '/', label: 'View Store', icon: '🏪' },
  ];

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
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
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
}
