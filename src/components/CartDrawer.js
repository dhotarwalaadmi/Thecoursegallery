'use client';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useRouter } from 'next/navigation';

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, removeFromCart, cartTotal, isCartOpen, closeCart } = useCart();
  const { formatPrice } = useCurrency();
  const router = useRouter();

  const handleClose = () => {
    if (onClose) onClose();
    closeCart();
  };

  const handleCheckout = () => {
    handleClose();
    router.push('/checkout');
  };

  const handleViewCart = () => {
    handleClose();
    router.push('/cart');
  };

  const activeClass = isOpen || isCartOpen ? 'active' : '';

  return (
    <>
      <div className={`cart-overlay ${activeClass}`} onClick={handleClose}></div>
      <div className={`cart-drawer ${activeClass}`}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <div className="close-cart" onClick={handleClose}>
            <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </div>
        </div>
        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="empty-state">
              <p>Your cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div className="cart-item" key={item.id}>
                <svg className="cart-trash" viewBox="0 0 24 24" onClick={() => removeFromCart(item.id)}>
                  <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14"/>
                </svg>
                <div className="cart-item-details">
                  <div className="cart-item-title">{item.title}</div>
                  <div className="cart-item-price">
                    <span className="cart-qty">{item.quantity} ×</span> {formatPrice(item.newPrice)}
                  </div>
                </div>
                <img className="cart-item-img" src={item.imageUrl} alt={item.title} />
              </div>
            ))
          )}
        </div>
        <div className="cart-footer">
          <div className="subtotal-row">
            <span>Subtotal:</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          <button className="btn-view-cart" onClick={handleViewCart}>View cart</button>
          <button className="btn-checkout" onClick={handleCheckout}>
            <svg viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/></svg>
            Checkout
          </button>
        </div>
      </div>
    </>
  );
}
