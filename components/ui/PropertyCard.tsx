'use client';

import { useState, useEffect } from 'react';
import { Property } from '@/data/mock/properties';
import { isInWatchlist, toggleWatchlist } from '@/utils/localStorage';
import PropertyImage from './PropertyImage';

interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
  animateHover?: boolean;
}

export default function PropertyCard({ property, onClick, animateHover = true }: PropertyCardProps) {
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Check if property is in watchlist on component mount
  useEffect(() => {
    setIsWatchlisted(isInWatchlist(property.id));
  }, [property.id]);

  // Format price to currency format
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Determine score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'bg-green-500';
    if (score >= 7) return 'bg-blue-500';
    if (score >= 5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Handle watchlist toggle
  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    const isAdded = toggleWatchlist(property.id);
    setIsWatchlisted(isAdded);
    
    if (isAdded) {
      // Show the added animation
      setAddedAnimation(true);
      setTimeout(() => setAddedAnimation(false), 1500);
    }
  };

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer 
        transition-all duration-300 relative
        ${animateHover ? 'hover:shadow-xl hover:-translate-y-1' : 'hover:shadow-lg'}
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Watchlist button */}
      <button
        className={`absolute top-2 left-2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all 
          ${isWatchlisted 
            ? 'bg-blue-500 dark:bg-blue-600 text-white scale-100' 
            : 'bg-white dark:bg-gray-700 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white scale-90 hover:scale-100'
          }
          ${isHovering && !isWatchlisted ? 'opacity-100' : isWatchlisted ? 'opacity-100' : 'opacity-75'}
        `}
        onClick={handleWatchlistToggle}
        aria-label={isWatchlisted ? "Remove from watchlist" : "Add to watchlist"}
      >
        {/* Star icon */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill={isWatchlisted ? "currentColor" : "none"} 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor" 
          className={`w-5 h-5 transition-transform duration-300 ${isWatchlisted ? 'scale-110' : 'scale-100'}`}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" 
          />
        </svg>
      </button>

      {/* Added to watchlist animation */}
      {addedAnimation && (
        <div className="absolute inset-0 bg-blue-500 bg-opacity-20 dark:bg-blue-500 dark:bg-opacity-30 z-10 flex items-center justify-center animate-fade-out pointer-events-none">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-2 shadow-lg">
            <span className="text-blue-600 dark:text-blue-400 font-semibold">Added to watchlist</span>
          </div>
        </div>
      )}
      
      {/* Property image */}
      <div className="relative h-40 overflow-hidden">
        <PropertyImage 
          id={property.id} 
          name={property.name} 
          height={160}
        />
        
        {/* Score badge */}
        <div className="absolute top-2 right-2">
          <span className={`inline-block ${getScoreColor(property.score)} text-white text-sm font-bold px-2 py-1 rounded shadow-md`}>
            {property.score.toFixed(1)}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold truncate text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">{property.name}</h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">{property.location}</p>
        
        <div className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
          {formatPrice(property.price)}
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-700 dark:text-gray-300">Yield:</span>
            <span className="ml-1 font-medium text-green-600 dark:text-green-400">{property.yield}%</span>
          </div>
          <div>
            <span className="text-gray-700 dark:text-gray-300">Appreciation:</span>
            <span className="ml-1 font-medium text-blue-600 dark:text-blue-400">{property.appreciation}%</span>
          </div>
        </div>
        
        <button className="mt-3 w-full py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 font-medium transform hover:scale-[1.01]">
          View Details
        </button>
      </div>
    </div>
  );
} 