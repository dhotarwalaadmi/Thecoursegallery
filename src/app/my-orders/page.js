'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import { useCurrency } from '@/context/CurrencyContext';

export default function MyOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { formatPrice } = useCurrency();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to fetch orders:', e);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <>
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} onCartOpen={() => setCartOpen(true)} />
        <div className="empty-state"><p>Loading...</p></div>
      </>
    );
  }

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} onCartOpen={() => setCartOpen(true)} />

      <div className="user-page">
        <h1>My Orders</h1>

        {orders.length === 0 ? (
          <div className="empty-state">
            <h3>No orders yet</h3>
            <p>Start shopping to see your orders here</p>
          </div>
        ) : (
          orders.map(order => (
            <div className="order-card" key={order.id}>
              <div className="order-card-header">
                <span className="order-id">Order #{order.id.slice(-8).toUpperCase()}</span>
                <span className={`order-status status-${order.status}`}>
                  {order.status}
                </span>
              </div>
              <div className="order-items-list">
                {order.items?.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f0f0f0', gap: '15px' }}>
                    <span style={{ fontWeight: '500' }}>{item.product?.title} — <strong style={{ color: '#0b2de6' }}>{formatPrice(item.price)}</strong></span>
                    {order.status === 'approved' && (
                      item.product?.downloadUrl ? (
                        <a
                          href={item.product.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            background: '#0b2de6',
                            color: 'white',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '600',
                            textDecoration: 'none',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Download Course
                        </a>
                      ) : (
                        <span style={{ fontSize: '11px', color: '#999', fontStyle: 'italic', whiteSpace: 'nowrap' }}>Download coming soon</span>
                      )
                    )}
                  </div>
                ))}
              </div>
              <div className="order-total">Total: {formatPrice(order.totalAmount)}</div>
              <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>

      <Footer />
    </>
  );
}
