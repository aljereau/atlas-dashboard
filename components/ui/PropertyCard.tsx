'use client';

import { useState, useEffect } from 'react';
import { Property } from '@/data/mock/properties';
import { isInWatchlist, toggleWatchlist } from '@/utils/localStorage';
import PropertyImage from './PropertyImage';

interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
}

export default function PropertyCard({ property, onClick }: PropertyCardProps) {
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

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
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 relative"
      onClick={onClick}
    >
      {/* Watchlist button */}
      <button
        className={`absolute top-2 left-2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
          isWatchlisted 
            ? 'bg-blue-500 text-white' 
            : 'bg-white text-gray-400 hover:text-gray-600'
        }`}
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
          className="w-5 h-5"
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
        <div className="absolute inset-0 bg-blue-500 bg-opacity-20 z-10 flex items-center justify-center animate-fade-out pointer-events-none">
          <div className="bg-white rounded-lg p-2 shadow-lg">
            <span className="text-blue-600 font-semibold">Added to watchlist</span>
          </div>
        </div>
      )}
      
      {/* Property image */}
      <div className="relative h-40">
        <PropertyImage 
          id={property.id} 
          name={property.name} 
          height={160}
        />
        
        {/* Score badge */}
        <div className="absolute top-2 right-2">
          <span className={`inline-block ${getScoreColor(property.score)} text-white text-sm font-bold px-2 py-1 rounded`}>
            {property.score.toFixed(1)}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold truncate text-gray-900">{property.name}</h3>
        <p className="text-gray-700 text-sm mb-2">{property.location}</p>
        
        <div className="text-xl font-bold mb-2 text-gray-900">
          {formatPrice(property.price)}
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-700">Yield:</span>
            <span className="ml-1 font-medium text-green-600">{property.yield}%</span>
          </div>
          <div>
            <span className="text-gray-700">Appreciation:</span>
            <span className="ml-1 font-medium text-blue-600">{property.appreciation}%</span>
          </div>
        </div>
        
        <button className="mt-3 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
          View Details
        </button>
      </div>
    </div>
  );
} 