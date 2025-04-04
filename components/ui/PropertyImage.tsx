'use client';

import { useState } from 'react';
import Image from 'next/image';

interface PropertyImageProps {
  id: string;
  name: string;
  className?: string;
  height?: number;
}

export default function PropertyImage({ id, name, className = '', height = 160 }: PropertyImageProps) {
  const [error, setError] = useState(false);
  
  // For our MVP, we'll use a placeholder gradient that's unique to each property
  // In a real application, we would use actual property images
  const getBackgroundColor = () => {
    // Generate a consistent color based on property ID
    const numId = parseInt(id.replace(/[^0-9]/g, '')) || 1;
    const hue = (numId * 137) % 360; // Golden ratio * 360
    return `hsl(${hue}, 70%, 80%)`;
  };

  // Create a unique pattern based on property ID
  const getPatternIndex = () => {
    const numId = parseInt(id.replace(/[^0-9]/g, '')) || 1;
    return (numId % 5) + 1; // 1-5 pattern variations
  };

  // Render fallback placeholder with property initial
  const renderPlaceholder = () => {
    const initial = name.charAt(0).toUpperCase();
    const bgColor = getBackgroundColor();
    const pattern = getPatternIndex();
    
    return (
      <div 
        className={`relative overflow-hidden ${className}`} 
        style={{ 
          height, 
          backgroundColor: bgColor,
        }}
      >
        {/* Pattern overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(/images/pattern${pattern}.svg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        {/* Property initial */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold text-white text-opacity-80">
            {initial}
          </span>
        </div>
      </div>
    );
  };

  // If we have actual images in the future, this would handle them
  if (error) {
    return renderPlaceholder();
  }

  // For MVP, just use the placeholder for all properties
  return renderPlaceholder();
  
  // Real implementation would be like this:
  /*
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ height }}>
      <Image
        src={`/images/properties/${id}.jpg`}
        alt={name}
        fill
        objectFit="cover"
        onError={() => setError(true)}
      />
    </div>
  );
  */
} 