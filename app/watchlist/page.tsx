'use client';

import { useState, useEffect } from 'react';
import PropertyCard from '@/components/ui/PropertyCard';
import { properties } from '@/data/mock/properties';
import Button from '@/components/ui/Button';
import { getWatchlist } from '@/utils/localStorage';
import { useRouter } from 'next/navigation';
import Modal from '@/components/ui/Modal';

export default function WatchlistPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'properties' | 'notes'>('properties');
  const [watchlistProperties, setWatchlistProperties] = useState<typeof properties>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });

  // Load watchlisted properties on component mount
  useEffect(() => {
    const loadWatchlist = () => {
      const watchlistIds = getWatchlist();
      const watchlistedProperties = properties.filter(prop => watchlistIds.includes(prop.id));
      setWatchlistProperties(watchlistedProperties);

      // Load notes from localStorage
      try {
        const savedNotes = localStorage.getItem('atlas_dashboard_notes');
        if (savedNotes) {
          setNotes(JSON.parse(savedNotes));
        }
      } catch (error) {
        console.error('Error loading notes:', error);
      }
    };

    loadWatchlist();
  }, []);

  // Handle note change
  const handleNoteChange = (propertyId: string, value: string) => {
    const updatedNotes = { ...notes, [propertyId]: value };
    setNotes(updatedNotes);
  };

  // Save note
  const saveNote = (propertyId: string) => {
    try {
      localStorage.setItem('atlas_dashboard_notes', JSON.stringify(notes));
      
      // Show success modal
      setModalContent({
        title: 'Note Saved',
        message: 'Your note has been saved successfully.'
      });
      setIsModalOpen(true);
      
      // Auto close modal after 2 seconds
      setTimeout(() => {
        setIsModalOpen(false);
      }, 2000);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

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
                <PropertyCard 
                  key={property.id} 
                  property={property} 
                  onClick={() => router.push('/explore')}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your watchlist is empty</h3>
              <p className="text-gray-500 mb-6">Start adding properties to track your interests.</p>
              <Button 
                variant="primary"
                onClick={() => router.push('/explore')}
              >
                Explore Properties
              </Button>
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
                    value={notes[property.id] || ''}
                    onChange={(e) => handleNoteChange(property.id, e.target.value)}
                  />
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">
                      {notes[property.id] ? 'Last edited: just now' : 'No notes yet'}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => saveNote(property.id)}
                    >
                      Save Notes
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
              <p className="text-gray-500 mb-4">Add properties to your watchlist to take notes.</p>
              <Button 
                variant="primary"
                onClick={() => router.push('/explore')}
              >
                Explore Properties
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Success modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalContent.title}
        size="sm"
      >
        <div className="p-4 text-center">
          <p>{modalContent.message}</p>
        </div>
      </Modal>
    </div>
  );
} 