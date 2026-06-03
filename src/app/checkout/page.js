'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import QRCode from 'qrcode';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import FloatingFAB from '@/components/FloatingFAB';
import CurrencyWidget from '@/components/CurrencyWidget';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  // Billing fields
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [emailOptIn, setEmailOptIn] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');

  // Payment popup
  const [showPayPopup, setShowPayPopup] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [agreedTerms, setAgreedTerms] = useState(false);

  // QR & payment fields
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [upiId, setUpiId] = useState('merchant@upi');
  const [transactionId, setTransactionId] = useState('');
  const [bankHolderName, setBankHolderName] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState(null);
  const [orderSummary, setOrderSummary] = useState(null);
  const [error, setError] = useState('');

  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const finalTotal = discountPercent > 0 ? cartTotal * (1 - discountPercent / 100) : cartTotal;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    setCouponError('');
    setCouponSuccess('');
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setDiscountPercent(data.discountPercent);
        setCouponSuccess(`Discount Applied 🎉 (${data.discountPercent}%)`);
      } else {
        setCouponError(data.error || 'Invalid coupon');
        setDiscountPercent(0);
      }
    } catch (e) {
      setCouponError('Failed to validate coupon');
      setDiscountPercent(0);
    }
    setValidatingCoupon(false);
  };



  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.upi_id) setUpiId(data.upi_id);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (finalTotal > 0 && upiId) {
      const upiUrl = `upi://pay?pa=${upiId}&pn=The Course Gallery&am=${finalTotal}&cu=INR&tn=Course Purchase`;
      QRCode.toDataURL(upiUrl, { width: 250, margin: 2 })
        .then(url => setQrCodeUrl(url))
        .catch(err => console.error('QR generation failed:', err));
    }
  }, [finalTotal, upiId]);

  const handleProceedToPay = (e) => {
    e.preventDefault();
    setError('');

    if (!firstName.trim()) {
      setError('First name is required');
      return;
    }
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!agreedTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setShowPayPopup(true);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!transactionId.trim() || !bankHolderName.trim()) {
      setError('Please fill in Transaction ID and Bank Holder\'s Name');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          totalAmount: finalTotal,
          payerName: firstName.trim(),
          email: email.trim(),
          orderNotes: orderNotes.trim(),
          bankHolderName: bankHolderName.trim(),
          transactionId: transactionId.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to submit order');
        setSubmitting(false);
        return;
      }

      setSubmittedOrder(data);
      setOrderSummary({
        subtotal: cartTotal,
        discountPercent: discountPercent,
        discountAmount: discountPercent > 0 ? (cartTotal * discountPercent) / 100 : 0,
        total: finalTotal,
        paymentMethod: paymentMethod
      });
      clearCart();
      setShowPayPopup(false);
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <>
        <Header onMenuToggle={() => {}} onCartOpen={() => {}} />
        <div className="empty-state"><p>Loading...</p></div>
      </>
    );
  }

  if (success) {
    return (
      <>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} onCartOpen={() => setCartOpen(true)} />
        <div className="checkout-page-wrap">
          <div className="success-message" style={{ maxWidth: '600px', width: '100%', margin: '0 auto', padding: '30px 20px' }}>
            <div className="success-icon" style={{ margin: '0 auto 20px' }}>✓</div>
            <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Order Submitted!</h2>
            
            {/* Order Details Box */}
            <div style={{
              background: '#fcfcfc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'left',
              marginBottom: '30px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)'
            }}>
              <h3 style={{ borderBottom: '2px solid #edf2f7', paddingBottom: '12px', marginTop: 0, marginBottom: '20px', fontSize: '18px', color: '#1a202c' }}>Order Summary</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#4a5568' }}>
                <span>Order ID:</span>
                <strong style={{ color: '#1a202c', fontFamily: 'monospace', fontSize: '15px' }}>
                  {submittedOrder?.id ? `#${submittedOrder.id.slice(-8).toUpperCase()}` : 'Generating...'}
                </strong>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#4a5568' }}>
                <span>Payment Method:</span>
                <strong style={{ color: '#1a202c' }}>
                  {orderSummary?.paymentMethod === 'upi' ? 'UPI QR' : 'Crypto (USDT/BTC/ETH/Binance Pay)'}
                </strong>
              </div>

              <div style={{ borderBottom: '1px solid #edf2f7', margin: '20px 0' }}></div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', marginBottom: '15px', fontSize: '14px', color: '#2d3748', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <span>Product</span>
                <span>Total</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {submittedOrder?.items?.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '14px' }}>
                    <span style={{ color: '#4a5568', marginRight: '20px', flex: 1 }}>{item.product?.title}</span>
                    <span style={{ fontWeight: '600', color: '#1a202c' }}>{formatPrice(item.price)}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderBottom: '1px solid #edf2f7', margin: '20px 0' }}></div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', color: '#4a5568' }}>
                <span>Subtotal:</span>
                <span style={{ fontWeight: '500' }}>{formatPrice(orderSummary?.subtotal || 0)}</span>
              </div>

              {orderSummary?.discountPercent > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', color: '#38a169' }}>
                  <span>Discount ({orderSummary.discountPercent}%):</span>
                  <span style={{ fontWeight: '600' }}>-{formatPrice(orderSummary.discountAmount)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '18px', marginTop: '15px', paddingTop: '15px', borderTop: '2px solid #edf2f7', color: '#0b2de6' }}>
                <span>Total Amount:</span>
                <span>{formatPrice(orderSummary?.total || 0)}</span>
              </div>
            </div>

            <p style={{ 
              fontWeight: 'bold', 
              fontSize: '18px', 
              lineHeight: '1.5',
              color: '#111', 
              marginBottom: '25px',
              textAlign: 'center',
              padding: '0 10px'
            }}>
              Thank you for your purchase. Please Take a screenshot of this page and contact us on Telegram to receive your course access.
            </p>

            <a href="https://t.me/TheCourseGaleryOfficial" target="_blank" rel="noopener noreferrer" className="btn-auth" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: '320px', margin: '0 auto', textAlign: 'center', background: '#2AABEE', padding: '12px 24px', borderRadius: '8px', fontSize: '16px', fontWeight: '600', textDecoration: 'none', color: 'white', transition: 'background 0.2s' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" style={{ fill: 'white', marginRight: '10px' }}>
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z"/>
              </svg>
              Contact Us on Telegram
            </a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} onCartOpen={() => setCartOpen(true)} />

      {/* Payment Notice Banner */}
      <div className="checkout-notice">
        <h3>For Payment Related Issues?</h3>
        <p>Contact Us On Telegram <strong>Paypal, Crypto, Or Credit/Debit Card</strong> Also Accepted With Us.</p>
        <a href="https://t.me/TheCourseGaleryOfficial" target="_blank" rel="noopener noreferrer" className="checkout-notice-link">Click Here To Contact Us On Telegram</a>
      </div>

      {/* Progress Steps */}
      <div className="checkout-steps">
        <div className="checkout-step completed">
          <div className="step-circle">1</div>
          <span>Shopping Cart</span>
        </div>
        <div className="step-line completed"></div>
        <div className="checkout-step active">
          <div className="step-circle">2</div>
          <span>Shipping and Checkout</span>
        </div>
        <div className="step-line"></div>
        <div className="checkout-step">
          <div className="step-circle">3</div>
          <span>Confirmation</span>
        </div>
      </div>

      <div className="checkout-page-wrap">
        {cart.length === 0 ? (
          <div className="empty-state">
            <h3>Your cart is empty</h3>
            <p>Add some courses to proceed with checkout</p>
            <button className="btn-auth" onClick={() => router.push('/shop')} style={{ marginTop: '15px', maxWidth: '200px' }}>Shop Now</button>
          </div>
        ) : (
          <form onSubmit={handleProceedToPay} className="checkout-grid">
            {/* LEFT: Billing Details */}
            <div className="checkout-left">
              <h2>Billing details</h2>

              {error && !showPayPopup && <div className="auth-error">{error}</div>}

              <div className="form-group">
                <label>First name <span className="required">*</span></label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email address <span className="required">*</span></label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={emailOptIn}
                  onChange={(e) => setEmailOptIn(e.target.checked)}
                />
                I would like to receive exclusive emails with discounts and product information
              </label>

              <h2 style={{ marginTop: '30px' }}>Additional information</h2>

              <div className="form-group">
                <label>Order notes (optional)</label>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Notes about your order, e.g. special notes for delivery."
                  rows={4}
                  className="checkout-textarea"
                ></textarea>
              </div>
            </div>

            {/* RIGHT: Order Summary */}
            <div className="checkout-right">
              <h2>Your order</h2>

              <div className="checkout-order-items">
                {cart.map(item => (
                  <div className="checkout-order-item" key={item.id}>
                    <div className="checkout-order-item-left">
                      <div className="checkout-item-thumb" style={{ backgroundImage: `url(${item.imageUrl})` }}></div>
                      <div>
                        <span className="checkout-item-name">{item.title}</span>
                        <span className="checkout-item-qty">× {item.quantity || 1}</span>
                      </div>
                    </div>
                    <span className="checkout-item-price">{formatPrice(item.newPrice * (item.quantity || 1))}</span>
                  </div>
                ))}
              </div>

              <div className="checkout-order-totals">
                <div className="checkout-total-row">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="checkout-total-row" style={{ color: '#28a745' }}>
                    <span>Discount ({discountPercent}%)</span>
                    <span>-{formatPrice(cartTotal * (discountPercent / 100))}</span>
                  </div>
                )}
                <div className="checkout-total-row checkout-total-final">
                  <span>Total</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Coupon Input */}
              <div style={{ marginTop: '20px', marginBottom: '20px', padding: '15px', background: '#f8f9fa', border: '1px dashed #ccc', borderRadius: '4px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" 
                    placeholder="Coupon Code" 
                    value={couponCode} 
                    onChange={(e) => setCouponCode(e.target.value)} 
                    style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                  <button type="button" onClick={handleApplyCoupon} disabled={validatingCoupon} style={{ padding: '0 20px', background: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    {validatingCoupon ? '...' : 'Apply'}
                  </button>
                </div>
                {couponError && <div style={{ color: '#dc3545', marginTop: '10px', fontSize: '14px' }}>{couponError}</div>}
                {couponSuccess && <div style={{ color: '#28a745', marginTop: '10px', fontSize: '14px' }}>{couponSuccess}</div>}
              </div>

              {/* Payment Methods */}
              <div className="checkout-payment-methods">
                <label className={`payment-method-option ${paymentMethod === 'upi' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                  />
                  <div className="payment-method-info">
                    <strong>Pay with UPI QR</strong>
                    <p>It uses UPI apps like BHIM, Paytm, Google Pay, PhonePe or any Banking UPI app to make payment.</p>
                  </div>
                </label>

                <label className={`payment-method-option ${paymentMethod === 'crypto' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="crypto"
                    checked={paymentMethod === 'crypto'}
                    onChange={() => setPaymentMethod('crypto')}
                  />
                  <div className="payment-method-info">
                    <strong>USDT, BTC, ETH, Binance Pay</strong>
                  </div>
                </label>
              </div>

              <p className="checkout-privacy-note">
                Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.
              </p>

              <label className="checkbox-label checkout-terms">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                />
                I have read and agree to the website <Link href="/contact" className="text-link">terms and conditions</Link> <span className="required">*</span>
              </label>

              <button type="submit" className="btn-proceed-payment">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="white"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z"/></svg>
                Proceed to Payment
              </button>
            </div>
          </form>
        )}
      </div>

      {/* QR Payment Popup */}
      {showPayPopup && (
        <div className="pay-popup-overlay" onClick={() => setShowPayPopup(false)}>
          <div className="pay-popup" onClick={(e) => e.stopPropagation()}>
            <button className="pay-popup-close" onClick={() => setShowPayPopup(false)}>✕</button>
            <h2>Complete Payment</h2>

            <div className="pay-popup-qr">
              {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="UPI QR Code" />
              ) : (
                <p>Generating QR code...</p>
              )}
              <div className="pay-popup-amount">{formatPrice(finalTotal)}</div>
              <p className="pay-popup-upi">UPI ID: <strong>{upiId}</strong></p>
            </div>

            <div className="pay-popup-notice">
              <p>📱 Scan the QR code using any UPI app (BHIM, Paytm, Google Pay, PhonePe)</p>
              <p>⏱️ After payment, enter your Transaction ID and Bank Holder&apos;s Name below</p>
            </div>

            {error && showPayPopup && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmitOrder} className="pay-popup-form">
              <div className="form-group">
                <label>Transaction ID <span className="required">*</span></label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter your UPI transaction ID"
                  required
                />
              </div>

              <div className="form-group">
                <label>Bank Holder&apos;s Name <span className="required">*</span></label>
                <input
                  type="text"
                  value={bankHolderName}
                  onChange={(e) => setBankHolderName(e.target.value)}
                  placeholder="Enter account holder's name"
                  required
                />
              </div>

              <button type="submit" className="btn-submit-order" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Order'}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
      <FloatingFAB />
      <CurrencyWidget />
    </>
  );
}
