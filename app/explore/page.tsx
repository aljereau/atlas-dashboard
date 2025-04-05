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
import ScoreBreakdown from '@/components/ai/ScoreBreakdown';
import PropertyTags from '@/components/ai/PropertyTags';
import PropertyRecommendations from '@/components/ai/PropertyRecommendations';
import { Property, properties } from '@/data/mock/properties';
import { propertyValueHistories, marketCorrelations, liquidityMetrics } from '@/data/mock/analytics';
import { propertyScoreBreakdowns, propertyTags as aiPropertyTags, propertyRecommendations } from '@/data/mock/ai-features';
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
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'ai'>('overview');

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
    
    // Default to overview tab when opening a property
    setActiveTab('overview');
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
  
  // Get AI score breakdown for selected property
  const getScoreBreakdown = () => {
    if (!selectedProperty) return null;
    return propertyScoreBreakdowns.find(sb => sb.propertyId === selectedProperty.id) || null;
  };
  
  // Get AI tags for selected property
  const getPropertyTags = () => {
    if (!selectedProperty) return null;
    return aiPropertyTags.find(pt => pt.propertyId === selectedProperty.id) || null;
  };

  const propertyHistory = getPropertyValueHistory();
  const marketCorrelationData = getMarketCorrelations();
  const liquidityData = getLiquidityMetrics();
  const aiScoreData = getScoreBreakdown();
  const aiTagsData = getPropertyTags();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Explore Properties</h1>
      
      {/* Recommendations section */}
      <div className="mb-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md animate-slide-up">
        <PropertyRecommendations recommendations={propertyRecommendations} />
      </div>
      
      {/* Filter bar */}
      <FilterBar onFilterChange={handleFilterChange} />
      
      {filteredProperties.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No properties match your filters</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">Try adjusting your filters to see more properties.</p>
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
          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap -mb-px">
              <button
                className={`inline-flex items-center pb-2.5 pt-1 px-4 text-sm font-medium text-center border-b-2 ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Overview
              </button>
              <button
                className={`inline-flex items-center pb-2.5 pt-1 px-4 text-sm font-medium text-center border-b-2 ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('analytics')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Analytics
              </button>
              <button
                className={`inline-flex items-center pb-2.5 pt-1 px-4 text-sm font-medium text-center border-b-2 ${
                  activeTab === 'ai'
                    ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('ai')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI Analysis
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {/* Overview tab content */}
            {activeTab === 'overview' && (
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
                    <p className="text-gray-700 dark:text-gray-300">{selectedProperty.location}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                      <p className="text-sm text-gray-700 dark:text-gray-400">Size</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{selectedProperty.sqMeters} m²</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                      <p className="text-sm text-gray-700 dark:text-gray-400">Year Built</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{selectedProperty.yearBuilt}</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                      <p className="text-sm text-gray-700 dark:text-gray-400">Energy Label</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{selectedProperty.energyLabel}</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                      <p className="text-sm text-gray-700 dark:text-gray-400">Price</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{formatPrice(selectedProperty.price)}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-gray-700 dark:text-gray-400">Yield:</span>
                      <span className="ml-1 font-medium text-green-600 dark:text-green-400">{selectedProperty.yield}%</span>
                    </div>
                    <div>
                      <span className="text-gray-700 dark:text-gray-400">Appreciation:</span>
                      <span className="ml-1 font-medium text-blue-600 dark:text-blue-400">{selectedProperty.appreciation}%</span>
                    </div>
                  </div>
                  
                  {/* Property description */}
                  <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Description</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {selectedProperty.description}
                    </p>
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
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Investment Calculator</h3>
                  
                  <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md mb-6">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Investment Amount (€)
                      </label>
                      <input
                        type="number"
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white dark:bg-gray-800"
                        min="1000"
                        step="1000"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-400">Ownership</p>
                        <p className="text-xl font-semibold text-gray-900 dark:text-white">{ownershipDetails.percentage.toFixed(2)}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-400">Tokens</p>
                        <p className="text-xl font-semibold text-gray-900 dark:text-white">{ownershipDetails.tokens}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-400">Annual Income</p>
                        <p className="text-xl font-semibold text-green-600 dark:text-green-400">
                          {formatPrice((selectedProperty.price * selectedProperty.yield / 100) * (ownershipDetails.percentage / 100))}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-400">Expected App. (1yr)</p>
                        <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                          {formatPrice(investmentAmount * selectedProperty.appreciation / 100)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* AI Tags section */}
                  {aiTagsData && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Atlas AI Tags</h4>
                      <PropertyTags tags={aiTagsData} />
                    </div>
                  )}
                  
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
            )}
            
            {/* Analytics tab content */}
            {activeTab === 'analytics' && propertyHistory && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Analytics Dashboard</h3>
                
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
                            ? 'bg-blue-600 text-white dark:bg-blue-500'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                        onClick={() => setAnalysisTimeframe(option.value as any)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Dual layer chart: Property vs Token Value */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
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
            
            {/* AI Analysis tab content */}
            {activeTab === 'ai' && aiScoreData && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">AI-Powered Analysis</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Score breakdown */}
                  <ScoreBreakdown scoreData={aiScoreData} />
                  
                  {/* AI tags with explanations */}
                  {aiTagsData && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 h-fit">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Property Characteristics</h4>
                      <PropertyTags tags={aiTagsData} />
                      
                      {/* Historical score chart */}
                      <div className="mt-6">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Score History</h4>
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                          <ChartComponent
                            type="line"
                            height={200}
                            data={{
                              labels: aiScoreData.historicalScores.map(hs => {
                                const date = new Date(hs.date);
                                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                              }),
                              datasets: [
                                {
                                  label: 'Atlas AI Score',
                                  data: aiScoreData.historicalScores.map(hs => hs.score),
                                  borderColor: '#3b82f6',
                                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                  borderWidth: 2,
                                  pointRadius: 3,
                                  tension: 0.3,
                                  fill: true,
                                }
                              ]
                            }}
                            options={{
                              scales: {
                                y: {
                                  min: 0,
                                  max: 10,
                                  grid: {
                                    display: false
                                  }
                                },
                                x: {
                                  grid: {
                                    display: false
                                  }
                                }
                              },
                              plugins: {
                                legend: {
                                  display: false
                                }
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-300 flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium mb-1">About Atlas AI Analysis</p>
                    <p>The Atlas AI scoring system analyzes multiple factors to provide a comprehensive property assessment. Scores are calculated using a proprietary algorithm that evaluates risk, yield potential, growth forecasts, location quality, and property condition. This helps you make more informed investment decisions based on quantitative data points.</p>
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