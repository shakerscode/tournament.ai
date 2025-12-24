import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'Badminton Tournament Manager',
  description: 'Manage tournaments, track players, and organize fixtures in one place',
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '🏸',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#FF0000" />
      </head>
      <body className="bg-secondary-black text-accent-white">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
