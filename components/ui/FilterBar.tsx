'use client';

interface FilterBarProps {
  // This will be extended in future phases
  onFilterChange?: (filters: Record<string, any>) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  // This is a placeholder component for now
  // We'll implement actual filter functionality in Phase 2
  
  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="font-medium text-gray-700">Filters</div>
        
        {/* Location filter (placeholder) */}
        <div className="relative">
          <select 
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            defaultValue=""
          >
            <option value="" disabled>Location</option>
            <option value="all">All Locations</option>
            <option value="europe">Europe</option>
            <option value="asia">Asia</option>
            <option value="america">America</option>
          </select>
        </div>
        
        {/* Score filter (placeholder) */}
        <div className="relative">
          <select 
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            defaultValue=""
          >
            <option value="" disabled>Score</option>
            <option value="all">All Scores</option>
            <option value="high">High (8+)</option>
            <option value="medium">Medium (6-8)</option>
            <option value="low">Low (Below 6)</option>
          </select>
        </div>
        
        {/* Yield filter (placeholder) */}
        <div className="relative">
          <select 
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            defaultValue=""
          >
            <option value="" disabled>Yield</option>
            <option value="all">All Yields</option>
            <option value="high">High (6%+)</option>
            <option value="medium">Medium (4-6%)</option>
            <option value="low">Low (Below 4%)</option>
          </select>
        </div>
        
        {/* Reset button */}
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200">
          Reset Filters
        </button>
      </div>
    </div>
  );
} 