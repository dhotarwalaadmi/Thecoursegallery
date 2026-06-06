'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import CartDrawer from '@/components/CartDrawer';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import FloatingFAB from '@/components/FloatingFAB';
import CurrencyWidget from '@/components/CurrencyWidget';

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || searchParams.get('query') || searchParams.get('search') || '';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      fetchProducts(query);
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [query]);

  const fetchProducts = async (searchStr) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('search', searchStr);
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to fetch search results:', e);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} onCartOpen={() => setCartOpen(true)} />

      <div className="shop-page" style={{ minHeight: '60vh' }}>
        <h1 style={{ textAlign: 'left', fontSize: '26px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
          Search Results
        </h1>
        <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '30px' }}>
          Showing results for: <strong style={{ color: '#0b2de6' }}>"{query}"</strong>
        </p>

        {loading ? (
          <div className="empty-state"><p>Searching courses...</p></div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <h3>No courses found</h3>
            <p>Try searching for different keywords (e.g., MMC, Upstox, Gann, Defi)</p>
          </div>
        ) : (
          <>
            <p className="shop-results-count" style={{ textAlign: 'left' }}>
              Found {products.length} course{products.length !== 1 ? 's' : ''} matching your query
            </p>
            <div className="product-grid" style={{ maxWidth: '100%' }}>
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
      <FloatingFAB />
      <CurrencyWidget />
    </>
  );
}
