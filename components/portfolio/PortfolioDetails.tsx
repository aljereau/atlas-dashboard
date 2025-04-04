'use client';

import { useState } from 'react';
import { Portfolio } from '@/data/types/portfolio';
import PropertyImage from '@/components/ui/PropertyImage';
import ChartComponent from '@/components/ui/ChartComponent';
import Button from '@/components/ui/Button';

interface PortfolioDetailsProps {
  portfolio: Portfolio;
  onBack: () => void;
}

export default function PortfolioDetails({ portfolio, onBack }: PortfolioDetailsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'holdings' | 'performance'>('overview');
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format percentage with "+" for positive values
  const formatPercentage = (value: number) => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  // Get CSS color class based on value (for gains/losses)
  const getValueColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };
  
  // For overview tab - monthly income data
  const getMonthlyIncomeData = () => {
    const monthlyIncome = portfolio.annualIncome / 12;
    
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Monthly Income',
          data: Array(12).fill(monthlyIncome),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  };
  
  // For performance tab - portfolio growth data
  const getPortfolioGrowthData = () => {
    // Generate 12 months of data with slight variations
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const startValue = portfolio.totalInvested;
    const endValue = portfolio.totalValue;
    const values = [];
    
    // Generate some random but increasing values between start and end
    for (let i = 0; i < 12; i++) {
      const progress = i / 11; // 0 to 1
      const baseValue = startValue + progress * (endValue - startValue);
      const randomFactor = 0.98 + Math.random() * 0.04; // Random between 0.98 and 1.02
      values.push(baseValue * randomFactor);
    }
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Portfolio Value',
          data: values,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };
  
  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={onBack}
              className="mr-3 text-gray-500 hover:text-gray-700"
              aria-label="Go back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <h1 className="text-xl font-bold">{portfolio.name}</h1>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit
            </Button>
            <Button variant="primary" size="sm">
              Add Property
            </Button>
          </div>
        </div>
      </div>
      
      {/* Portfolio summary */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Value</h3>
            <p className="text-2xl font-bold">{formatCurrency(portfolio.totalValue)}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Invested</h3>
            <p className="text-2xl font-bold">{formatCurrency(portfolio.totalInvested)}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Unrealized Gain</h3>
            <div className="flex items-baseline">
              <p className="text-lg font-bold mr-2">{formatCurrency(portfolio.totalUnrealizedGain)}</p>
              <p className={`text-sm font-medium ${getValueColor(portfolio.totalUnrealizedGainPercentage)}`}>
                {formatPercentage(portfolio.totalUnrealizedGainPercentage)}
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Annual Income</h3>
            <div className="flex items-baseline">
              <p className="text-lg font-bold mr-2">{formatCurrency(portfolio.annualIncome)}</p>
              <p className="text-sm font-medium text-blue-600">
                {portfolio.averageYield.toFixed(2)}% yield
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex px-6">
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`ml-8 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'holdings'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('holdings')}
          >
            Holdings
          </button>
          <button
            className={`ml-8 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'performance'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('performance')}
          >
            Performance
          </button>
        </div>
      </div>
      
      {/* Tab content */}
      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Monthly Income</h3>
              <div className="h-64">
                <ChartComponent 
                  type="bar"
                  data={getMonthlyIncomeData()}
                />
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Portfolio Metrics</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm text-gray-500">Average Property Value</h4>
                      <p className="font-semibold">{formatCurrency(portfolio.totalValue / portfolio.holdings.length)}</p>
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-500">Number of Properties</h4>
                      <p className="font-semibold">{portfolio.holdings.length}</p>
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-500">Best Performing</h4>
                      <p className="font-semibold">
                        {portfolio.holdings.reduce((best, current) => 
                          current.unrealizedGain > best.unrealizedGain ? current : best
                        ).propertyName}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-500">Average Ownership</h4>
                      <p className="font-semibold">
                        {(portfolio.holdings.reduce((sum, holding) => sum + holding.ownership, 0) / portfolio.holdings.length).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Recent Properties</h3>
              <div className="space-y-4">
                {portfolio.holdings.slice(0, 3).map(holding => (
                  <div key={holding.id} className="bg-gray-50 rounded-lg p-4 flex">
                    <div className="w-20 h-20 flex-shrink-0 rounded overflow-hidden mr-4">
                      <PropertyImage 
                        id={holding.propertyId} 
                        name={holding.propertyName} 
                        height={80}
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium">{holding.propertyName}</h4>
                      <p className="text-sm text-gray-500">{holding.location}</p>
                      <div className="mt-1 flex justify-between">
                        <span className="text-sm font-medium">{formatCurrency(holding.currentValue)}</span>
                        <span className={`text-sm ${getValueColor(holding.unrealizedGain)}`}>
                          {formatPercentage(holding.unrealizedGain)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {portfolio.holdings.length > 3 && (
                  <button 
                    className="w-full py-2 text-blue-600 text-sm font-medium hover:text-blue-800"
                    onClick={() => setActiveTab('holdings')}
                  >
                    View All Properties
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Holdings Tab */}
        {activeTab === 'holdings' && (
          <div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost Basis</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gain/Loss</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Income</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yield</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {portfolio.holdings.map(holding => (
                    <tr key={holding.id} className="hover:bg-gray-50">
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
                        {formatCurrency(holding.currentValue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(holding.purchaseDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(holding.purchasePrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className={getValueColor(holding.unrealizedGain)}>
                          {formatCurrency(holding.unrealizedGainValue)} ({formatPercentage(holding.unrealizedGain)})
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(holding.annualIncome)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                        {holding.yield.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Portfolio Growth</h3>
              <div className="h-64">
                <ChartComponent 
                  type="line"
                  data={getPortfolioGrowthData()}
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-y-4">
                  <div>
                    <h4 className="text-sm text-gray-500">Total Return</h4>
                    <p className={`font-semibold ${getValueColor(portfolio.totalUnrealizedGainPercentage)}`}>
                      {formatPercentage(portfolio.totalUnrealizedGainPercentage)}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500">Annualized Return</h4>
                    <p className="font-semibold text-green-600">+8.27%</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500">Time Weighted Return</h4>
                    <p className="font-semibold text-green-600">+7.45%</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500">Sharpe Ratio</h4>
                    <p className="font-semibold">1.23</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500">Max Drawdown</h4>
                    <p className="font-semibold text-red-600">-3.82%</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500">Best Month</h4>
                    <p className="font-semibold text-green-600">+4.12% (Mar)</p>
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mt-6 mb-4">Top Performers</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-3">
                  {portfolio.holdings
                    .sort((a, b) => b.unrealizedGain - a.unrealizedGain)
                    .slice(0, 3)
                    .map((holding, index) => (
                      <div key={holding.id} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="bg-gray-200 h-8 w-8 rounded-full flex items-center justify-center mr-3 text-gray-700 font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{holding.propertyName}</p>
                            <p className="text-xs text-gray-500">{formatCurrency(holding.currentValue)}</p>
                          </div>
                        </div>
                        <div className={`font-medium ${getValueColor(holding.unrealizedGain)}`}>
                          {formatPercentage(holding.unrealizedGain)}
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 