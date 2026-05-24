'use client';
import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '@/context/CartContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import SiteGuard from '@/components/SiteGuard';

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <CartProvider>
        <CurrencyProvider>
          <SiteGuard>
            {children}
          </SiteGuard>
        </CurrencyProvider>
      </CartProvider>
    </SessionProvider>
  );
}
