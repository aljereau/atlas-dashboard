'use client';

import { useState, useEffect } from 'react';
import { properties } from '@/data/mock/properties';
import { transactions } from '@/data/mock/portfolios';
import { Property } from '@/data/mock/properties';
import { portfolios } from '@/data/mock/portfolios';
import PropertyImage from '@/components/ui/PropertyImage';
import Button from '@/components/ui/Button';
import ChartComponent from '@/components/ui/ChartComponent';
import Modal from '@/components/ui/Modal';

export default function TradingPage() {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'score'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [buyAmount, setBuyAmount] = useState<number>(5000);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  // Filter and sort properties
  const filteredProperties = properties
    .filter(property => 
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'price') {
        comparison = a.price - b.price;
      } else if (sortBy === 'score') {
        comparison = a.score - b.score;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
  // Get CSS color class based on value (for gains/losses)
  const getValueColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };
  
  // Get score badge color
  const getScoreBadgeColor = (score: number) => {
    if (score >= 8.5) return 'bg-green-500';
    if (score >= 7) return 'bg-blue-500';
    if (score >= 5) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Calculate token info
  const calculateTokenInfo = (property: Property | null, amount: number) => {
    if (!property) return { count: 0, price: 0, ownership: 0 };
    
    const tokenPrice = property.price / 1000; // Assuming 1000 tokens per property
    const count = Math.floor(amount / tokenPrice);
    const ownership = (count / 1000) * 100;
    
    return { count, price: tokenPrice, ownership };
  };
  
  // Handle sort change
  const handleSortChange = (field: 'name' | 'price' | 'score') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };
  
  // Handle property selection
  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
  };
  
  // Handle order preview
  const handlePreviewOrder = () => {
    if (!selectedProperty) return;
    setIsPreviewOpen(true);
  };
  
  // Handle order submission
  const handleSubmitOrder = () => {
    setIsPreviewOpen(false);
    setIsSuccess(true);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setIsSuccess(false);
      setSelectedProperty(null);
      setBuyAmount(5000);
    }, 3000);
  };
  
  // Get recent transactions for the sell tab
  const getRecentTransactions = () => {
    return transactions
      .filter(t => t.type === 'buy')
      .slice(0, 5);
  };
  
  // Get mock price history for the property chart
  const getPropertyPriceHistory = () => {
    if (!selectedProperty) return null;
    
    const basePrice = selectedProperty.price * 0.7; // Starting from 70% of current price
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const prices = [];
    
    // Generate increasingly higher prices 
    for (let i = 0; i < 12; i++) {
      const progress = i / 11;
      const price = basePrice + (selectedProperty.price - basePrice) * progress;
      // Add some randomness
      const randomFactor = 0.95 + Math.random() * 0.1; // Between 0.95 and 1.05
      prices.push(price * randomFactor);
    }
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Token Price (€)',
          data: prices.map(p => p / 1000), // Token price
          borderColor: 'rgba(59, 130, 246, 1)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        }
      ]
    };
  };
  
  // Get token distribution chart data
  const getTokenDistributionData = () => {
    return {
      labels: ['Tokens Owned', 'Available Tokens'],
      datasets: [
        {
          data: [120, 880],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(209, 213, 219, 0.5)',
          ],
          borderWidth: 0,
        },
      ],
    };
  };
  
  // Token info based on current selection
  const tokenInfo = calculateTokenInfo(selectedProperty, buyAmount);
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Property Trading</h1>
      
      {/* Trading tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'buy'
              ? 'border-b-2 border-blue-500 text-blue-700 font-semibold'
              : 'text-gray-700 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('buy')}
        >
          Buy
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'sell'
              ? 'border-b-2 border-blue-500 text-blue-700 font-semibold'
              : 'text-gray-700 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('sell')}
        >
          Sell
        </button>
      </div>
      
      {/* Buy tab */}
      {activeTab === 'buy' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel - Property list */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      placeholder="Search properties..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <select
                      className="pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value as any)}
                    >
                      <option value="score">Score</option>
                      <option value="price">Price</option>
                      <option value="name">Name</option>
                    </select>
                    <button
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    >
                      {sortOrder === 'asc' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Property</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Score</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Price (Total)</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Token Price</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProperties.map((property) => (
                      <tr 
                        key={property.id} 
                        className={`hover:bg-gray-50 cursor-pointer ${selectedProperty?.id === property.id ? 'bg-blue-50' : ''}`}
                        onClick={() => handlePropertySelect(property)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded overflow-hidden mr-4">
                              <PropertyImage 
                                id={property.id} 
                                name={property.name} 
                                height={40}
                              />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{property.name}</div>
                              <div className="text-sm text-gray-700">{property.location}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full text-white ${getScoreBadgeColor(property.score)}`}>
                            {property.score.toFixed(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(property.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(property.price / 1000)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            className="text-blue-700 hover:text-blue-900 font-semibold"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePropertySelect(property);
                            }}
                          >
                            Select
                          </button>
                        </td>
                      </tr>
                    ))}
                    
                    {filteredProperties.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-700">
                          No properties found matching your search
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Right panel - Order panel */}
          <div>
            <div className="bg-white rounded-lg shadow p-6 h-full">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Buy Order</h2>
              
              {selectedProperty ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Property</h3>
                    <div className="flex items-center">
                      <div className="h-12 w-12 flex-shrink-0 rounded overflow-hidden mr-3">
                        <PropertyImage 
                          id={selectedProperty.id} 
                          name={selectedProperty.name} 
                          height={48}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{selectedProperty.name}</p>
                        <p className="text-sm text-gray-700">{selectedProperty.location}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount to Invest (€)
                    </label>
                    <input
                      type="number"
                      min="100"
                      step="100"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      value={buyAmount}
                      onChange={(e) => setBuyAmount(Number(e.target.value))}
                    />
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-800 mb-3">Order Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-700">Token Price</span>
                        <span className="text-sm font-medium text-gray-900">{formatCurrency(tokenInfo.price)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-700">Tokens to Buy</span>
                        <span className="text-sm font-medium text-gray-900">{tokenInfo.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-700">Ownership</span>
                        <span className="text-sm font-medium text-gray-900">{tokenInfo.ownership.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-700">Transaction Fee</span>
                        <span className="text-sm font-medium text-gray-900">{formatCurrency(buyAmount * 0.015)}</span>
                      </div>
                      <div className="pt-2 border-t border-gray-200 flex justify-between">
                        <span className="text-sm font-semibold text-gray-900">Total</span>
                        <span className="text-sm font-semibold text-gray-900">{formatCurrency(buyAmount + (buyAmount * 0.015))}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Select Portfolio</h3>
                    <select
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      value={selectedPortfolioId}
                      onChange={(e) => setSelectedPortfolioId(e.target.value)}
                    >
                      <option value="" disabled>Select a portfolio</option>
                      {portfolios.map(portfolio => (
                        <option key={portfolio.id} value={portfolio.id}>
                          {portfolio.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <Button 
                    variant="primary" 
                    fullWidth
                    onClick={handlePreviewOrder}
                    disabled={!selectedPortfolioId || buyAmount < 100}
                  >
                    Preview Order
                  </Button>
                  
                  <div className="h-40 border-t pt-4">
                    <p className="text-xs text-gray-700 mb-2">12-Month Price History</p>
                    {getPropertyPriceHistory() && (
                      <ChartComponent
                        type="line"
                        data={getPropertyPriceHistory()!}
                        height={120}
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No Property Selected</h3>
                  <p className="text-gray-700">Select a property from the list to create a buy order.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Sell tab */}
      {activeTab === 'sell' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel - Properties owned */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Your Properties</h3>
                <p className="text-sm text-gray-500">Select a property to sell tokens</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tokens Owned</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gain/Loss</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {portfolios.flatMap(portfolio => portfolio.holdings).map((holding, index) => (
                      <tr 
                        key={holding.id} 
                        className={`hover:bg-gray-50 cursor-pointer ${selectedProperty?.id === holding.propertyId ? 'bg-blue-50' : ''}`}
                        onClick={() => {
                          const property = properties.find(p => p.id === holding.propertyId);
                          if (property) handlePropertySelect(property);
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded overflow-hidden mr-4">
                              <PropertyImage 
                                id={holding.propertyId} 
                                name={holding.propertyName} 
                                height={40}
                              />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{holding.propertyName}</div>
                              <div className="text-sm text-gray-500">{holding.location}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {holding.tokens}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(holding.currentValue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={getValueColor(holding.unrealizedGain)}>
                            {holding.unrealizedGain > 0 ? '+' : ''}{holding.unrealizedGain.toFixed(2)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={(e) => {
                              e.stopPropagation();
                              const property = properties.find(p => p.id === holding.propertyId);
                              if (property) handlePropertySelect(property);
                            }}
                          >
                            Sell
                          </button>
                        </td>
                      </tr>
                    ))}
                    
                    {portfolios.flatMap(portfolio => portfolio.holdings).length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                          You don't own any property tokens yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Recent Transactions</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tokens</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getRecentTransactions().map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Buy
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.propertyName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.tokens}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(transaction.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(transaction.totalAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Right panel - Sell panel */}
          <div>
            <div className="bg-white rounded-lg shadow p-6 h-full">
              <h2 className="text-lg font-semibold mb-4">Sell Order</h2>
              
              {selectedProperty ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Selected Property</h3>
                    <div className="flex items-center">
                      <div className="h-12 w-12 flex-shrink-0 rounded overflow-hidden mr-3">
                        <PropertyImage 
                          id={selectedProperty.id} 
                          name={selectedProperty.name} 
                          height={48}
                        />
                      </div>
                      <div>
                        <p className="font-medium">{selectedProperty.name}</p>
                        <p className="text-sm text-gray-500">{selectedProperty.location}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-40">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Token Distribution</h3>
                    <ChartComponent
                      type="doughnut"
                      data={getTokenDistributionData()}
                      options={{
                        plugins: {
                          legend: {
                            position: 'bottom',
                          },
                        },
                        maintainAspectRatio: false,
                      }}
                      height={120}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tokens to Sell
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      defaultValue="10"
                    />
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Sell Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Current Token Price</span>
                        <span className="text-sm font-medium">{formatCurrency(selectedProperty.price / 1000)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Total Value</span>
                        <span className="text-sm font-medium">{formatCurrency((selectedProperty.price / 1000) * 10)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Transaction Fee (1%)</span>
                        <span className="text-sm font-medium">{formatCurrency((selectedProperty.price / 1000) * 10 * 0.01)}</span>
                      </div>
                      <div className="pt-2 border-t border-gray-200 flex justify-between">
                        <span className="text-sm font-medium">Net Proceeds</span>
                        <span className="text-sm font-medium">{formatCurrency((selectedProperty.price / 1000) * 10 * 0.99)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="primary" 
                    fullWidth
                    onClick={handlePreviewOrder}
                  >
                    Preview Sell Order
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No Property Selected</h3>
                  <p className="text-gray-500">Select a property from your portfolio to create a sell order.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Order preview modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Order Preview"
        size="md"
      >
        {selectedProperty && (
          <div className="p-6">
            <div className="flex items-center mb-6">
              <div className="h-14 w-14 flex-shrink-0 rounded overflow-hidden mr-4">
                <PropertyImage 
                  id={selectedProperty.id} 
                  name={selectedProperty.name} 
                  height={56}
                />
              </div>
              <div>
                <h3 className="font-medium text-lg">{selectedProperty.name}</h3>
                <p className="text-sm text-gray-500">{selectedProperty.location}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Order Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Order Type</span>
                  <span className="text-sm font-medium">Buy</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Token Price</span>
                  <span className="text-sm font-medium">{formatCurrency(tokenInfo.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Tokens to Buy</span>
                  <span className="text-sm font-medium">{tokenInfo.count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Investment Amount</span>
                  <span className="text-sm font-medium">{formatCurrency(buyAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Transaction Fee (1.5%)</span>
                  <span className="text-sm font-medium">{formatCurrency(buyAmount * 0.015)}</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between">
                  <span className="text-sm font-medium">Total</span>
                  <span className="text-sm font-medium">{formatCurrency(buyAmount + (buyAmount * 0.015))}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Selected Portfolio</h3>
              <p className="text-sm">
                {portfolios.find(p => p.id === selectedPortfolioId)?.name || 'Default Portfolio'}
              </p>
            </div>
            
            <div className="text-sm text-gray-500 mb-6">
              By confirming this order, you agree to the terms and conditions of Atlas Dashboard trading platform.
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setIsPreviewOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleSubmitOrder}
              >
                Confirm Order
              </Button>
            </div>
          </div>
        )}
      </Modal>
      
      {/* Success modal */}
      <Modal
        isOpen={isSuccess}
        onClose={() => setIsSuccess(false)}
        title="Order Successful"
        size="sm"
      >
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Order Completed Successfully</h3>
          <p className="text-gray-500 mb-6">Your order has been processed and the tokens have been added to your portfolio.</p>
          <Button 
            variant="primary" 
            fullWidth
            onClick={() => setIsSuccess(false)}
          >
            Done
          </Button>
        </div>
      </Modal>
    </div>
  );
} 