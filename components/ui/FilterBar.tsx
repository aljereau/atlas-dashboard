'use client';

import { useState, useEffect } from 'react';
import { properties } from '@/data/mock/properties';

// Get unique locations from properties data
const getUniqueLocations = () => {
  const locations = properties.map(prop => prop.location.split(',')[0].trim());
  return ['All Locations', ...Array.from(new Set(locations))];
};

// Filter ranges
export type ScoreFilter = 'all' | 'high' | 'medium' | 'low';
export type YieldFilter = 'all' | 'high' | 'medium' | 'low';

export interface Filters {
  location: string;
  score: ScoreFilter;
  yield: YieldFilter;
}

interface FilterBarProps {
  onFilterChange: (filters: Filters) => void;
  initialFilters?: Partial<Filters>;
}

export default function FilterBar({ 
  onFilterChange,
  initialFilters = {} 
}: FilterBarProps) {
  const locations = getUniqueLocations();
  
  const [filters, setFilters] = useState<Filters>({
    location: initialFilters.location || 'All Locations',
    score: initialFilters.score || 'all',
    yield: initialFilters.yield || 'all'
  });

  // Apply filters when they change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  // Handle filter changes
  const handleFilterChange = (filterName: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      location: 'All Locations',
      score: 'all',
      yield: 'all'
    });
  };
  
  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="font-medium text-gray-700">Filters</div>
        
        {/* Location filter */}
        <div className="relative">
          <select 
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
          >
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>
        
        {/* Score filter */}
        <div className="relative">
          <select 
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={filters.score}
            onChange={(e) => handleFilterChange('score', e.target.value as ScoreFilter)}
          >
            <option value="all">All Scores</option>
            <option value="high">High (8+)</option>
            <option value="medium">Medium (6-8)</option>
            <option value="low">Low (Below 6)</option>
          </select>
        </div>
        
        {/* Yield filter */}
        <div className="relative">
          <select 
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={filters.yield}
            onChange={(e) => handleFilterChange('yield', e.target.value as YieldFilter)}
          >
            <option value="all">All Yields</option>
            <option value="high">High (6%+)</option>
            <option value="medium">Medium (4-6%)</option>
            <option value="low">Low (Below 4%)</option>
          </select>
        </div>
        
        {/* Reset button */}
        <button 
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200"
          onClick={resetFilters}
        >
          Reset Filters
        </button>
      </div>
      
      {/* Active filters display */}
      <div className="mt-2 flex flex-wrap gap-2">
        {filters.location !== 'All Locations' && (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            Location: {filters.location}
            <button 
              className="ml-1 text-blue-500 hover:text-blue-700"
              onClick={() => handleFilterChange('location', 'All Locations')}
            >
              ×
            </button>
          </span>
        )}
        
        {filters.score !== 'all' && (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            Score: {filters.score}
            <button 
              className="ml-1 text-blue-500 hover:text-blue-700"
              onClick={() => handleFilterChange('score', 'all')}
            >
              ×
            </button>
          </span>
        )}
        
        {filters.yield !== 'all' && (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            Yield: {filters.yield}
            <button 
              className="ml-1 text-blue-500 hover:text-blue-700"
              onClick={() => handleFilterChange('yield', 'all')}
            >
              ×
            </button>
          </span>
        )}
      </div>
    </div>
  );
} 