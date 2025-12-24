'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export interface HeaderProps {
  transparent?: boolean;
  isDarkBg?: boolean;
}

export default function Header({ transparent = false, isDarkBg = false }: HeaderProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Check if user is admin
    if (typeof window !== 'undefined') {
      const adminFlag = localStorage.getItem('isAdmin') === 'true';
      setIsAdmin(adminFlag);
    }

    // Listen to scroll events for transparent header behavior
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const bgClass =
    transparent && !isScrolled && !isDarkBg
      ? 'bg-black'
      : 'bg-gray-700';

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${bgClass}`}
      role="banner"
    >
      <nav className="container-tight py-4 flex items-center justify-between" role="navigation">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-primary-red hover:text-primary-red-light transition-colors"
          aria-label="Badminton Tournament Home"
        >
          🏸 Badminton
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-accent-white hover:text-primary-red transition-colors font-medium"
          >
            Home
          </Link>
          <Link
            href="/instant-tournament"
            className="text-accent-white hover:text-primary-red transition-colors font-medium"
          >
            Instant Tournament
          </Link>
          <Link
            href="/expenses"
            className="text-accent-white hover:text-primary-red transition-colors font-medium"
          >
            Expenses
          </Link>
          <Link
            href="/register"
            className="text-accent-white hover:text-primary-red transition-colors font-medium"
          >
            Register
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="px-4 py-2 bg-primary-red text-accent-white rounded-lg font-semibold hover:bg-primary-red-dark transition-colors"
            >
              Admin
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle (simplified for this version) */}
        <div className="md:hidden flex items-center gap-4">
          {isAdmin && (
            <Link
              href="/admin"
              className="px-3 py-1 bg-primary-red text-accent-white rounded text-sm font-semibold"
            >
              Admin
            </Link>
          )}
          <Link
            href="/register"
            className="px-3 py-1 border border-primary-red text-primary-red rounded text-sm font-semibold"
          >
            Register
          </Link>
        </div>
      </nav>
    </header>
  );
}
