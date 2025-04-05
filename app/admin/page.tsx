'use client';

import { useState } from 'react';
import AdminNavbar from '@/components/admin/AdminNavbar';
import AdminPropertyTable from '@/components/admin/AdminPropertyTable';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import AdminPropertyForm from '@/components/admin/AdminPropertyForm';
import { Property } from '@/data/mock/properties';

// Admin dashboard content types
type AdminView = 'properties' | 'analytics' | 'add-property' | 'edit-property';

export default function AdminDashboard() {
  const [currentView, setCurrentView] = useState<AdminView>('properties');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  // Handle navigation between different admin views
  const handleNavigation = (view: AdminView) => {
    setCurrentView(view);
    if (view !== 'edit-property') {
      setSelectedProperty(null);
    }
  };
  
  // Handle property edit action
  const handleEditProperty = (property: Property) => {
    setSelectedProperty(property);
    setCurrentView('edit-property');
  };
  
  // Render the appropriate view based on the current selection
  const renderView = () => {
    switch (currentView) {
      case 'properties':
        return <AdminPropertyTable onEditProperty={handleEditProperty} />;
      case 'analytics':
        return <AdminAnalytics />;
      case 'add-property':
        return <AdminPropertyForm />;
      case 'edit-property':
        return selectedProperty ? (
          <AdminPropertyForm property={selectedProperty} />
        ) : (
          <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md">
            No property selected for editing. Please select a property from the table.
          </div>
        );
      default:
        return <AdminPropertyTable onEditProperty={handleEditProperty} />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Admin navbar */}
      <AdminNavbar 
        currentView={currentView}
        onNavigate={handleNavigation}
      />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentView === 'properties' && 'Property Management'}
            {currentView === 'analytics' && 'Engagement Analytics'}
            {currentView === 'add-property' && 'Add New Property'}
            {currentView === 'edit-property' && 'Edit Property'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {currentView === 'properties' && 'Manage, edit, and control all properties on the platform.'}
            {currentView === 'analytics' && 'View platform engagement metrics and property statistics.'}
            {currentView === 'add-property' && 'Add a new property to the Atlas platform.'}
            {currentView === 'edit-property' && `Editing ${selectedProperty?.name || 'property'}`}
          </p>
        </div>
        
        {/* Main content area */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          {renderView()}
        </div>
      </div>
    </div>
  );
} 