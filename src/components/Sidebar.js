'use client';
import Link from 'next/link';
import LiveSearch from './LiveSearch';

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
      <div className={`sidebar ${isOpen ? 'active' : ''}`}>
        <div className="sidebar-search-container" style={{ margin: '20px 15px' }}>
          <LiveSearch 
            placeholder="Search"
            inputClass="sidebar-search-input"
            buttonClass="sidebar-search-btn"
            onSearchSubmit={() => onClose()}
          />
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
