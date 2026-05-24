'use client';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import FloatingFAB from '@/components/FloatingFAB';
import CurrencyWidget from '@/components/CurrencyWidget';

export default function MyAccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  if (status === 'loading') {
    return (
      <>
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} onCartOpen={() => setCartOpen(true)} />
        <div className="empty-state"><p>Loading...</p></div>
      </>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} onCartOpen={() => setCartOpen(true)} />

        <div className="static-page">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / <span>My Account</span>
          </div>

          <h1>My Account</h1>

          <div className="account-auth-grid">
            <div className="account-auth-card">
              <h2>Login</h2>
              <p>Already have an account? Sign in to access your orders and courses.</p>
              <button className="btn-auth" onClick={() => router.push('/login')}>Sign In</button>
            </div>
            <div className="account-auth-card">
              <h2>Register</h2>
              <p>New customer? Create an account to get started.</p>
              <button className="btn-auth" onClick={() => router.push('/signup')}>Create Account</button>
            </div>
          </div>
        </div>

        <Footer />
        <FloatingFAB />
        <CurrencyWidget />
      </>
    );
  }

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} onCartOpen={() => setCartOpen(true)} />

      <div className="static-page">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / <span>My Account</span>
        </div>

        <h1>My Account</h1>

        <div className="account-welcome">
          <p>Hello, <strong>{session.user.name}</strong> ({session.user.email})</p>
        </div>

        <div className="account-links-grid">
          <Link href="/my-orders" className="account-link-card">
            <span className="account-link-icon">📋</span>
            <h3>My Orders</h3>
            <p>View your order history and status</p>
          </Link>
          <Link href="/my-courses" className="account-link-card">
            <span className="account-link-icon">📚</span>
            <h3>My Courses</h3>
            <p>Access your purchased courses</p>
          </Link>
          <Link href="/request-course" className="account-link-card">
            <span className="account-link-icon">📝</span>
            <h3>Request Course</h3>
            <p>Request a course you want us to add</p>
          </Link>
          <Link href="/cart" className="account-link-card">
            <span className="account-link-icon">🛒</span>
            <h3>Cart</h3>
            <p>View items in your shopping cart</p>
          </Link>
        </div>

        {session.user.role === 'admin' && (
          <div className="account-admin-link">
            <Link href="/admin" className="account-link-card account-admin">
              <span className="account-link-icon">⚙️</span>
              <h3>Admin Panel</h3>
              <p>Manage products, orders, and settings</p>
            </Link>
          </div>
        )}

        <button
          className="btn-logout"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          Logout
        </button>
      </div>

      <Footer />
      <FloatingFAB />
      <CurrencyWidget />
    </>
  );
}
