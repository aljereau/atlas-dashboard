'use client';

import { useState, useEffect } from 'react';
import { Property } from '@/data/mock/properties';
import { isInWatchlist, toggleWatchlist } from '@/utils/localStorage';
import PropertyImage from './PropertyImage';
import { PropertyTag, propertyTags } from '@/data/mock/ai-features';

interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
  animateHover?: boolean;
  showTags?: boolean;
}

export default function PropertyCard({ property, onClick, animateHover = true, showTags = true }: PropertyCardProps) {
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  // Get property tags
  const getPropertyTags = () => {
    return propertyTags.find(pt => pt.propertyId === property.id)?.tags || [];
  };
  
  // Get tag color (simplified version for the mini tags)
  const getTagColor = (tag: PropertyTag) => {
    const colors: Record<PropertyTag, string> = {
      'high-yield': 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800',
      'stable-growth': 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
      'undervalued': 'bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800',
      'prime-location': 'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800',
      'eco-friendly': 'bg-teal-100 dark:bg-teal-900/30 border-teal-200 dark:border-teal-800',
      'high-demand': 'bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800',
      'emerging-market': 'bg-cyan-100 dark:bg-cyan-900/30 border-cyan-200 dark:border-cyan-800',
      'renovation-potential': 'bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800',
      'limited-supply': 'bg-pink-100 dark:bg-pink-900/30 border-pink-200 dark:border-pink-800',
      'price-drop': 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800',
    };
    
    return colors[tag];
  };

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
    if (score >= 5.5) return 'bg-yellow-500';
    if (score >= 4) return 'bg-orange-500';
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
  
  // Format tag display name
  const formatTagName = (tag: PropertyTag): string => {
    return tag
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // The property's tags
  const tags = getPropertyTags();

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
        
        {/* AI tags - small version */}
        {showTags && tags.length > 0 && (
          <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1 justify-start">
            {tags.slice(0, 2).map(tag => (
              <span 
                key={tag} 
                className={`text-xs py-0.5 px-1.5 rounded-sm border font-medium ${getTagColor(tag)}`}
              >
                {formatTagName(tag)}
              </span>
            ))}
            {tags.length > 2 && (
              <span className="text-xs py-0.5 px-1.5 rounded-sm bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 font-medium">
                +{tags.length - 2}
              </span>
            )}
          </div>
        )}
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