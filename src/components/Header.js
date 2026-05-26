'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function Header({ onMenuToggle, onCartOpen }) {
  const [promoVisible, setPromoVisible] = useState(false);
  const [promoText, setPromoText] = useState('Only for Today 70.00% Discount on All Order ( Except a few ) . Use Code :SAVE70');
  const { cartCount } = useCart();

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('promoDismissed') === 'true') {
      return;
    }

    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        const enabled = data.promo_enabled !== 'false'; // default true
        const text = data.promo_text || 'Only for Today 70.00% Discount on All Order ( Except a few ) . Use Code :SAVE70';
        if (enabled) {
          setPromoText(text);
          setPromoVisible(true);
        }
      })
      .catch(() => {});
  }, []);

  const handleDismiss = () => {
    setPromoVisible(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('promoDismissed', 'true');
    }
  };

  return (
    <header className="main-header">
      {promoVisible && (
        <div className="top-bar">
          <span>{promoText}</span>
          <span className="dismiss" onClick={handleDismiss}>Dismiss</span>
        </div>
      )}
      <div className="menu-toggle" onClick={onMenuToggle}>
        <div className="hamburger"><span></span><span></span><span></span></div>
        <span className="menu-text">MENU</span>
      </div>
      <Link href="/" className="logo">
        <img src="https://i.postimg.cc/XJMw6Gzp/cropped-Untitled-design.png" alt="The Course Gallery" />
      </Link>
      <div className="header-cart" onClick={onCartOpen}>
        <svg className="cart-icon-svg" viewBox="0 0 24 24">
          <path d="M6 8h12l1 13H5L6 8z"/>
          <path d="M9 8V5a3 3 0 016 0v3"/>
        </svg>
        <span className="cart-count">{cartCount}</span>
      </div>
    </header>
  );
}
