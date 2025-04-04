'use client';

import { useState } from 'react';
import PropertyCard from '@/components/ui/PropertyCard';
import { properties } from '@/data/mock/properties';
import Button from '@/components/ui/Button';

export default function WatchlistPage() {
  // For MVP, just show first 3 properties as if they were on the watchlist
  const watchlistProperties = properties.slice(0, 3);
  const [activeTab, setActiveTab] = useState<'properties' | 'notes'>('properties');

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Watchlist</h1>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'properties'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('properties')}
        >
          Properties
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'notes'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('notes')}
        >
          Notes
        </button>
      </div>
      
      {activeTab === 'properties' && (
        <>
          {watchlistProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {watchlistProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your watchlist is empty</h3>
              <p className="text-gray-500 mb-6">Start adding properties to track your interests.</p>
              <Button variant="primary">Explore Properties</Button>
            </div>
          )}
        </>
      )}
      
      {activeTab === 'notes' && (
        <div className="space-y-6">
          {watchlistProperties.length > 0 ? (
            watchlistProperties.map((property) => (
              <div key={property.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold">{property.name}</h2>
                  <p className="text-sm text-gray-600">{property.location}</p>
                </div>
                <div className="p-4">
                  <textarea
                    className="w-full border border-gray-300 rounded-md p-3 mb-2"
                    rows={4}
                    placeholder="Add your notes about this property..."
                    defaultValue={`This ${property.name} property looks promising. Need to research more about the neighborhood.`}
                  />
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Last edited: 2 days ago</span>
                    <Button variant="outline" size="sm">Save Notes</Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
              <p className="text-gray-500">Add properties to your watchlist to take notes.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 