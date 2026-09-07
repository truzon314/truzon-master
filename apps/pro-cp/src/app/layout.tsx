import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });

export const metadata: Metadata = {
  title: 'Truzon Pro & CP Portal',
  description: 'Truzon Homes - Enterprise Pro Sales CRM & Channel Partner Broker Desk',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} antialiased`}>
      <body className="min-h-screen bg-[#f8fafc] text-[#0f1c3a] font-sans selection:bg-gold-500/20 selection:text-gold-700">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}