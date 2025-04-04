'use client';

import Link from 'next/link';
import { MdClose, MdMenu, MdNotifications, MdSettings } from 'react-icons/md';

// ... existing imports and code ...

// For the sidebar navigation items, let's update their text color
return (
  <div className="flex h-screen bg-gray-100">
    {/* Sidebar - mobile overlay */}
    {isMobileMenuOpen && (
      <div
        className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20"
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>
    )}
    
    {/* Sidebar */}
    <aside
      className={`${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 w-64 bg-blue-700 overflow-y-auto transition duration-300 ease-in-out transform z-30 lg:translate-x-0 lg:relative lg:z-0`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-blue-800">
        <span className="text-2xl font-bold text-white">Atlas</span>
        <button
          className="lg:hidden text-white"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <MdClose size={24} />
        </button>
      </div>
      
      {/* Navigation */}
      <nav>
        <ul className="mt-4">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link href={item.path}>
                <span
                  className={`flex items-center px-6 py-3 text-white hover:bg-blue-800 ${
                    pathname === item.path ? 'bg-blue-800' : ''
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* User profile */}
      <div className="absolute bottom-0 w-full">
        <div className="px-6 py-4 border-t border-blue-800">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-300 mr-3"></div>
            <div>
              <p className="text-sm font-medium text-white">Demo User</p>
              <p className="text-xs text-blue-200">demo@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
    
    {/* Main content */}
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-white shadow-sm flex items-center">
        <div className="flex-1 px-4 flex justify-between">
          <button
            className="lg:hidden text-gray-700"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <MdMenu size={24} />
          </button>
          <div className="ml-auto flex items-center">
            <span className="text-gray-700 mr-4">
              <MdNotifications size={20} />
            </span>
            <span className="text-gray-700">
              <MdSettings size={20} />
            </span>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  </div>
); 