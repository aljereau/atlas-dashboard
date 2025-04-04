'use client';

import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      
      {/* Main content area - adjusted to account for sidebar */}
      <div className="md:ml-64 min-h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Atlas Dashboard</h1>
          
          <div className="flex items-center space-x-4">
            {/* Notification icon placeholder */}
            <button className="text-gray-600 hover:text-gray-800">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
            </button>
            
            {/* User dropdown placeholder */}
            <div className="flex items-center cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gray-300"></div>
              <span className="ml-2 text-sm font-medium hidden sm:block">Demo User</span>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="p-6">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="bg-white p-6 border-t text-center text-sm text-gray-700">
          <p>© {new Date().getFullYear()} Atlas Dashboard. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
} 