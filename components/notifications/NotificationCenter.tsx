'use client';

import { useState } from 'react';
import { Notification } from '@/data/types/analytics';
import Link from 'next/link';

interface NotificationCenterProps {
  notifications: Notification[];
  onDismiss?: (id: string) => void;
  onMarkAsRead?: (id: string) => void;
  onClearAll?: () => void;
}

export default function NotificationCenter({ 
  notifications,
  onDismiss,
  onMarkAsRead,
  onClearAll
}: NotificationCenterProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'price' | 'portfolio' | 'market' | 'system'>('all');
  const [isOpen, setIsOpen] = useState(false);
  
  // Filter notifications based on active filter
  const filteredNotifications = activeFilter === 'all'
    ? notifications
    : notifications.filter(notification => notification.type === activeFilter);
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  // Format relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };
  
  // Get icon for notification type
  const getNotificationIcon = (type: string, importance: string) => {
    let iconPath = '';
    let bgColorClass = '';
    
    switch (type) {
      case 'price':
        iconPath = (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.94 5.5c.944-.945 2.56-.276 2.56 1.06V8h5.75a.75.75 0 010 1.5H8.5v4.275c0 .296.144.455.26.499a3.5 3.5 0 004.402-1.77h-.412a.75.75 0 010-1.5h1.5A.75.75 0 0115 12v1.75a1.75 1.75 0 01-1.75 1.75h-.511a5 5 0 01-4.932-4.136A1.2 1.2 0 017 10.274V9.5H4.75a.75.75 0 010-1.5H7V7.06l-.884.884a.75.75 0 11-1.06-1.06l.884-.884z" clipRule="evenodd" />
          </svg>
        );
        bgColorClass = 'bg-blue-100 text-blue-800';
        break;
      case 'portfolio':
        iconPath = (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
            <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
          </svg>
        );
        bgColorClass = 'bg-green-100 text-green-800';
        break;
      case 'market':
        iconPath = (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
        bgColorClass = 'bg-purple-100 text-purple-800';
        break;
      case 'system':
        iconPath = (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
        bgColorClass = 'bg-yellow-100 text-yellow-800';
        break;
    }
    
    // Adjust for importance
    if (importance === 'high') {
      bgColorClass = type === 'price' ? 'bg-blue-600 text-white' : 
                     type === 'portfolio' ? 'bg-green-600 text-white' :
                     type === 'market' ? 'bg-purple-600 text-white' : 
                     'bg-yellow-600 text-white';
    }
    
    return (
      <div className={`flex items-center justify-center rounded-full h-8 w-8 ${bgColorClass}`}>
        {iconPath}
      </div>
    );
  };
  
  return (
    <div className="relative">
      {/* Notification Bell */}
      <button 
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>
      
      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* Filters */}
          <div className="flex space-x-1 px-4 py-2 bg-gray-50 text-xs font-medium">
            {['all', 'price', 'portfolio', 'market', 'system'].map((filter) => (
              <button
                key={filter}
                className={`px-2 py-1 rounded-full ${
                  activeFilter === filter
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setActiveFilter(filter as any)}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p>No notifications to display</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredNotifications.map((notification) => (
                  <li 
                    key={notification.id} 
                    className={`p-4 hover:bg-gray-50 ${notification.isRead ? '' : 'bg-blue-50'}`}
                  >
                    <div className="flex">
                      <div className="flex-shrink-0 mr-3">
                        {getNotificationIcon(notification.type, notification.importance)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                          <span className="text-xs text-gray-500">{getRelativeTime(notification.timestamp)}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        {notification.action && (
                          <Link href={notification.action.url} className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800">
                            {notification.action.label}
                          </Link>
                        )}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="mt-2 flex justify-end space-x-2 text-xs">
                      {!notification.isRead && onMarkAsRead && (
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => onMarkAsRead(notification.id)}
                        >
                          Mark as read
                        </button>
                      )}
                      {onDismiss && (
                        <button
                          className="text-gray-500 hover:text-gray-700"
                          onClick={() => onDismiss(notification.id)}
                        >
                          Dismiss
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 text-right">
            {onClearAll && filteredNotifications.length > 0 && (
              <button
                className="text-sm text-gray-600 hover:text-gray-900"
                onClick={onClearAll}
              >
                Clear all notifications
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 