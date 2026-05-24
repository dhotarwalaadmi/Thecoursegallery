'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import FloatingFAB from '@/components/FloatingFAB';
import CurrencyWidget from '@/components/CurrencyWidget';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
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

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} onCartOpen={() => setCartOpen(true)} />
      
      <div className="product-detail-page">
        <div className="product-detail-breadcrumb">
          <Link href="/">Home</Link> / <span>{product.title}</span>
        </div>

        <div className="product-detail-image" style={{ backgroundImage: `url(${product.imageUrl})` }}>
          <div className="discount-badge">{product.discountBadge}</div>
        </div>

        <div className="product-detail-category">{categoryText}</div>
        <h1 className="product-detail-title">{product.title}</h1>

        <div className="product-detail-pricing">
          <span className="old-price">{formatPrice(product.oldPrice)}</span>
          <span className="new-price">{formatPrice(product.newPrice)}</span>
        </div>

        <div className="product-detail-description">
          {product.description || `Get access to ${product.title} at an incredible discounted price. This comprehensive course covers everything you need to master this topic. Instant delivery after payment verification.`}
        </div>

        <button className="product-detail-btn" onClick={handleAddToCart}>
          {added ? '✓ Added to Cart!' : 'Add to Cart'}
        </button>
      </div>

      <Footer />
      <FloatingFAB />
      <CurrencyWidget />
    </>
  );
}
