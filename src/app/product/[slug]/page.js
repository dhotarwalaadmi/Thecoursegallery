"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import FloatingFAB from '@/components/FloatingFAB';
import CurrencyWidget from '@/components/CurrencyWidget';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';

// 1. Extra Images Slider Component
const ImageSlider = ({ images }) => {
  const [index, setIndex] = useState(0);

  const nextSlide = () => {
    setIndex((index + 1) % images.length);
  };
  const prevSlide = () => {
    setIndex((index - 1 + images.length) % images.length);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '400px', overflow: 'hidden', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
      <div 
        style={{ 
          display: 'flex', 
          width: '100%', 
          height: '100%', 
          transform: `translateX(-${index * 100}%)`, 
          transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' 
        }}
      >
        {images.map((img, idx) => (
          <img 
            key={idx} 
            src={img} 
            alt={`Screenshot ${idx + 1}`} 
            style={{ width: '100%', height: '100%', objectFit: 'contain', flexShrink: 0 }} 
          />
        ))}
      </div>
      {images.length > 1 && (
        <>
          <button 
            onClick={prevSlide} 
            style={{
              position: 'absolute', 
              top: '50%', 
              left: '15px', 
              transform: 'translateY(-50%)', 
              background: 'rgba(15, 23, 42, 0.7)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '50%', 
              width: '44px', 
              height: '44px', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontWeight: 'bold', 
              fontSize: '20px', 
              zIndex: 10
            }}
          >
            &larr;
          </button>
          <button 
            onClick={nextSlide} 
            style={{
              position: 'absolute', 
              top: '50%', 
              right: '15px', 
              transform: 'translateY(-50%)', 
              background: 'rgba(15, 23, 42, 0.7)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '50%', 
              width: '44px', 
              height: '44px', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontWeight: 'bold', 
              fontSize: '20px', 
              zIndex: 10
            }}
          >
            &rarr;
          </button>
          <div style={{ position: 'absolute', bottom: '15px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 10 }}>
            {images.map((_, idx) => (
              <span 
                key={idx} 
                onClick={() => setIndex(idx)} 
                style={{ 
                  width: '10px', 
                  height: '10px', 
                  borderRadius: '50%', 
                  background: idx === index ? '#3b82f6' : 'rgba(255,255,255,0.4)', 
                  cursor: 'pointer',
                  border: '1px solid rgba(0,0,0,0.1)' 
                }} 
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// 2. Recommended Products Slider Component
const RecommendedSlider = ({ products }) => {
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ position: 'relative', marginTop: '20px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', marginBottom: '25px' }}>Recommended Courses</h2>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {products.length > 3 && (
          <>
            <button 
              onClick={() => scroll('left')} 
              style={{
                position: 'absolute', 
                left: '-15px', 
                background: 'white', 
                border: '1px solid #e2e8f0', 
                borderRadius: '50%', 
                width: '40px', 
                height: '40px', 
                cursor: 'pointer', 
                zIndex: 10, 
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', 
                fontWeight: 'bold',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              &larr;
            </button>
            <button 
              onClick={() => scroll('right')} 
              style={{
                position: 'absolute', 
                right: '-15px', 
                background: 'white', 
                border: '1px solid #e2e8f0', 
                borderRadius: '50%', 
                width: '40px', 
                height: '40px', 
                cursor: 'pointer', 
                zIndex: 10, 
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', 
                fontWeight: 'bold',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              &rarr;
            </button>
          </>
        )}
        <div 
          ref={sliderRef} 
          className="recommended-slider" 
          style={{ 
            display: 'flex', 
            gap: '24px', 
            overflowX: 'auto', 
            padding: '10px 5px', 
            scrollbarWidth: 'none', 
            width: '100%' 
          }}
        >
          {products.map(p => (
            <div key={p.id} style={{ flexShrink: 0, width: '280px' }}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (params.slug) {
      fetch(`/api/products/${params.slug}`)
        .then(res => res.json())
        .then(data => {
          setProduct(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [params.slug]);

  useEffect(() => {
    if (product) {
      fetch('/api/products')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            // Find recommended: filter out current product and prioritize products in same category
            const currentCatIds = product.categories?.map(c => c.id) || [];
            const matches = data.filter(p => p.id !== product.id);
            matches.sort((a, b) => {
              const aMatch = a.categories?.some(c => currentCatIds.includes(c.id)) ? 1 : 0;
              const bMatch = b.categories?.some(c => currentCatIds.includes(c.id)) ? 1 : 0;
              return bMatch - aMatch;
            });
            setRecommended(matches.slice(0, 6));
          }
        })
        .catch(() => {});
    }
  }, [product]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        title: product.title,
        slug: product.slug,
        imageUrl: product.imageUrl,
        oldPrice: product.oldPrice,
        newPrice: product.newPrice,
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) {
    return (
      <>
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} onCartOpen={() => setCartOpen(true)} />
        <div className="empty-state"><p>Loading...</p></div>
      </>
    );
  }

  if (!product || product.error) {
    return (
      <>
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} onCartOpen={() => setCartOpen(true)} />
        <div className="empty-state">
          <h3>Product not found</h3>
          <p><Link href="/">Go back to shop</Link></p>
        </div>
      </>
    );
  }

  const categoryText = product.categories?.map(c => c.name).join(', ') || '';
  const extraImages = product.extraImages ? product.extraImages.split(',').map(s => s.trim()).filter(Boolean) : [];

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} onCartOpen={() => setCartOpen(true)} />
      
      <div className="product-detail-page">
        <div className="product-detail-breadcrumb" style={{ fontSize: '13px', color: '#64748b', marginBottom: '25px' }}>
          <Link href="/" style={{ color: '#3b82f6', textDecoration: 'none' }}>Home</Link> / <span>{product.title}</span>
        </div>

        {/* 2-Column E-Commerce Grid */}
        <div className="product-detail-grid">
          {/* Left Column: Product Image Preview */}
          <div className="product-detail-media">
            <div 
              className="product-detail-image" 
              style={{ 
                width: '100%', 
                height: '420px', 
                backgroundImage: `url(${product.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '12px',
                position: 'relative',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
              }}
            >
              {product.discountBadge && (
                <div className="discount-badge" style={{ position: 'absolute', top: '15px', left: '15px', background: '#e11d48', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '700' }}>
                  {product.discountBadge}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Info & Purchase CTA */}
          <div className="product-detail-info" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ color: '#3b82f6', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {categoryText}
            </div>
            
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', lineHeight: '1.2', margin: 0 }}>
              {product.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '18px', textDecoration: 'line-through', color: '#94a3b8' }}>
                {formatPrice(product.oldPrice)}
              </span>
              <span style={{ fontSize: '26px', fontWeight: '800', color: '#3b82f6' }}>
                {formatPrice(product.newPrice)}
              </span>
            </div>

            <button 
              className="product-detail-btn" 
              onClick={handleAddToCart}
              style={{
                width: '100%',
                padding: '16px',
                background: added ? '#10b981' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.25)',
                transition: 'all 0.2s ease',
                margin: 0
              }}
            >
              {added ? '✓ Added to Cart!' : 'Add to Cart'}
            </button>

            <div style={{
              background: '#f8fafc',
              border: '1px dashed #cbd5e1',
              borderRadius: '8px',
              padding: '16px',
              fontSize: '13.5px',
              color: '#475569',
              lineHeight: '1.6'
            }}>
              <strong>Instant Digital Delivery!</strong> Verify your payment via Transaction ID. Crypto (USDT, BTC, ETH) and UPI are fully supported. Contact us on Telegram for details.
            </div>

            <div style={{ borderBottom: '1px solid #e2e8f0', margin: '10px 0' }}></div>

            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '10px', color: '#0f172a' }}>About This Course</h3>
              <div className="product-detail-description" style={{ margin: 0, color: '#475569', fontSize: '15px', lineHeight: '1.7' }}>
                {product.description || `Get access to ${product.title} at an incredible discounted price. This comprehensive course covers everything you need to master this topic. Instant delivery after payment verification.`}
              </div>
            </div>
          </div>
        </div>

        {/* Extra Images Slider (below description) */}
        {extraImages.length > 0 && (
          <div style={{ marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '40px', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>Course Screenshots & Preview</h2>
            <ImageSlider images={extraImages} />
          </div>
        )}

        {/* Recommended Products Slider */}
        {recommended.length > 0 && (
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '40px', marginBottom: '20px' }}>
            <RecommendedSlider products={recommended} />
          </div>
        )}
      </div>

      <Footer />
      <FloatingFAB />
      <CurrencyWidget />
    </>
  );
}
