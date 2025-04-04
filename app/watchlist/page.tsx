'use client';

import { useState, useEffect } from 'react';
import PropertyCard from '@/components/ui/PropertyCard';
import { properties } from '@/data/mock/properties';
import Button from '@/components/ui/Button';
import { getWatchlist, removeFromWatchlist } from '@/utils/localStorage';
import { useRouter } from 'next/navigation';
import Modal from '@/components/ui/Modal';
import NotesEditor from '@/components/watchlist/NotesEditor';

// Interface for note metadata
interface NoteData {
  text: string;
  lastEdited: string; // ISO date string
}

export default function WatchlistPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'properties' | 'notes'>('properties');
  const [watchlistProperties, setWatchlistProperties] = useState<typeof properties>([]);
  const [notes, setNotes] = useState<Record<string, NoteData>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'price'>('name');
  const [isExporting, setIsExporting] = useState(false);

  // Load watchlisted properties on component mount
  useEffect(() => {
    loadWatchlist();
  }, []);

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

  // Remove property from watchlist
  const handleRemoveFromWatchlist = (propertyId: string) => {
    removeFromWatchlist(propertyId);
    loadWatchlist();
    
    // Show success modal
    setModalContent({
      title: 'Property Removed',
      message: 'Property has been removed from your watchlist.'
    });
    setIsModalOpen(true);
  };

  // Handle note change
  const handleNoteChange = (propertyId: string, value: string) => {
    const updatedNotes = { 
      ...notes, 
      [propertyId]: {
        text: value,
        lastEdited: new Date().toISOString()
      } 
    };
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

  // Format date to readable format
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Count words in text
  const countWords = (text: string) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).length;
  };

  // Filter properties by search term
  const filteredProperties = watchlistProperties.filter(property => 
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'price') {
      return b.price - a.price;
    } else if (sortBy === 'date') {
      const dateA = notes[a.id]?.lastEdited ? new Date(notes[a.id].lastEdited).getTime() : 0;
      const dateB = notes[b.id]?.lastEdited ? new Date(notes[b.id].lastEdited).getTime() : 0;
      return dateB - dateA;
    }
    return 0;
  });

  // Export watchlist as CSV
  const exportWatchlist = () => {
    setIsExporting(true);
    
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add headers
    csvContent += "Property Name,Location,Price (EUR),Yield (%),Notes,Last Edited\n";
    
    // Add property data
    sortedProperties.forEach(property => {
      const noteText = notes[property.id]?.text || "";
      const lastEdited = notes[property.id]?.lastEdited ? formatDate(notes[property.id].lastEdited) : "Never";
      
      // Escape quotes in the note text
      const escapedNote = noteText.replace(/"/g, '""');
      
      csvContent += `"${property.name}","${property.location}","${property.price}","${property.yield}","${escapedNote}","${lastEdited}"\n`;
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `atlas_watchlist_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    document.body.removeChild(link);
    
    // Show success modal
    setModalContent({
      title: 'Export Complete',
      message: 'Your watchlist has been exported successfully.'
    });
    setIsModalOpen(true);
    setIsExporting(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Watchlist</h1>
        
        {watchlistProperties.length > 0 && (
          <Button 
            variant="outline" 
            onClick={exportWatchlist}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export Watchlist'}
          </Button>
        )}
      </div>
      
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
          Properties ({watchlistProperties.length})
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
      
      {/* Search and sort controls */}
      {watchlistProperties.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                id="search"
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Search by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                id="sort"
                className="border border-gray-300 rounded-md p-2"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="name">Name</option>
                <option value="price">Price (High to Low)</option>
                <option value="date">Last Edited</option>
              </select>
            </div>
          </div>
          
          {searchTerm && (
            <div className="mt-2 text-sm">
              <span className="text-gray-500">Found {filteredProperties.length} properties matching "{searchTerm}"</span>
              {filteredProperties.length !== watchlistProperties.length && (
                <button 
                  className="ml-2 text-blue-600 hover:text-blue-800"
                  onClick={() => setSearchTerm('')}
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'properties' && (
        <>
          {watchlistProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProperties.map((property) => (
                <div key={property.id} className="relative group">
                  <PropertyCard 
                    property={property} 
                    onClick={() => router.push(`/explore?property=${property.id}`)}
                  />
                  <button 
                    className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromWatchlist(property.id);
                    }}
                    title="Remove from watchlist"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
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
          {filteredProperties.length > 0 ? (
            sortedProperties.map((property) => (
              <div key={property.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold">{property.name}</h2>
                    <p className="text-sm text-gray-600">{property.location}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push(`/explore?property=${property.id}`)}
                  >
                    View Property
                  </Button>
                </div>
                <div className="p-4">
                  <NotesEditor 
                    propertyId={property.id}
                    initialValue={notes[property.id]?.text || ''}
                    lastEdited={notes[property.id]?.lastEdited}
                    onSave={(propertyId, text) => {
                      handleNoteChange(propertyId, text);
                      saveNote(propertyId);
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              {searchTerm ? (
                <h3 className="text-lg font-medium text-gray-900 mb-2">No properties match your search</h3>
              ) : (
                <>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
                  <p className="text-gray-500 mb-4">Add properties to your watchlist to take notes.</p>
                  <Button 
                    variant="primary"
                    onClick={() => router.push('/explore')}
                  >
                    Explore Properties
                  </Button>
                </>
              )}
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