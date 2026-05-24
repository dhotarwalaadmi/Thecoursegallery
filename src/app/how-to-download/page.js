'use client';
import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import FloatingFAB from '@/components/FloatingFAB';
import CurrencyWidget from '@/components/CurrencyWidget';

export default function HowToDownloadPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} onCartOpen={() => setCartOpen(true)} />

      <div className="static-page">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / <span>How To Download Course</span>
        </div>

        <h1 className="static-page-title-center">How to DOWNLOAD the course</h1>

        <p className="info-text-upper">
          AS YOU PLACED THE ORDER AND YOUR ORDERS GOES INTO PROCESSING IN THAT CASE YOU HAVE TO MESSAGE US ON TELEGRAM WITH THE PHOTO OF THE ORDER AND PAYMENT SCREENSHOT .
        </p>

        <p className="info-text-telegram-handle">
          Telegram: <a href="https://t.me/Thecoursegalleryofficial" target="_blank" rel="noopener noreferrer" className="text-link">@Thecoursegalleryofficial</a>
        </p>

        <p className="info-text-warning">
          <em>Please check your mail after FEW HOURS, IF YOU DONOT RECIVE DOWNLOAD LINK THEN PLEASE MESSAGE US ON TELEGRAM. , please contact us ON TELEGRAM.</em>
        </p>

        <h2>We support 24/7</h2>

        <p className="info-text-delivery">
          IN NEXT 1- 2 HOURS WE WILL DELIVER YOUR ORDER TO YOU.
        </p>

        <p>THANKS</p>
        <p><strong>THE COURSE GALLERY</strong></p>
      </div>

      <Footer />
      <FloatingFAB />
      <CurrencyWidget />
    </>
  );
}
