'use client';

import { useState, useEffect } from 'react';
import FilterBar, { Filters } from '@/components/ui/FilterBar';
import PropertyCard from '@/components/ui/PropertyCard';
import Modal from '@/components/ui/Modal';
import ChartComponent from '@/components/ui/ChartComponent';
import Button from '@/components/ui/Button';
import PropertyImage from '@/components/ui/PropertyImage';
import DualLayerChart from '@/components/analytics/DualLayerChart';
import AnalyticsMetrics from '@/components/analytics/AnalyticsMetrics';
import LiquidityPanel from '@/components/analytics/LiquidityPanel';
import { Property, properties } from '@/data/mock/properties';
import { propertyValueHistories, marketCorrelations, liquidityMetrics } from '@/data/mock/analytics';
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
  const [analysisTimeframe, setAnalysisTimeframe] = useState<'1w' | '1m' | '3m' | 'all'>('all');

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

  // Get property value history for selected property
  const getPropertyValueHistory = () => {
    if (!selectedProperty) return null;
    return propertyValueHistories.find(p => p.propertyId === selectedProperty.id);
  };

  // Get market correlations for selected property
  const getMarketCorrelations = () => {
    if (!selectedProperty) return [];
    return marketCorrelations[selectedProperty.id] || [];
  };

  // Get liquidity metrics for selected property
  const getLiquidityMetrics = () => {
    if (!selectedProperty) return null;
    return liquidityMetrics[selectedProperty.id];
  };

  const propertyHistory = getPropertyValueHistory();
  const marketCorrelationData = getMarketCorrelations();
  const liquidityData = getLiquidityMetrics();

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
          <div className="grid grid-cols-1 gap-6">
            {/* Top Panel: Basic Info */}
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
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-gray-500">Yield:</span>
                    <span className="ml-1 font-medium text-green-600">{selectedProperty.yield}%</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Appreciation:</span>
                    <span className="ml-1 font-medium text-blue-600">{selectedProperty.appreciation}%</span>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button 
                    variant={isWatchlisted ? "outline" : "primary"} 
                    onClick={handleWatchlistToggle}
                    fullWidth
                  >
                    {isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  </Button>
                </div>
              </div>
              
              {/* Right panel - Investment Calculator */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Investment Calculator</h3>
                
                <div className="p-4 bg-gray-100 rounded-md mb-6">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Investment Amount (€)
                    </label>
                    <input
                      type="number"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      min="1000"
                      step="1000"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Ownership</p>
                      <p className="text-xl font-semibold">{ownershipDetails.percentage.toFixed(2)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tokens</p>
                      <p className="text-xl font-semibold">{ownershipDetails.tokens}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Annual Income</p>
                      <p className="text-xl font-semibold text-green-600">
                        {formatPrice((selectedProperty.price * selectedProperty.yield / 100) * (ownershipDetails.percentage / 100))}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Expected App. (1yr)</p>
                      <p className="text-xl font-semibold text-blue-600">
                        {formatPrice(investmentAmount * selectedProperty.appreciation / 100)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <Button 
                    variant="primary"
                    onClick={() => window.location.href = `/trading?propertyId=${selectedProperty.id}`}
                  >
                    Invest Now
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Advanced Analytics Section */}
            {propertyHistory && (
              <div>
                <h3 className="text-xl font-semibold mb-3">Advanced Analytics</h3>
                
                {/* Timeframe selector */}
                <div className="mb-4 flex justify-end">
                  <div className="flex space-x-1 text-xs font-medium">
                    {[
                      { value: '1w', label: '1 Week' },
                      { value: '1m', label: '1 Month' },
                      { value: '3m', label: '3 Months' },
                      { value: 'all', label: 'All Time' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        className={`px-3 py-1 rounded-full ${
                          analysisTimeframe === option.value
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        onClick={() => setAnalysisTimeframe(option.value as any)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Dual layer chart: Property vs Token Value */}
                <div className="bg-white rounded-lg shadow mb-6">
                  <DualLayerChart 
                    data={propertyHistory.data} 
                    timeframe={analysisTimeframe}
                    title="Property Value vs Token Market Price"
                    height={350}
                  />
                </div>
                
                {/* Analytics metrics and correlations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <AnalyticsMetrics 
                      propertyData={propertyHistory} 
                      correlations={marketCorrelationData} 
                    />
                  </div>
                  <div>
                    {liquidityData && (
                      <LiquidityPanel 
                        liquidity={liquidityData} 
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
} 