'use client';
import Link from 'next/link';

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
      <div className={`sidebar ${isOpen ? 'active' : ''}`}>
        <div className="sidebar-search-container">
          <input type="text" className="sidebar-search-input" placeholder="Search" />
          <button className="sidebar-search-btn">
            <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          </button>
        </div>
        <ul className="sidebar-menu">
          <li><Link href="/" onClick={onClose}>Home</Link></li>
          <li><Link href="/#latest-courses" onClick={onClose}>Courses <svg className="dropdown-arrow" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></Link></li>
          <li><Link href="/my-account" onClick={onClose}>My account</Link></li>
          <li><Link href="/cart" onClick={onClose}>Cart</Link></li>
          <li><Link href="/request-course" onClick={onClose}>Request Course</Link></li>
          <li><Link href="/exchange-courses" onClick={onClose}>Exchange Courses</Link></li>
          <li><Link href="/how-to-download" onClick={onClose}>How To Download Course</Link></li>
          <li><Link href="/contact" onClick={onClose}>Contact us</Link></li>
        </ul>
      </div>
    </>
  );
}
