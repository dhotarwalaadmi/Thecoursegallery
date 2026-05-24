'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import FloatingFAB from '@/components/FloatingFAB';
import CurrencyWidget from '@/components/CurrencyWidget';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';

export default function CartPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { cart, cartTotal, removeFromCart, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const router = useRouter();

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} onCartOpen={() => setCartOpen(true)} />

      <div className="static-page">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / <span>Cart</span>
        </div>

        <h1>Cart</h1>

        {cart.length === 0 ? (
          <div className="empty-state">
            <h3>Your cart is empty</h3>
            <p>Looks like you haven&apos;t added any courses yet.</p>
            <button className="btn-auth" onClick={() => router.push('/')} style={{ maxWidth: '200px', margin: '20px auto 0' }}>
              Browse Courses
            </button>
          </div>
        ) : (
          <>
            <table className="cart-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {cart.map(item => (
                  <tr key={item.id}>
                    <td>
                      <button className="cart-remove-btn" onClick={() => removeFromCart(item.id)} title="Remove">✕</button>
                    </td>
                    <td>
                      <div className="cart-product-cell">
                        <div className="cart-product-thumb" style={{ backgroundImage: `url(${item.imageUrl})` }}></div>
                        <Link href={`/product/${item.slug}`} className="cart-product-name">{item.title}</Link>
                      </div>
                    </td>
                    <td>{formatPrice(item.newPrice)}</td>
                    <td>{item.quantity || 1}</td>
                    <td><strong>{formatPrice(item.newPrice * (item.quantity || 1))}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="cart-totals">
              <h3>Cart Totals</h3>
              <div className="cart-totals-row">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="cart-totals-row cart-totals-total">
                <span>Total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <button className="btn-submit-order" onClick={() => router.push('/checkout')}>
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>

      <Footer />
      <FloatingFAB />
      <CurrencyWidget />
    </>
  );
}
