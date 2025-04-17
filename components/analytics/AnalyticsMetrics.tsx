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
  
  // Prepare correlation data
  const correlationData = {
    labels: correlations.map(c => c.market),
    datasets: [
      {
        label: 'Correlation Coefficient',
        data: correlations.map(c => {
          const value = timeframe === 'week' ? c.weekCorrelation : 
                       timeframe === 'month' ? c.monthCorrelation :
                       timeframe === 'quarter' ? c.quarterCorrelation : c.yearCorrelation;
          return parseFloat((value * 100).toFixed(1));
        }),
        backgroundColor: correlations.map(c => {
          const value = timeframe === 'week' ? c.weekCorrelation : 
                       timeframe === 'month' ? c.monthCorrelation :
                       timeframe === 'quarter' ? c.quarterCorrelation : c.yearCorrelation;
          
          if (value >= 0.6) return 'rgba(16, 185, 129, 0.7)'; // Strong positive - Green
          if (value >= 0.3) return 'rgba(59, 130, 246, 0.7)'; // Moderate positive - Blue
          if (value >= -0.3) return 'rgba(249, 115, 22, 0.7)'; // Weak correlation - Orange
          if (value >= -0.6) return 'rgba(239, 68, 68, 0.7)'; // Moderate negative - Red
          return 'rgba(139, 0, 0, 0.7)'; // Strong negative - Dark red
        }),
        borderWidth: 0,
        borderRadius: 4,
      }
    ]
  };
  
  // Correlation chart options
  const correlationOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        min: -100,
        max: 100,
        grid: {
          color: 'rgba(209, 213, 219, 0.2)',
        },
        ticks: {
          callback: (value: number) => `${value}%`,
        },
        title: {
          display: true,
          text: 'Correlation Strength',
        }
      },
      y: {
        grid: {
          display: false,
        },
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw / 100;
            let strength = '';
            
            if (Math.abs(value) < 0.3) strength = 'Weak';
            else if (Math.abs(value) < 0.6) strength = 'Moderate';
            else strength = 'Strong';
            
            const direction = value >= 0 ? 'positive' : 'negative';
            return `${strength} ${direction} correlation: ${(value).toFixed(2)}`;
          }
        }
      }
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Value Metrics</h2>
        <p className="text-sm text-gray-500 mt-1">
          Detailed metrics showing the relationship between property value and token price
        </p>
      </div>
      
      <div className="p-6">
        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Volatility (Annual)</p>
            <p className="text-xl font-semibold">{propertyData.metrics.volatility.toFixed(2)}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Price-to-NAV</p>
            <p className="text-xl font-semibold">
              {formatPercentage(propertyData.metrics.priceToNav)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Value Correlation</p>
            <p className="text-xl font-semibold">{propertyData.metrics.valueCorrelation.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Sharpe Ratio</p>
            <p className="text-xl font-semibold">{propertyData.metrics.sharpeRatio.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Property Appreciation</p>
            <p className="text-xl font-semibold text-green-600">
              {formatPercentage(propertyData.metrics.propertyAppreciation)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Token Appreciation</p>
            <p className="text-xl font-semibold text-green-600">
              {formatPercentage(propertyData.metrics.tokenAppreciation)}
            </p>
          </div>
        </div>
        
        {/* Market insight panel */}
        <div>
          <h3 className="text-md font-medium mt-6 mb-4">Market Insight</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm mb-4 leading-relaxed">
              {propertyData.metrics.averagePremium > 5 
                ? `This property token is trading at a significant premium to its underlying value, indicating strong market demand or potential speculation.`
                : propertyData.metrics.averagePremium < -5
                ? `This property token is trading at a discount to its underlying value, suggesting potential undervaluation or market concerns.`
                : `This property token is trading close to its underlying value, indicating a balanced market.`
              }
            </p>
            
            <p className="text-sm leading-relaxed">
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
        <div className="mt-6">
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
          
          <p className="text-xs text-gray-500 mt-2">
            Correlation measures how this token's price moves in relation to other markets.
            Values close to 100% indicate strong positive correlation, while negative values
            show inverse relationships.
          </p>
        </div>
      </div>
    </div>
  );
} 