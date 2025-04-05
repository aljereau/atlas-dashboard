'use client';

import { useState, useEffect } from 'react';
import { Property, properties as initialProperties } from '@/data/mock/properties';
import { propertyTags } from '@/data/mock/ai-features';
import Button from '@/components/ui/Button';

interface AdminPropertyTableProps {
  onEditProperty: (property: Property) => void;
}

type SortField = 'name' | 'score' | 'price' | 'yield' | 'location';
type SortDirection = 'asc' | 'desc';

export default function AdminPropertyTable({ onEditProperty }: AdminPropertyTableProps) {
  // Property data state
  const [properties, setProperties] = useState<Property[]>([...initialProperties]);
  
  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Get unique locations for filter dropdown
  const getUniqueLocations = () => {
    const locations = properties.map(prop => 
      prop.location.split(',')[0].trim()
    );
    return ['All', ...Array.from(new Set(locations))];
  };
  
  // Filter and sort properties
  const filterAndSortProperties = () => {
    // Filter by search term
    let filtered = properties.filter(property => {
      const matchesSearch = 
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description.toLowerCase().includes(searchTerm.toLowerCase());
        
      // Filter by location
      const matchesLocation = 
        locationFilter === 'All' || 
        property.location.startsWith(locationFilter);
        
      return matchesSearch && matchesLocation;
    });
    
    // Sort by selected field
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;
      
      switch (sortField) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'score':
          aValue = a.score;
          bValue = b.score;
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'yield':
          aValue = a.yield;
          bValue = b.yield;
          break;
        case 'location':
          aValue = a.location;
          bValue = b.location;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }
      
      if (sortDirection === 'asc') {
        return typeof aValue === 'string' 
          ? aValue.localeCompare(bValue as string) 
          : aValue - (bValue as number);
      } else {
        return typeof aValue === 'string' 
          ? (bValue as string).localeCompare(aValue) 
          : (bValue as number) - aValue;
      }
    });
    
    return filtered;
  };
  
  // Get tags for a property
  const getPropertyTags = (propertyId: string) => {
    const tags = propertyTags.find(pt => pt.propertyId === propertyId)?.tags || [];
    return tags.length > 0 ? `${tags.join(', ')}` : 'No tags';
  };
  
  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, set to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Handle delete property
  const handleDeleteProperty = (propertyId: string) => {
    if (window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      const updatedProperties = properties.filter(p => p.id !== propertyId);
      setProperties(updatedProperties);
      
      // Reset to page 1 if we delete the last item on the current page
      const filteredProperties = filterAndSortProperties();
      const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
      if (currentPage > totalPages && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };
  
  // Handle status toggle
  const handleToggleStatus = (propertyId: string, currentStatus: boolean) => {
    const updatedProperties = properties.map(property => {
      if (property.id === propertyId) {
        // Toggle "active" status (we'll add this to the Property interface later)
        return { ...property, active: !currentStatus };
      }
      return property;
    });
    setProperties(updatedProperties);
  };
  
  // Calculate pagination
  const filteredProperties = filterAndSortProperties();
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  return (
    <div className="p-6">
      {/* Filter and search controls */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search Properties
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, location, or description..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Filter by Location
          </label>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            {getUniqueLocations().map(location => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-end">
          <Button
            variant="primary"
            onClick={() => {
              setSearchTerm('');
              setLocationFilter('All');
              setSortField('name');
              setSortDirection('asc');
              setCurrentPage(1);
            }}
          >
            Reset Filters
          </Button>
        </div>
      </div>
      
      {/* Properties table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  <span>Property Name</span>
                  {sortField === 'name' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('location')}
              >
                <div className="flex items-center">
                  <span>Location</span>
                  {sortField === 'location' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center">
                  <span>Price</span>
                  {sortField === 'price' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('score')}
              >
                <div className="flex items-center">
                  <span>Score</span>
                  {sortField === 'score' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('yield')}
              >
                <div className="flex items-center">
                  <span>Yield</span>
                  {sortField === 'yield' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Tags
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Status
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {paginatedProperties.map((property) => (
              <tr key={property.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 mr-3">
                      <div className="h-full w-full bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400">
                        {property.name.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {property.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        ID: {property.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{property.location}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{formatPrice(property.price)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div 
                    className={`inline-block rounded-full px-2 py-1 text-xs font-bold text-white ${
                      property.score >= 8.5 ? 'bg-green-500' :
                      property.score >= 7 ? 'bg-blue-500' : 
                      property.score >= 5.5 ? 'bg-yellow-500' :
                      property.score >= 4 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                  >
                    {property.score.toFixed(1)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                    {property.yield}%
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                    {getPropertyTags(property.id)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => handleToggleStatus(property.id, property.active ?? true)}
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      property.active !== false 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {property.active !== false ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEditProperty(property)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProperty(property.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {/* Empty state */}
            {paginatedProperties.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                  <div className="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="text-lg font-medium">No properties found</p>
                    <p className="mt-1">Try adjusting your search or filter criteria</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, filteredProperties.length)}
            </span>{' '}
            of <span className="font-medium">{filteredProperties.length}</span> properties
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded-md ${
                currentPage === 1
                  ? 'border-gray-200 text-gray-400 dark:border-gray-700 dark:text-gray-600'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              Previous
            </button>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border rounded-md ${
                currentPage === totalPages
                  ? 'border-gray-200 text-gray-400 dark:border-gray-700 dark:text-gray-600'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 