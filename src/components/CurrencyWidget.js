'use client';
import { useState } from 'react';
import { useCurrency } from '@/context/CurrencyContext';

export default function CurrencyWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { currency, selectCurrency } = useCurrency();

  const handleSelect = (curr) => {
    selectCurrency(curr);
    setIsOpen(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) setIsOpen(false);
  };

  return (
    <>
      <div className="floating-right">
        <div className="rupee-icon" onClick={() => setIsOpen(true)}>
          {currency === 'INR' ? '₹' : '$'}
        </div>
        <div className="plus-icon" onClick={() => setIsOpen(true)}>+</div>
      </div>

      <div className={`currency-overlay ${isOpen ? 'active' : ''}`} onClick={handleOverlayClick}>
        <div className="currency-box">
          <div className="curr-header">SELECT YOUR CURRENCY</div>
          <div className="curr-option curr-inr" onClick={() => handleSelect('INR')}>
            <span>₹</span> INDIAN RUPEE
          </div>
          <div className="curr-option curr-usd" onClick={() => handleSelect('USD')}>
            <span>$</span> UNITED STATES (US) DOLLAR
          </div>
        </div>
      </div>
    </>
  );
}
