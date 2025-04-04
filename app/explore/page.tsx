'use client';

import { useState } from 'react';
import FilterBar from '@/components/ui/FilterBar';
import PropertyCard from '@/components/ui/PropertyCard';
import Modal from '@/components/ui/Modal';
import ChartComponent from '@/components/ui/ChartComponent';
import { Property, properties } from '@/data/mock/properties';

export default function ExplorePage() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Format price to currency format
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Explore Properties</h1>
      
      {/* Filter bar */}
      <FilterBar />
      
      {/* Property grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onClick={() => handlePropertyClick(property)}
          />
        ))}
      </div>

      {/* Property detail modal */}
      {selectedProperty && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={selectedProperty.name}
          size="xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left panel */}
            <div>
              {/* Property image placeholder */}
              <div className="h-48 bg-gray-300 rounded-md mb-4"></div>
              
              <div className="mb-4">
                <p className="text-gray-600">{selectedProperty.location}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-100 p-3 rounded-md">
                  <p className="text-sm text-gray-500">Size</p>
                  <p className="font-semibold">{selectedProperty.sqMeters} m²</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-md">
                  <p className="text-sm text-gray-500">Year Built</p>
                  <p className="font-semibold">{selectedProperty.yearBuilt}</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-md">
                  <p className="text-sm text-gray-500">Energy Label</p>
                  <p className="font-semibold">{selectedProperty.energyLabel}</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-md">
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-semibold">{formatPrice(selectedProperty.price)}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-semibold mb-2">AI Score Breakdown</h3>
                <div className="bg-gray-100 p-3 rounded-md">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-500">Overall</span>
                    <span className="font-medium">{selectedProperty.score.toFixed(1)}/10</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-500">Yield</span>
                    <span className="font-medium">{selectedProperty.yield.toFixed(1)}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Appreciation</span>
                    <span className="font-medium">{selectedProperty.appreciation.toFixed(1)}/10</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right panel */}
            <div>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Investment Simulation</h3>
                <div className="bg-gray-100 p-4 rounded-md">
                  <div className="mb-4">
                    <label className="block text-sm text-gray-500 mb-1">Investment Amount (€)</label>
                    <input 
                      type="number" 
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Enter amount"
                      defaultValue="10000"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Ownership</span>
                      <span className="font-semibold">0.83%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Token Count</span>
                      <span className="font-semibold">32 tokens</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-semibold mb-2">10-Year ROI Forecast</h3>
                <ChartComponent 
                  type="line" 
                  height={180}
                />
              </div>
              
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Rental Income</h3>
                <ChartComponent 
                  type="bar" 
                  height={180}
                />
              </div>
              
              <div className="flex space-x-2">
                <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Buy Now
                </button>
                <button className="w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition-colors">
                  Save to Watchlist
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
} 