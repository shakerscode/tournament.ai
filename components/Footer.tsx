'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary-black-light border-t border-secondary-black-lighter mt-12">
      <div className="container-tight py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-primary-red font-bold text-lg mb-4">Badminton Tournament</h3>
            <p className="text-accent-gray-medium text-sm">
              Manage tournaments, track player payments, and organize fixtures all in one place.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-accent-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-accent-gray-medium hover:text-primary-red">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/instant-tournament"
                  className="text-accent-gray-medium hover:text-primary-red"
                >
                  Tournaments
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-accent-gray-medium hover:text-primary-red">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/expenses" className="text-accent-gray-medium hover:text-primary-red">
                  Expenses
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-accent-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:support@badminton.local" className="text-accent-gray-medium hover:text-primary-red">
                  Email Support
                </a>
              </li>
              <li>
                <a href="#faq" className="text-accent-gray-medium hover:text-primary-red">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#contact" className="text-accent-gray-medium hover:text-primary-red">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Follow */}
          <div>
            <h4 className="text-accent-white font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="#facebook"
                className="text-accent-gray-medium hover:text-primary-red text-2xl"
                aria-label="Facebook"
              >
                f
              </a>
              <a
                href="#twitter"
                className="text-accent-gray-medium hover:text-primary-red text-2xl"
                aria-label="Twitter"
              >
                𝕏
              </a>
              <a
                href="#instagram"
                className="text-accent-gray-medium hover:text-primary-red text-2xl"
                aria-label="Instagram"
              >
                📷
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-secondary-black-lighter py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-accent-gray-medium text-sm">
              © {currentYear} Badminton Tournament. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm mt-4 md:mt-0">
              <a href="#privacy" className="text-accent-gray-medium hover:text-primary-red">
                Privacy Policy
              </a>
              <a href="#terms" className="text-accent-gray-medium hover:text-primary-red">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
