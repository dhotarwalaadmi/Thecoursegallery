'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <h3 className="footer-heading">Contact Us</h3>
        <div className="footer-contact">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <path d="M22 6l-10 7L2 6"/>
          </svg>
          contact@thecoursegallery.com
        </div>

        <h3 className="footer-heading">What Our Customer Said</h3>
        <div className="stars">★★★★★</div>
        <div className="review-card">
          <h4>Great Service!</h4>
          <p>Amazing collection of courses at unbeatable prices. The delivery was instant and the quality is top-notch. Highly recommended!</p>
        </div>

        <h3 className="footer-heading">Payment Methods</h3>
        <div className="payment-methods">
          <div className="payment-box">
            <svg width="40" height="24" viewBox="0 0 40 24"><rect width="40" height="24" rx="3" fill="#1a1f71"/><text x="20" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">UPI</text></svg>
          </div>
          <div className="payment-box">
            <svg width="40" height="24" viewBox="0 0 40 24"><rect width="40" height="24" rx="3" fill="#ff6600"/><text x="20" y="16" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">BHIM</text></svg>
          </div>
          <div className="payment-box">
            <svg width="40" height="24" viewBox="0 0 40 24"><rect width="40" height="24" rx="3" fill="#5f259f"/><text x="20" y="16" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">PhonePe</text></svg>
          </div>
          <div className="payment-box">
            <svg width="40" height="24" viewBox="0 0 40 24"><rect width="40" height="24" rx="3" fill="#002970"/><text x="20" y="16" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">Paytm</text></svg>
          </div>
        </div>

        <h3 className="footer-heading">Quick Links</h3>
        <ul className="quick-links">
          <li>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f1c40f" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            <Link href="/" style={{ color: '#eee', textDecoration: 'none' }}>Home</Link>
          </li>
          <li>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f1c40f" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            <Link href="/" style={{ color: '#eee', textDecoration: 'none' }}>Shop</Link>
          </li>
          <li>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f1c40f" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            <Link href="/my-orders" style={{ color: '#eee', textDecoration: 'none' }}>My Account</Link>
          </li>
          <li>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f1c40f" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            <Link href="/checkout" style={{ color: '#eee', textDecoration: 'none' }}>Cart</Link>
          </li>
        </ul>

        <h3 className="footer-heading">About Us</h3>
        <p className="footer-about">
          The Course Gallery is your #1 source for premium courses at affordable prices. We provide verified, high-quality digital courses across trading, marketing, and personal development.
        </p>

        <div className="social-icons">
          <a href="#" aria-label="Facebook">
            <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
          </a>
          <a href="#" aria-label="Twitter">
            <svg viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
          </a>
        </div>
      </div>

      <div className="copyright-bar">
        © {new Date().getFullYear()} The Course Gallery. All rights reserved.
      </div>
    </footer>
  );
}
