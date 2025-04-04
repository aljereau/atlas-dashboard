'use client';

import { useState, useEffect, memo, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { portfolios, userPortfolioSummary, transactions, portfolioDistributionByLocation, portfolioDistributionByType } from '@/data/mock/portfolios';

// Regular import for the lightweight component
import TransactionList from '@/components/portfolio/TransactionList';

// Lazy load heavier components
const PortfolioSummary = dynamic(() => import('@/components/portfolio/PortfolioSummary'), {
  loading: () => (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    </div>
  ),
  ssr: false
});

const PortfolioDetails = dynamic(() => import('@/components/portfolio/PortfolioDetails'), {
  loading: () => (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-48 bg-gray-200 rounded"></div>
        <div className="h-48 bg-gray-200 rounded"></div>
      </div>
    </div>
  ),
  ssr: false
});

const ChartComponent = dynamic(() => import('@/components/ui/ChartComponent'), {
  loading: () => <div className="h-64 flex items-center justify-center bg-gray-100 rounded">Loading chart...</div>,
  ssr: false
});

// Memoized chart data function to prevent unnecessary recalculations
const useDistributionChartData = (distribution: { category: string; value: number; percentage: number }[]) => {
  return useMemo(() => ({
    labels: distribution.map(item => item.category),
    datasets: [
      {
        data: distribution.map(item => item.percentage),
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  }), [distribution]);
};

// Format currency helper
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
};

// Main component
export default function PortfolioPage() {
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'transactions' | 'analysis'>('portfolio');
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Memoize selected portfolio to prevent unnecessary re-renders
  const selectedPortfolio = useMemo(() => {
    if (!selectedPortfolioId) return null;
    return portfolios.find(p => p.id === selectedPortfolioId) || null;
  }, [selectedPortfolioId]);
  
  // Memoize filtered transactions
  const filteredTransactions = useMemo(() => {
    if (!selectedPortfolioId) return transactions;
    return transactions.filter(t => t.portfolioId === selectedPortfolioId);
  }, [selectedPortfolioId]);
  
  // Chart data
  const locationChartData = useDistributionChartData(portfolioDistributionByLocation);
  const typeChartData = useDistributionChartData(portfolioDistributionByType);
  
  // Handle portfolio selection
  const handlePortfolioSelect = (portfolioId: string) => {
    setSelectedPortfolioId(portfolioId);
    setActiveTab('portfolio');
  };
  
  // Handle back button
  const handleBack = () => {
    setSelectedPortfolioId(null);
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-900">
        {selectedPortfolio ? selectedPortfolio.name : 'Portfolio Management'}
      </h1>
      
      {/* Tab navigation when viewing portfolio details */}
      {selectedPortfolioId && (
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'portfolio'
                ? 'border-b-2 border-blue-500 text-blue-700 font-semibold'
                : 'text-gray-700 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('portfolio')}
          >
            Portfolio
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'transactions'
                ? 'border-b-2 border-blue-500 text-blue-700 font-semibold'
                : 'text-gray-700 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('transactions')}
          >
            Transactions
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'analysis'
                ? 'border-b-2 border-blue-500 text-blue-700 font-semibold'
                : 'text-gray-700 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('analysis')}
          >
            Analysis
          </button>
        </div>
      )}
      
      {/* Portfolio Summary View */}
      {!selectedPortfolioId && (
        <>
          <PortfolioSummary 
            summary={userPortfolioSummary} 
            onPortfolioSelect={handlePortfolioSelect} 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-900">Distribution by Location</h2>
              <div className="h-64">
                <ChartComponent 
                  type="doughnut"
                  data={locationChartData}
                  options={{
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-900">Distribution by Property Type</h2>
              <div className="h-64">
                <ChartComponent 
                  type="doughnut"
                  data={typeChartData}
                  options={{
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>
          </div>
          
          <TransactionList transactions={transactions.slice(0, 10)} showViewAll /> {/* Only show first 10 transactions for performance */}
        </>
      )}
      
      {/* Portfolio Details View */}
      {selectedPortfolioId && selectedPortfolio && activeTab === 'portfolio' && (
        <PortfolioDetails 
          portfolio={selectedPortfolio} 
          onBack={handleBack} 
        />
      )}
      
      {/* Transactions View */}
      {selectedPortfolioId && activeTab === 'transactions' && (
        <div className="space-y-6">
          <button
            onClick={handleBack}
            className="inline-flex items-center text-blue-700 hover:text-blue-900 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Portfolio Summary
          </button>
          <TransactionList transactions={filteredTransactions} />
        </div>
      )}
      
      {/* Analysis View */}
      {selectedPortfolioId && activeTab === 'analysis' && (
        <div className="space-y-6">
          <button
            onClick={handleBack}
            className="inline-flex items-center text-blue-700 hover:text-blue-900 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Portfolio Summary
          </button>
          
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Risk Assessment</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Key Risk Indicators</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm text-gray-700">Risk Level</h4>
                        <div className="flex items-center mt-1">
                          <span className="bg-yellow-500 px-2 py-1 rounded text-white text-xs font-medium">Medium</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-700">Volatility</h4>
                        <p className="font-semibold text-gray-900">12.3%</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-700">Concentration Risk</h4>
                        <p className="font-semibold text-yellow-600">Medium</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-700">Geographic Risk</h4>
                        <p className="font-semibold text-green-600">Low</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-700">Liquidity Risk</h4>
                        <p className="font-semibold text-red-600">High</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-700">Income Stability</h4>
                        <p className="font-semibold text-green-600">High</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Recommendations</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-800">Consider diversifying into different property types to reduce concentration risk</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-800">Increase allocation to more liquid assets to improve overall portfolio liquidity</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-800">Maintain current exposure to high-income properties to preserve strong income stream</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Scenarios</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                      </svg>
                      <h4 className="text-lg font-semibold text-green-700">Optimistic Scenario</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-xs text-gray-700">Probability</span>
                        <p className="text-base font-medium text-gray-900">25%</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-700">Expected Value</span>
                        <p className="text-base font-medium text-gray-900">{formatCurrency(selectedPortfolio?.totalValue ? selectedPortfolio.totalValue * 1.425 : 0)}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-700">Annual Yield</span>
                        <p className="text-base font-medium text-gray-900">{selectedPortfolio?.averageYield ? (selectedPortfolio.averageYield * 1.2).toFixed(1) : 0}%</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-700">Market Condition</span>
                        <p className="text-base font-medium text-gray-900">Strong Growth</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-red-50 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                      </svg>
                      <h4 className="text-lg font-semibold text-red-700">Pessimistic Scenario</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-xs text-gray-700">Probability</span>
                        <p className="text-base font-medium text-gray-900">15%</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-700">Expected Value</span>
                        <p className="text-base font-medium text-gray-900">{formatCurrency(selectedPortfolio?.totalValue ? selectedPortfolio.totalValue * 0.918 : 0)}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-700">Annual Yield</span>
                        <p className="text-base font-medium text-gray-900">{selectedPortfolio?.averageYield ? (selectedPortfolio.averageYield * 0.8).toFixed(1) : 0}%</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-700">Market Condition</span>
                        <p className="text-base font-medium text-gray-900">Recession</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 