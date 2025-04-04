'use client';

import { useState, useEffect } from 'react';
import FilterBar, { Filters } from '@/components/ui/FilterBar';
import PropertyCard from '@/components/ui/PropertyCard';
import Modal from '@/components/ui/Modal';
import ChartComponent from '@/components/ui/ChartComponent';
import Button from '@/components/ui/Button';
import PropertyImage from '@/components/ui/PropertyImage';
import { Property, properties } from '@/data/mock/properties';
import { filterProperties } from '@/utils/filterProperties';
import { toggleWatchlist, isInWatchlist } from '@/utils/localStorage';

export default function ExplorePage() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties);
  const [currentFilters, setCurrentFilters] = useState<Filters>({
    location: 'All Locations',
    score: 'all',
    yield: 'all'
  });
  const [investmentAmount, setInvestmentAmount] = useState<number>(10000);
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  // Apply filters when they change
  useEffect(() => {
    const result = filterProperties(properties, currentFilters);
    setFilteredProperties(result);
  }, [currentFilters]);

  // Handle property card click
  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setIsWatchlisted(isInWatchlist(property.id));
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle filter changes
  const handleFilterChange = (filters: Filters) => {
    setCurrentFilters(filters);
  };

  // Format price to currency format
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Calculate ownership percentage and token count
  const calculateOwnership = (property: Property | null, amount: number) => {
    if (!property) return { percentage: 0, tokens: 0 };
    
    const percentage = (amount / property.price) * 100;
    const tokens = Math.floor(amount / (property.price / 1000)); // Assuming 1 token = 1/1000 of property value
    
    return { percentage, tokens };
  };

  // Handle watchlist toggle in the modal
  const handleWatchlistToggle = () => {
    if (selectedProperty) {
      const newStatus = toggleWatchlist(selectedProperty.id);
      setIsWatchlisted(newStatus);
    }
  };

  // Calculate ownership details for selected property
  const ownershipDetails = calculateOwnership(selectedProperty, investmentAmount);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Explore Properties</h1>
      
      {/* Filter bar */}
      <FilterBar onFilterChange={handleFilterChange} />
      
      {filteredProperties.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No properties match your filters</h3>
          <p className="text-gray-500 mb-4">Try adjusting your filters to see more properties.</p>
          <Button 
            variant="primary" 
            onClick={() => setCurrentFilters({ location: 'All Locations', score: 'all', yield: 'all' })}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        /* Property grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onClick={() => handlePropertyClick(property)}
            />
          ))}
        </div>
      )}

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
              {/* Property image */}
              <div className="h-48 rounded-md overflow-hidden mb-4">
                <PropertyImage 
                  id={selectedProperty.id} 
                  name={selectedProperty.name} 
                  height={192}
                />
              </div>
              
              <div className="mb-4">
                <p className="text-gray-700">{selectedProperty.location}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-100 p-3 rounded-md">
                  <p className="text-sm text-gray-700">Size</p>
                  <p className="font-semibold">{selectedProperty.sqMeters} m²</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-md">
                  <p className="text-sm text-gray-700">Year Built</p>
                  <p className="font-semibold">{selectedProperty.yearBuilt}</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-md">
                  <p className="text-sm text-gray-700">Energy Label</p>
                  <p className="font-semibold">{selectedProperty.energyLabel}</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-md">
                  <p className="text-sm text-gray-700">Price</p>
                  <p className="font-semibold">{formatPrice(selectedProperty.price)}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-semibold mb-2">AI Score Breakdown</h3>
                <div className="bg-gray-100 p-3 rounded-md">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-700">Overall</span>
                    <span className="font-medium">{selectedProperty.score.toFixed(1)}/10</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-700">Yield</span>
                    <span className="font-medium">{selectedProperty.yield.toFixed(1)}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700">Appreciation</span>
                    <span className="font-medium">{selectedProperty.appreciation.toFixed(1)}/10</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-2">Property Description</h3>
                <p className="text-gray-700">{selectedProperty.description}</p>
              </div>
            </div>
            
            {/* Right panel */}
            <div>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Investment Simulation</h3>
                <div className="bg-gray-100 p-4 rounded-md">
                  <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-1">Investment Amount (€)</label>
                    <input 
                      type="number" 
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Enter amount"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Ownership</span>
                      <span className="font-semibold">{ownershipDetails.percentage.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Token Count</span>
                      <span className="font-semibold">{ownershipDetails.tokens} tokens</span>
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
                <Button 
                  variant="primary"
                  fullWidth
                >
                  Buy Now
                </Button>
                <Button 
                  variant={isWatchlisted ? "outline" : "secondary"}
                  fullWidth
                  onClick={handleWatchlistToggle}
                >
                  {isWatchlisted ? "Remove from Watchlist" : "Save to Watchlist"}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
} 