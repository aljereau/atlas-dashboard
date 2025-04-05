'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';

// Admin view type
type AdminView = 'properties' | 'analytics' | 'add-property' | 'edit-property';

interface AdminNavbarProps {
  currentView: AdminView;
  onNavigate: (view: AdminView) => void;
}

export default function AdminNavbar({ currentView, onNavigate }: AdminNavbarProps) {
  const { theme, setTheme } = useTheme();
  
  const isActive = (view: AdminView) => currentView === view;
  
  return (
    <div className="bg-blue-700 dark:bg-blue-900 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and title */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-white rounded-md flex items-center justify-center">
                <span className="text-blue-700 font-bold text-lg">A</span>
              </div>
              <span className="font-semibold text-xl">Atlas Admin</span>
            </Link>
          </div>
          
          {/* Navigation links */}
          <div className="flex space-x-1">
            <button
              onClick={() => onNavigate('properties')}
              className={`px-4 py-2 rounded-md transition-colors ${
                isActive('properties')
                  ? 'bg-white bg-opacity-20'
                  : 'hover:bg-white hover:bg-opacity-10'
              }`}
            >
              Properties
            </button>
            <button
              onClick={() => onNavigate('analytics')}
              className={`px-4 py-2 rounded-md transition-colors ${
                isActive('analytics')
                  ? 'bg-white bg-opacity-20'
                  : 'hover:bg-white hover:bg-opacity-10'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => onNavigate('add-property')}
              className={`px-4 py-2 rounded-md transition-colors ${
                isActive('add-property')
                  ? 'bg-white bg-opacity-20'
                  : 'hover:bg-white hover:bg-opacity-10'
              }`}
            >
              Add Property
            </button>
          </div>
          
          {/* Right side - theme toggle and user menu */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-white hover:bg-opacity-10"
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            
            {/* Admin user dropdown (simplified) */}
            <div className="relative">
              <div className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-white hover:bg-opacity-10">
                <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-700">
                  <span className="font-semibold">A</span>
                </div>
                <span>Admin User</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Secondary navigation - breadcrumbs */}
      <div className="bg-blue-800 dark:bg-blue-950 py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-blue-100">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">→</span>
            <Link href="/admin" className="hover:text-white">Admin</Link>
            <span className="mx-2">→</span>
            <span className="text-white">
              {currentView === 'properties' && 'Property Management'}
              {currentView === 'analytics' && 'Analytics'}
              {currentView === 'add-property' && 'Add Property'}
              {currentView === 'edit-property' && 'Edit Property'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 