'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import CartDrawer from '@/components/CartDrawer';
import HeroSection from '@/components/HeroSection';
import CategoryCards from '@/components/CategoryCards';
import ProductCard from '@/components/ProductCard';
import WhyUsSection from '@/components/WhyUsSection';
import Footer from '@/components/Footer';
import FloatingFAB from '@/components/FloatingFAB';
import CurrencyWidget from '@/components/CurrencyWidget';

export default function HomePage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchPopularProducts();
  }, []);

  const fetchProducts = async (search = '') => {
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data.filter(p => !p.isPopular) : []);
    } catch (e) {
      console.error('Failed to fetch products:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularProducts = async () => {
    try {
      const res = await fetch('/api/products?popular=true');
      const data = await res.json();
      setPopularProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to fetch popular products:', e);
    }
  };

  const handleSearch = () => {
    fetchProducts(searchQuery);
  };

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <Header
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        onCartOpen={() => setCartOpen(true)}
      />

      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
      />

      <CategoryCards />

      {/* Latest Courses */}
      <div className="latest-courses-section" id="latest-courses">
        <h2>Our Latest Courses</h2>
      </div>

      {loading ? (
        <div className="empty-state"><p>Loading courses...</p></div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <h3>No courses found</h3>
          <p>Try a different search</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <button className="btn-browse-all" onClick={() => router.push('/shop')}>Browse All Courses &rarr;</button>

      {/* Popular Courses */}
      <div className="popular-courses-section">
        <h2>Our Most Popular Courses</h2>
      </div>

      {popularProducts.length > 0 && (
        <div className="product-grid">
          {popularProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <WhyUsSection />
      <Footer />
      <FloatingFAB />
      <CurrencyWidget />
    </>
  );
}
