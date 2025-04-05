'use client';

import { useState, useEffect } from 'react';
import { properties } from '@/data/mock/properties';
import Button from './Button';

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
  className?: string;
}

export default function FilterBar({ 
  onFilterChange,
  initialFilters = {},
  className = ''
}: FilterBarProps) {
  const locations = getUniqueLocations();
  
  const [filters, setFilters] = useState<Filters>({
    location: initialFilters.location || 'All Locations',
    score: initialFilters.score || 'all',
    yield: initialFilters.yield || 'all'
  });
  
  const [expanded, setExpanded] = useState(false);

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
  
  // Count active filters
  const activeFilterCount = Object.values(filters).filter(value => 
    value !== 'All Locations' && value !== 'all'
  ).length;
  
  return (
    <div className={`bg-white dark:bg-gray-800 shadow dark:shadow-gray-700/30 rounded-lg p-4 mb-6 transition-all duration-200 ${className}`}>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="font-medium text-gray-700 dark:text-gray-200 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 animate-scale-in">
                {activeFilterCount}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              disabled={activeFilterCount === 0}
              className="text-sm"
            >
              Reset
            </Button>
            
            <button 
              className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
              aria-label="Toggle filters"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Filter controls - always visible on desktop, toggleable on mobile */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 transition-all duration-300 ease-in-out ${expanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 md:max-h-96 md:opacity-100 overflow-hidden'}`}>
          {/* Location filter */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Location</label>
            <select 
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md transition-colors duration-200"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            >
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
          
          {/* Score filter */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Score</label>
            <select 
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md transition-colors duration-200"
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
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Yield</label>
            <select 
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md transition-colors duration-200"
              value={filters.yield}
              onChange={(e) => handleFilterChange('yield', e.target.value as YieldFilter)}
            >
              <option value="all">All Yields</option>
              <option value="high">High (6%+)</option>
              <option value="medium">Medium (4-6%)</option>
              <option value="low">Low (Below 4%)</option>
            </select>
          </div>
        </div>
        
        {/* Active filters display */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 animate-slide-up">
            {filters.location !== 'All Locations' && (
              <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/60 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-200 transition-all duration-200 hover:shadow-md">
                Location: {filters.location}
                <button 
                  className="ml-1 text-blue-500 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-100"
                  onClick={() => handleFilterChange('location', 'All Locations')}
                  aria-label="Remove location filter"
                >
                  ×
                </button>
              </span>
            )}
            
            {filters.score !== 'all' && (
              <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/60 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-200 transition-all duration-200 hover:shadow-md">
                Score: {filters.score}
                <button 
                  className="ml-1 text-blue-500 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-100"
                  onClick={() => handleFilterChange('score', 'all')}
                  aria-label="Remove score filter"
                >
                  ×
                </button>
              </span>
            )}
            
            {filters.yield !== 'all' && (
              <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/60 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-200 transition-all duration-200 hover:shadow-md">
                Yield: {filters.yield}
                <button 
                  className="ml-1 text-blue-500 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-100"
                  onClick={() => handleFilterChange('yield', 'all')}
                  aria-label="Remove yield filter"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 