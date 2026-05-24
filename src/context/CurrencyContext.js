'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

const CONVERSION_RATE = 0.012; // 1 INR = 0.012 USD approximately

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('INR');

  useEffect(() => {
    const saved = localStorage.getItem('currency');
    if (saved) setCurrency(saved);
  }, []);

  const selectCurrency = (curr) => {
    setCurrency(curr);
    localStorage.setItem('currency', curr);
  };

  const formatPrice = (amountInINR) => {
    if (currency === 'USD') {
      return `$${(amountInINR * CONVERSION_RATE).toFixed(2)}`;
    }
    return `₹${amountInINR.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const currencySymbol = currency === 'USD' ? '$' : '₹';

  return (
    <CurrencyContext.Provider value={{ currency, selectCurrency, formatPrice, currencySymbol }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
}
