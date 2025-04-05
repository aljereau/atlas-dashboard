'use client';

import { useState } from 'react';
import { UserPortfolioSummary } from '@/data/types/portfolio';
import ChartComponent from '@/components/ui/ChartComponent';

interface PortfolioSummaryProps {
  summary: UserPortfolioSummary;
  onPortfolioSelect: (portfolioId: string) => void;
}

export default function PortfolioSummary({ summary, onPortfolioSelect }: PortfolioSummaryProps) {
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

  // Prepare chart data for portfolio values
  const getPortfolioChartData = () => {
    return {
      labels: summary.portfolios.map(p => p.name),
      datasets: [
        {
          data: summary.portfolios.map(p => p.value),
          backgroundColor: [
            'rgba(54, 162, 235, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(153, 102, 255, 0.8)',
          ],
          borderWidth: 0,
        },
      ],
    };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Left panel - Portfolio metrics */}
      <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Portfolio Overview</h2>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Value</h3>
            <p className="text-2xl font-bold">{formatCurrency(summary.totalValue)}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Invested</h3>
            <p className="text-2xl font-bold">{formatCurrency(summary.totalInvested)}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Gain</h3>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold mr-2">{formatCurrency(summary.totalGain)}</p>
              <p className={`text-sm font-medium ${getValueColor(summary.totalGainPercentage)}`}>
                {formatPercentage(summary.totalGainPercentage)}
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Number of Portfolios</h3>
            <p className="text-2xl font-bold">{summary.totalPortfolios}</p>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold mb-4">Your Portfolios</h3>
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Portfolio</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Value</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Gain</th>
                <th className="py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {summary.portfolios.map((portfolio) => (
                <tr key={portfolio.id} className="cursor-pointer hover:bg-gray-50"
                    onClick={() => onPortfolioSelect(portfolio.id)}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{portfolio.name}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatCurrency(portfolio.value)}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className={getValueColor(portfolio.gainPercentage)}>
                      {formatCurrency(portfolio.gain)} ({formatPercentage(portfolio.gainPercentage)})
                    </span>
                  </td>
                  <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm">
                    <button
                      className="text-blue-600 hover:text-blue-900 font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPortfolioSelect(portfolio.id);
                      }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Right panel - Portfolio allocation */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Portfolio Allocation</h2>
        <div className="h-64">
          <ChartComponent 
            type="doughnut"
            data={getPortfolioChartData()}
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
  );
} 