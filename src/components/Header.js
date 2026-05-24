'use client';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function Header({ onMenuToggle, onCartOpen }) {
  const [promoVisible, setPromoVisible] = useState(true);
  const { cartCount } = useCart();

  return (
    <header className="main-header">
      {promoVisible && (
        <div className="top-bar">
          <span>Only for Today 70.00% Discount on All Order ( Except a few ) . Use Code :SAVE70</span>
          <span className="dismiss" onClick={() => setPromoVisible(false)}>Dismiss</span>
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
