import './globals.css';
import Providers from '@/components/Providers';

export const metadata = {
  title: 'The Course Gallery - Premium Courses at Affordable Prices',
  description: '#1 Source for Premium Courses. All kinds of courses available at cheap prices. Forex, Stock Market, Digital Marketing and more.',
  icons: [],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
