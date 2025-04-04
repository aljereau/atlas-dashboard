'use client';

import { useState } from 'react';
import PortfolioSummary from '@/components/portfolio/PortfolioSummary';
import PortfolioDetails from '@/components/portfolio/PortfolioDetails';
import TransactionList from '@/components/portfolio/TransactionList';
import { portfolios, userPortfolioSummary, transactions, portfolioDistributionByLocation, portfolioDistributionByType } from '@/data/mock/portfolios';
import ChartComponent from '@/components/ui/ChartComponent';

export default function PortfolioPage() {
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'transactions' | 'analysis'>('portfolio');
  
  // Get the selected portfolio
  const selectedPortfolio = selectedPortfolioId
    ? portfolios.find(p => p.id === selectedPortfolioId)
    : null;
  
  // Handle portfolio selection
  const handlePortfolioSelect = (portfolioId: string) => {
    setSelectedPortfolioId(portfolioId);
    setActiveTab('portfolio');
  };
  
  // Handle back button
  const handleBack = () => {
    setSelectedPortfolioId(null);
  };
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  // Get distribution chart data
  const getDistributionChartData = (distribution: { category: string; value: number; percentage: number }[]) => {
    return {
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
    };
  };
  
  // Return transaction list filtered by portfolio if selected
  const getFilteredTransactions = () => {
    if (selectedPortfolioId) {
      return transactions.filter(t => t.portfolioId === selectedPortfolioId);
    }
    return transactions;
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {selectedPortfolio ? selectedPortfolio.name : 'Portfolio Management'}
      </h1>
      
      {/* Tab navigation when viewing portfolio details */}
      {selectedPortfolioId && (
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'portfolio'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('portfolio')}
          >
            Portfolio
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'transactions'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('transactions')}
          >
            Transactions
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'analysis'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
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
              <h2 className="text-xl font-semibold mb-6">Distribution by Location</h2>
              <div className="h-64">
                <ChartComponent 
                  type="doughnut"
                  data={getDistributionChartData(portfolioDistributionByLocation)}
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
              <h2 className="text-xl font-semibold mb-6">Distribution by Property Type</h2>
              <div className="h-64">
                <ChartComponent 
                  type="doughnut"
                  data={getDistributionChartData(portfolioDistributionByType)}
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
          
          <TransactionList transactions={transactions} />
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
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Portfolio Summary
          </button>
          <TransactionList transactions={getFilteredTransactions()} />
        </div>
      )}
      
      {/* Analysis View */}
      {selectedPortfolioId && activeTab === 'analysis' && (
        <div className="space-y-6">
          <button
            onClick={handleBack}
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Portfolio Summary
          </button>
          
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Risk Assessment</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Key Risk Indicators</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm text-gray-500">Risk Level</h4>
                        <div className="flex items-center mt-1">
                          <span className="bg-yellow-500 px-2 py-1 rounded text-white text-xs font-medium">Medium</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-500">Volatility</h4>
                        <p className="font-semibold">12.3%</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-500">Concentration Risk</h4>
                        <p className="font-semibold text-yellow-600">Medium</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-500">Geographic Risk</h4>
                        <p className="font-semibold text-green-600">Low</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-500">Liquidity Risk</h4>
                        <p className="font-semibold text-red-600">High</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-500">Income Stability</h4>
                        <p className="font-semibold text-green-600">High</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span>Consider diversifying into different property types to reduce concentration risk</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span>Monitor liquidity levels in your Real Estate portfolio as these assets typically have longer liquidation periods</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span>Your income stability is good, with a consistent yield across properties</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mt-6 mb-4">Scenario Analysis</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Base Case</h4>
                    <div className="p-3 bg-white rounded border border-gray-200">
                      <div className="mb-2">
                        <span className="text-xs text-gray-500">5-Year Return</span>
                        <p className="text-base font-medium text-green-600">+42.5%</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Expected Value</span>
                        <p className="text-base font-medium">{formatCurrency(selectedPortfolio.totalValue * 1.425)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Bear Case</h4>
                    <div className="p-3 bg-white rounded border border-gray-200">
                      <div className="mb-2">
                        <span className="text-xs text-gray-500">5-Year Return</span>
                        <p className="text-base font-medium text-red-600">-8.2%</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Expected Value</span>
                        <p className="text-base font-medium">{formatCurrency(selectedPortfolio.totalValue * 0.918)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Bull Case</h4>
                    <div className="p-3 bg-white rounded border border-gray-200">
                      <div className="mb-2">
                        <span className="text-xs text-gray-500">5-Year Return</span>
                        <p className="text-base font-medium text-green-600">+78.3%</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Expected Value</span>
                        <p className="text-base font-medium">{formatCurrency(selectedPortfolio.totalValue * 1.783)}</p>
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