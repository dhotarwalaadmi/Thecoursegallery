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

export default function ShopPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts('', initialCategory);
    fetchCategories();
  }, []);

  const fetchProducts = async (search = '', category = '') => {
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to fetch products:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to fetch categories:', e);
    }
  };

  const handleSearch = () => {
    fetchProducts(searchQuery, activeCategory);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleCategoryFilter = (slug) => {
    const newCategory = slug === activeCategory ? '' : slug;
    setActiveCategory(newCategory);
    fetchProducts(searchQuery, newCategory);
  };

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} onCartOpen={() => setCartOpen(true)} />

      <div className="shop-page">
        <h1>All Courses</h1>

        {/* Search Bar */}
        <div className="shop-search-container">
          <input
            type="text"
            className="shop-search-input"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="shop-search-btn" onClick={handleSearch}>
            <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="category-tabs" style={{ maxWidth: '100%' }}>
          <button
            className={`category-tab ${activeCategory === '' ? 'active' : ''}`}
            onClick={() => handleCategoryFilter('')}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-tab ${activeCategory === cat.slug ? 'active' : ''}`}
              onClick={() => handleCategoryFilter(cat.slug)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="empty-state"><p>Loading courses...</p></div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <h3>No courses found</h3>
            <p>Try a different search or category</p>
          </div>
        ) : (
          <>
            <p className="shop-results-count">Showing {products.length} course{products.length !== 1 ? 's' : ''}</p>
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
