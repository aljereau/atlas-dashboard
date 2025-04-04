'use client';

import { useState } from 'react';
import { PropertyValueHistory, MarketCorrelation } from '@/data/types/analytics';
import ChartComponent from '@/components/ui/ChartComponent';

interface AnalyticsMetricsProps {
  propertyData: PropertyValueHistory;
  correlations: MarketCorrelation[];
}

export default function AnalyticsMetrics({ propertyData, correlations }: AnalyticsMetricsProps) {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  
  // Format percentage with sign
  const formatPercentage = (value: number) => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };
  
  // Get CSS color based on value
  const getValueColor = (value: number) => {
    return value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-gray-600';
  };
  
  // Get correlations for selected timeframe
  const selectedCorrelation = correlations.find(c => c.timeframe === timeframe) || correlations[0];
  
  // Correlation chart data
  const correlationData = {
    labels: ['Real Estate', 'Stock Market', 'Crypto Market', 'Commodities'],
    datasets: [
      {
        label: `${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Correlation`,
        data: [
          selectedCorrelation.realEstateIndex,
          selectedCorrelation.stockMarket, 
          selectedCorrelation.cryptoMarket,
          selectedCorrelation.commodities
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',  // Green
          'rgba(59, 130, 246, 0.8)', // Blue
          'rgba(249, 115, 22, 0.8)', // Orange
          'rgba(168, 85, 247, 0.8)',  // Purple
        ],
        borderWidth: 0,
      },
    ],
  };
  
  // Chart options
  const correlationOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          callback: (value: any) => value.toFixed(1),
        },
        title: {
          display: true,
          text: 'Correlation Coefficient',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `Correlation: ${context.formattedValue}`;
          }
        }
      }
    },
  };
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Advanced Analytics</h2>
        <p className="text-sm text-gray-500 mt-1">
          Detailed metrics showing the relationship between property value and token price
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* Key metrics panel */}
        <div>
          <h3 className="text-md font-medium mb-4">Value Metrics</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm text-gray-500">Volatility (Annual)</h4>
                <p className="font-semibold">{propertyData.metrics.volatility}%</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-500">Price-to-NAV</h4>
                <div className={`font-semibold ${getValueColor(propertyData.metrics.averagePremium)}`}>
                  {formatPercentage(propertyData.metrics.averagePremium)}
                </div>
              </div>
              <div>
                <h4 className="text-sm text-gray-500">Value Correlation</h4>
                <p className="font-semibold">{propertyData.metrics.correlation.toFixed(2)}</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-500">Sharpe Ratio</h4>
                <p className="font-semibold">{propertyData.metrics.sharpeRatio.toFixed(2)}</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-500">Property Appreciation</h4>
                <div className={`font-semibold ${getValueColor(propertyData.metrics.fundamentalAppreciation)}`}>
                  {formatPercentage(propertyData.metrics.fundamentalAppreciation)}
                </div>
              </div>
              <div>
                <h4 className="text-sm text-gray-500">Token Appreciation</h4>
                <div className={`font-semibold ${getValueColor(propertyData.metrics.marketAppreciation)}`}>
                  {formatPercentage(propertyData.metrics.marketAppreciation)}
                </div>
              </div>
            </div>
          </div>
          
          <h3 className="text-md font-medium mt-6 mb-4">Market Insight</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm mb-4">
              {propertyData.metrics.averagePremium > 5 
                ? `This property token is trading at a significant premium to its underlying value, indicating strong market demand or potential speculation.`
                : propertyData.metrics.averagePremium < -5
                ? `This property token is trading at a discount to its underlying value, suggesting potential undervaluation or market concerns.`
                : `This property token is trading close to its underlying value, indicating a balanced market.`
              }
            </p>
            
            <p className="text-sm">
              {propertyData.metrics.volatility > 15
                ? `With high volatility (${propertyData.metrics.volatility}%), this token experiences larger price swings than the underlying property market.`
                : propertyData.metrics.volatility < 8
                ? `With low volatility (${propertyData.metrics.volatility}%), this token price remains relatively stable compared to other real estate tokens.`
                : `The token shows moderate volatility (${propertyData.metrics.volatility}%), typical for tokenized real estate.`
              }
            </p>
          </div>
        </div>
        
        {/* Correlation panel */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-medium">Market Correlations</h3>
            <div className="flex space-x-1 text-xs">
              {(['week', 'month', 'quarter', 'year'] as const).map((tf) => (
                <button
                  key={tf}
                  className={`px-2 py-1 rounded ${
                    timeframe === tf
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setTimeframe(tf)}
                >
                  {tf === 'week' ? '1W' : tf === 'month' ? '1M' : tf === 'quarter' ? '3M' : '1Y'}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-64 mb-4">
            <ChartComponent
              type="bar"
              data={correlationData}
              options={correlationOptions}
              height={240}
            />
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-2">Correlation Insight</h4>
            <p className="text-sm">
              {selectedCorrelation.realEstateIndex > 0.7
                ? "This token strongly follows traditional real estate market trends."
                : selectedCorrelation.cryptoMarket > 0.6
                ? "This token shows significant correlation with crypto markets, suggesting it may be influenced by broader digital asset trends rather than just property fundamentals."
                : selectedCorrelation.stockMarket > 0.5
                ? "This token has moderate correlation with stock markets, suggesting some influence from broader economic trends."
                : "This token shows low correlation with traditional markets, potentially offering unique diversification benefits."
              }
            </p>
          </div>
        </div>
      </div>
      
      <div className="px-6 pb-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Understanding the Metrics</h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li><span className="font-semibold">Price-to-NAV:</span> Shows whether token is trading at premium/discount to property value</li>
            <li><span className="font-semibold">Volatility:</span> Measures price fluctuation intensity (annualized)</li>
            <li><span className="font-semibold">Value Correlation:</span> How closely token price follows property value (1.0 = perfect)</li>
            <li><span className="font-semibold">Sharpe Ratio:</span> Risk-adjusted return (higher is better)</li>
            <li><span className="font-semibold">Market Correlations:</span> How token price moves with different asset classes</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 