'use client';
import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import FloatingFAB from '@/components/FloatingFAB';
import CurrencyWidget from '@/components/CurrencyWidget';

export default function ContactPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} onCartOpen={() => setCartOpen(true)} />

      <div className="static-page">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / <span>Contact Us</span>
        </div>

        <h2 className="contact-heading">Contact us here :</h2>

        <p className="contact-info">
          <strong>Mail us : </strong>
          <a href="mailto:vikasrathi90112@gmail.com" className="text-link">vikasrathi90112@gmail.com</a>
        </p>

        <p className="contact-info">
          <strong>Telegram: </strong>
          <a href="https://t.me/TheCourseGaleryOfficial" target="_blank" rel="noopener noreferrer" className="text-link">@TheCourseGaleryOfficial</a>
        </p>

        <p className="contact-address">
          Tommy Bahama Wailea [MAUI] 3750 Wailea Drive Kihei HI 96753 , USA
        </p>
      </div>

      <Footer />
      <FloatingFAB />
      <CurrencyWidget />
    </>
  );
}
