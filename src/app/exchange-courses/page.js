'use client';
import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import FloatingFAB from '@/components/FloatingFAB';
import CurrencyWidget from '@/components/CurrencyWidget';

export default function ExchangeCoursesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} onCartOpen={() => setCartOpen(true)} />

      <div className="static-page">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / <span>Exchange Courses</span>
        </div>

        <h1 className="static-page-title-center">Exchange Courses with TheCourseGallery</h1>

        <p>
          Do you have any exclusive, unreleased courses that you&apos;ve purchased and want to exchange them for a new course from us? If so, we invite you to contact us on{' '}
          <a href="https://t.me/TheCourseGaleryOfficial" target="_blank" rel="noopener noreferrer" className="text-link">Telegram</a> for a mutually beneficial exchange.
        </p>

        <h2>Here&apos;s how it works</h2>

        <ul className="info-list">
          <li>
            <strong>Eligibility</strong>: We are looking for serious individuals who have courses that are not leaked or available on the internet or any other website.
          </li>
          <li>
            <strong>Exchange Process</strong>: In exchange for your exclusive course, you can select any course listed on our website.
          </li>
        </ul>

        <p>
          We are committed to maintaining the integrity and exclusivity of our content, and we appreciate your cooperation in this exchange process. For more details and to initiate an exchange, please reach out to us on{' '}
          <a href="https://t.me/TheCourseGaleryOfficial" target="_blank" rel="noopener noreferrer" className="text-link">Telegram</a>.
        </p>

        <h2 className="telegram-cta">
          <a href="https://t.me/TheCourseGaleryOfficial" target="_blank" rel="noopener noreferrer">
            CLICK HERE TO CONTACT US ON TELEGRAM
          </a>
        </h2>

        <p><strong>Thank You</strong></p>
        <p><strong>Thecoursegallery</strong></p>
      </div>

      <Footer />
      <FloatingFAB />
      <CurrencyWidget />
    </>
  );
}
