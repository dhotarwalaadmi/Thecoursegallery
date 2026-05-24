'use client';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  const categoryText = product.categories?.map(c => c.name || c).join(', ') || '';

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      title: product.title,
      slug: product.slug,
      imageUrl: product.imageUrl,
      oldPrice: product.oldPrice,
      newPrice: product.newPrice,
    });
  };

  return (
    <div className="product-card">
      <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="product-img-wrapper" style={{ backgroundImage: `url(${product.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="discount-badge">{product.discountBadge}</div>
        </div>
      </Link>
      <div className="product-category">{categoryText}</div>
      <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <h3 className="product-title">{product.title}</h3>
      </Link>
      <div className="product-price">
        <span className="old-price">{formatPrice(product.oldPrice)}</span>
        <span className="new-price">{formatPrice(product.newPrice)}</span>
      </div>
      <button className="btn-add-cart" onClick={handleAddToCart}>Add to cart</button>
    </div>
  );
}
