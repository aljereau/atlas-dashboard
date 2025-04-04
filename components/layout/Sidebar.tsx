'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  name: string;
  path: string;
  icon: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      name: 'Explore',
      path: '/explore',
      icon: '🔍' // We'll replace these with proper SVG icons later
    },
    {
      name: 'Portfolio',
      path: '/portfolio',
      icon: '📊'
    },
    {
      name: 'Trading',
      path: '/trading',
      icon: '💹'
    },
    {
      name: 'Watchlist',
      path: '/watchlist',
      icon: '⭐'
    },
    {
      name: 'Market Analysis',
      path: '/market-analysis',
      icon: '📈'
    }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile menu button - only visible on small screens */}
      <div className="md:hidden fixed top-4 left-4 z-20">
        <button
          onClick={toggleMobileMenu}
          className="flex items-center p-2 rounded-md bg-gray-800 text-white"
        >
          <span className="sr-only">Open menu</span>
          {/* Hamburger icon placeholder - will replace with SVG later */}
          <div>☰</div>
        </button>
      </div>

      {/* Sidebar - full on desktop, hidden by default on mobile */}
      <aside 
        className={`
          fixed top-0 left-0 z-10 h-full w-64 bg-gray-900 text-white transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo/branding */}
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold">Atlas</h1>
          <p className="text-sm text-gray-400">Real Estate Dashboard</p>
        </div>

        {/* Navigation items */}
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname?.startsWith(item.path);
              
              return (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className={`
                      flex items-center p-3 rounded-md transition-colors duration-200
                      ${isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
                    `}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                    {isActive && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-white"></span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User info at bottom of sidebar */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-700 mr-3"></div>
            <div>
              <p className="text-sm font-medium">Demo User</p>
              <p className="text-xs text-gray-400">Investor Account</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile - only visible when mobile menu is open */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-0"
          onClick={toggleMobileMenu}
        />
      )}
    </>
  );
} 