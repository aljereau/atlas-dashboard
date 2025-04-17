'use client';

import { useState } from 'react';
import { properties } from '@/data/mock/properties';
import { propertyValueHistories, marketCorrelations, liquidityMetrics } from '@/data/mock/analytics';
import DualLayerChart from '@/components/analytics/DualLayerChart';
import AnalyticsMetrics from '@/components/analytics/AnalyticsMetrics';
import LiquidityPanel from '@/components/analytics/LiquidityPanel';
import PropertyImage from '@/components/ui/PropertyImage';

export default function MarketAnalysisPage() {
  const [selectedPropertyId, setSelectedPropertyId] = useState(properties[0].id);
  const [timeframe, setTimeframe] = useState<'1w' | '1m' | '3m' | 'all'>('all');
  
  // Get selected property data
  const selectedProperty = properties.find(p => p.id === selectedPropertyId);
  
  // Get property value history for selected property
  const propertyHistory = propertyValueHistories.find(p => p.propertyId === selectedPropertyId);
  
  // Get market correlations for selected property
  const marketCorrelationData = marketCorrelations[selectedPropertyId] || [];
  
  // Get liquidity metrics for selected property
  const liquidityData = liquidityMetrics[selectedPropertyId];
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Market Analysis</h1>
      
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="mb-4 md:mb-0 max-w-3xl">
          <p className="text-gray-600 mb-1 text-sm md:text-base leading-snug">
            Compare property fundamental value with token market price for deeper insights
          </p>
          <h2 className="text-xl font-semibold">Advanced Analytics Dashboard</h2>
        </div>
        
        {/* Property selector */}
        <div className="flex-shrink-0">
          <label htmlFor="propertySelect" className="block text-sm font-medium text-gray-700 mb-1">
            Select Property
          </label>
          <select
            id="propertySelect"
            value={selectedPropertyId}
            onChange={(e) => setSelectedPropertyId(e.target.value)}
            className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {properties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Selected property card */}
      {selectedProperty && (
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <div className="h-24 w-24 rounded-md overflow-hidden">
                <PropertyImage 
                  id={selectedProperty.id} 
                  name={selectedProperty.name} 
                  height={96}
                />
              </div>
            </div>
            <div className="flex-grow">
              <h2 className="text-xl font-semibold">{selectedProperty.name}</h2>
              <p className="text-gray-600">{selectedProperty.location}</p>
              <div className="flex flex-wrap mt-2">
                <div className="mr-6 mb-2">
                  <span className="text-gray-500 text-sm">Property Value:</span>
                  <span className="ml-1 font-medium">{formatCurrency(selectedProperty.price)}</span>
                </div>
                <div className="mr-6 mb-2">
                  <span className="text-gray-500 text-sm">Token Price:</span>
                  <span className="ml-1 font-medium">{formatCurrency(selectedProperty.price / 1000)}</span>
                </div>
                <div className="mr-6 mb-2">
                  <span className="text-gray-500 text-sm">Annual Yield:</span>
                  <span className="ml-1 font-medium text-green-600">{selectedProperty.yield}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Timeframe selector */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
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
                timeframe === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setTimeframe(option.value as any)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Main analytics content */}
      {propertyHistory && (
        <div className="space-y-6">
          {/* Dual layer chart */}
          <div className="bg-white shadow rounded-lg">
            <DualLayerChart 
              data={propertyHistory.data} 
              timeframe={timeframe}
              height={400}
            />
          </div>
          
          {/* Analytics metrics and liquidity panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          
          {/* Premium/Discount to NAV explanation */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Understanding Price to NAV Ratio</h3>
            <p className="text-gray-600 text-sm md:text-base mb-4 leading-relaxed">
              The chart above tracks both the property's fundamental value and the token's market trading price.
              When there's a gap between these lines, it indicates that the token is trading at either a premium or
              discount to the property's Net Asset Value (NAV).
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Premium/Discount Calculation</h4>
                <p className="text-gray-700 text-sm leading-relaxed mb-3">
                  <span className="font-medium">Premium to NAV:</span> Occurs when token price is 
                  higher than the property's fundamental value per token. Calculated as:<br />
                  <span className="font-mono text-xs bg-blue-100 px-1 rounded">
                    ((Token Price / NAV per Token) - 1) × 100%
                  </span>
                </p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  <span className="font-medium">Discount to NAV:</span> Occurs when token price is 
                  lower than the property's fundamental value per token. Shown as a negative premium.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-blue-800 mb-2">What This Means For Investors</h4>
                <p className="text-gray-700 text-sm leading-relaxed mb-3">
                  <span className="font-medium">Premium to NAV:</span> Tokens trading above their 
                  fundamental value may indicate strong demand, market optimism about future growth, 
                  or scarcity of similar investment opportunities.
                </p>
                <p className="text-gray-700 text-sm leading-relaxed mb-3">
                  <span className="font-medium">Discount to NAV:</span> Tokens trading below their
                  fundamental value might represent buying opportunities, but could also signal 
                  market concerns about the property or its management.
                </p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Savvy investors monitor the premium/discount to identify potential arbitrage 
                  opportunities or market inefficiencies in token pricing.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 