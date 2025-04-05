'use client';

import { useState } from 'react';
import { PropertyTag, PropertyTags as PropertyTagsData } from '@/data/mock/ai-features';

// Tag color mapping
const getTagColor = (tag: PropertyTag) => {
  const colors = {
    'high-yield': 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300 border-green-200 dark:border-green-800/60',
    'stable-growth': 'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300 border-blue-200 dark:border-blue-800/60',
    'undervalued': 'bg-purple-100 text-purple-800 dark:bg-purple-800/30 dark:text-purple-300 border-purple-200 dark:border-purple-800/60',
    'prime-location': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-800/30 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60',
    'eco-friendly': 'bg-teal-100 text-teal-800 dark:bg-teal-800/30 dark:text-teal-300 border-teal-200 dark:border-teal-800/60',
    'high-demand': 'bg-orange-100 text-orange-800 dark:bg-orange-800/30 dark:text-orange-300 border-orange-200 dark:border-orange-800/60',
    'emerging-market': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-800/30 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/60',
    'renovation-potential': 'bg-amber-100 text-amber-800 dark:bg-amber-800/30 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
    'limited-supply': 'bg-pink-100 text-pink-800 dark:bg-pink-800/30 dark:text-pink-300 border-pink-200 dark:border-pink-800/60',
    'price-drop': 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300 border-red-200 dark:border-red-800/60',
  };
  
  return colors[tag];
};

// Tag icon mapping
const getTagIcon = (tag: PropertyTag) => {
  const icons = {
    'high-yield': (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
      </svg>
    ),
    'stable-growth': (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
      </svg>
    ),
    'undervalued': (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 12a1 1 0 11-2 0 1 1 0 012 0zm-1-3a1 1 0 00-1 1v.5a.5.5 0 001 0V12a1 1 0 100-2 2 2 0 114 0 .5.5 0 001 0 3 3 0 00-6 0v.5a1.5 1.5 0 003 0V12a2 2 0 00-2-2z" clipRule="evenodd" />
      </svg>
    ),
    'prime-location': (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
      </svg>
    ),
    'eco-friendly': (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.382 13.795a1 1 0 01-1.168.8 6.03 6.03 0 01-2.161-.919 1 1 0 11.993-1.736 4.01 4.01 0 001.476.607 1 1 0 01.86 1.248zm11.168.8a1 1 0 001.168-.8 1 1 0 00-.86-1.248 4.01 4.01 0 01-1.476-.607 1 1 0 10-.993 1.736 6.03 6.03 0 002.161.919zm-2.382-6.608a1 1 0 010 1.414 1 1 0 01-1.414 0 2 2 0 00-2.828 0 1 1 0 11-1.414-1.414 4 4 0 015.656 0zM10 7a1 1 0 11-2 0 1 1 0 012 0zm8.121 2.707a1 1 0 10-1.842-.768 4.01 4.01 0 01-.823 1.319 1 1 0 101.501 1.317 6.03 6.03 0 001.164-1.868zm-14.242 0a1 1 0 011.842-.768 4.01 4.01 0 00.823 1.319 1 1 0 11-1.501 1.317 6.03 6.03 0 01-1.164-1.868z" clipRule="evenodd" />
      </svg>
    ),
    'high-demand': (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
      </svg>
    ),
    'emerging-market': (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
      </svg>
    ),
    'renovation-potential': (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
      </svg>
    ),
    'limited-supply': (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
      </svg>
    ),
    'price-drop': (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    ),
  };
  
  return icons[tag];
};

// Format tag display name
const formatTagName = (tag: PropertyTag): string => {
  return tag
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

interface PropertyTagsProps {
  tags: PropertyTagsData;
  className?: string;
  onTagClick?: (tag: PropertyTag) => void;
}

export default function PropertyTags({ tags, className = '', onTagClick }: PropertyTagsProps) {
  const [activeTag, setActiveTag] = useState<PropertyTag | null>(null);
  
  const handleTagClick = (tag: PropertyTag) => {
    if (onTagClick) {
      onTagClick(tag);
    }
    setActiveTag(activeTag === tag ? null : tag);
  };
  
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex flex-wrap gap-2">
        {tags.tags.map((tag) => (
          <div 
            key={tag}
            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border cursor-pointer transition-all duration-200 ${getTagColor(tag)} hover:shadow-md transform hover:-translate-y-0.5`}
            onClick={() => handleTagClick(tag)}
          >
            <span className="mr-1">{getTagIcon(tag)}</span>
            {formatTagName(tag)}
          </div>
        ))}
      </div>
      
      {/* Tag explanation */}
      {activeTag && (
        <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300 animate-slide-up">
          <p>{tags.tagExplanations[activeTag]}</p>
        </div>
      )}
    </div>
  );
} 