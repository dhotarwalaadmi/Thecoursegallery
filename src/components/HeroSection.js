'use client';
import { useRouter } from 'next/navigation';
import LiveSearch from './LiveSearch';

export default function HeroSection({ searchQuery, onSearchChange, onSearch }) {
  const router = useRouter();
  
  return (
    <div className="hero">
      <h1>#1 Source For Premium<br/>Courses</h1>
      <p>All Kind of Courses Available at Cheap Prices.</p>
      <LiveSearch 
        placeholder="Search"
        inputClass="search-input"
        buttonClass="search-btn"
        containerClass="search-container"
        onSearchSubmit={onSearch}
        initialValue={searchQuery}
      />
      <button className="btn-shop" onClick={() => router.push('/shop')}>Go to Shop &rarr;</button>
    </div>
  );
}
