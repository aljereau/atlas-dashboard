'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { notifications } from '@/data/mock/analytics';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [notificationList, setNotificationList] = useState(notifications);
  
  // Handler for dismissing a notification
  const handleDismissNotification = (id: string) => {
    setNotificationList(current => current.filter(notification => notification.id !== id));
  };
  
  // Handler for marking a notification as read
  const handleMarkAsRead = (id: string) => {
    setNotificationList(current => 
      current.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };
  
  // Handler for clearing all notifications
  const handleClearAll = () => {
    setNotificationList([]);
  };
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <Sidebar />
      
      {/* Main content area - adjusted to account for sidebar */}
      <div className="md:ml-64 min-h-screen">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm py-4 px-6 flex justify-between items-center transition-colors duration-200">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Atlas Dashboard</h1>
          
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <ThemeToggle />
            
            {/* Notification icon with dropdown */}
            <NotificationCenter 
              notifications={notificationList}
              onDismiss={handleDismissNotification}
              onMarkAsRead={handleMarkAsRead}
              onClearAll={handleClearAll}
            />
            
            {/* User dropdown placeholder */}
            <div className="flex items-center cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-200 hidden sm:block">Demo User</span>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="p-6">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 p-6 border-t dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
          <p>© {new Date().getFullYear()} Atlas Dashboard. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
} 