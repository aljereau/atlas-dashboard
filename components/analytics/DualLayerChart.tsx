'use client';

import { useState, useRef, useEffect } from 'react';
import { TokenValueDataPoint } from '@/data/types/analytics';
import ChartComponent from '@/components/ui/ChartComponent';

interface DualLayerChartProps {
  data: TokenValueDataPoint[];
  title?: string;
  showVolume?: boolean;
  height?: number;
  timeframe?: '1w' | '1m' | '3m' | 'all';
}

export default function DualLayerChart({ 
  data, 
  title = 'Property Value vs. Token Price', 
  showVolume = true,
  height = 300,
  timeframe = 'all'
}: DualLayerChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{
    date: string;
    fundamentalValue: number;
    marketValue: number;
    premium: number;
    visible: boolean;
    x: number;
    y: number;
  }>({
    date: '',
    fundamentalValue: 0,
    marketValue: 0,
    premium: 0,
    visible: false,
    x: 0,
    y: 0
  });

  // Add event listener to hide tooltip when mouse leaves chart area
  useEffect(() => {
    const chartContainer = chartContainerRef.current;
    
    const handleMouseLeave = () => {
      setTooltip(prev => ({ ...prev, visible: false }));
    };
    
    if (chartContainer) {
      chartContainer.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      if (chartContainer) {
        chartContainer.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  // Filter data based on timeframe
  const filteredData = (() => {
    if (timeframe === 'all') return data;
    
    const now = new Date();
    const cutoffDate = new Date();
    
    if (timeframe === '1w') cutoffDate.setDate(now.getDate() - 7);
    else if (timeframe === '1m') cutoffDate.setMonth(now.getMonth() - 1);
    else if (timeframe === '3m') cutoffDate.setMonth(now.getMonth() - 3);
    
    const cutoffStr = cutoffDate.toISOString().split('T')[0];
    return data.filter(d => d.date >= cutoffStr);
  })();

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Format percentage with sign
  const formatPercentage = (value: number) => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  // Get CSS color based on value
  const getValueColor = (value: number) => {
    return value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-gray-600';
  };

  // Prepare chart data
  const chartData = {
    labels: filteredData.map(d => d.date),
    datasets: [
      {
        label: 'Fundamental Value (€)',
        data: filteredData.map(d => d.fundamentalValue),
        borderColor: 'rgba(59, 130, 246, 1)', // Blue
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        yAxisID: 'value',
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(59, 130, 246, 1)',
      },
      {
        label: 'Token Market Price (€)',
        data: filteredData.map(d => d.marketValue),
        borderColor: 'rgba(16, 185, 129, 1)', // Green
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        yAxisID: 'value',
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(16, 185, 129, 1)',
      },
      ...(showVolume ? [{
        label: 'Trading Volume',
        data: filteredData.map(d => d.volume),
        type: 'bar',
        backgroundColor: 'rgba(156, 163, 175, 0.5)', // Gray
        yAxisID: 'volume',
        order: 3,
      }] : []),
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    animation: {
      duration: 1000, // Initial animation duration in ms
    },
    hover: {
      animationDuration: 0, // Disable animation on hover
    },
    responsiveAnimationDuration: 0, // Disable animation on resize
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 8,
          padding: 10, // Add padding between labels and axis
          font: {
            size: 10, // Smaller font size for x-axis labels
          },
          callback: (value: any, index: number) => {
            // Show fewer ticks for readability
            const date = new Date(filteredData[index]?.date);
            if (timeframe === '1w') {
              return date.toLocaleDateString(undefined, { weekday: 'short' });
            } else {
              return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            }
          },
        },
        afterFit: (axis: any) => {
          // Increase bottom margin to ensure dates are not cut off
          axis.paddingBottom = 15;
        },
      },
      value: {
        type: 'linear' as const,
        position: 'left' as const,
        grid: {
          color: 'rgba(209, 213, 219, 0.2)',
        },
        ticks: {
          callback: (value: any) => formatCurrency(value),
        },
        title: {
          display: true,
          text: 'Price (€)',
        },
      },
      ...(showVolume ? {
        volume: {
          type: 'linear' as const,
          position: 'right' as const,
          grid: {
            display: false,
          },
          ticks: {
            callback: (value: any) => {
              if (value >= 1000) return (value / 1000).toFixed(0) + 'k';
              return value;
            },
          },
          title: {
            display: true,
            text: 'Volume',
          },
        },
      } : {})
    },
    plugins: {
      tooltip: {
        enabled: false,
        external: (context: any) => {
          // Custom tooltip handler
          const { chart, tooltip } = context;

          if (tooltip.opacity === 0) {
            setTooltip(prev => ({ ...prev, visible: false }));
            return;
          }

          const dataIndex = tooltip.dataPoints[0].dataIndex;
          if (dataIndex >= 0 && dataIndex < filteredData.length) {
            const dataPoint = filteredData[dataIndex];
            setTooltip({
              date: dataPoint.date,
              fundamentalValue: dataPoint.fundamentalValue,
              marketValue: dataPoint.marketValue,
              premium: dataPoint.premium,
              visible: true,
              x: tooltip.caretX,
              y: tooltip.caretY
            });
          }
        },
      },
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow relative" style={{ height: `${height}px` }}>
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      
      <div className="relative h-full" ref={chartContainerRef}>
        <ChartComponent 
          type="line"
          data={chartData}
          options={chartOptions}
          height={height - 60} // Increased padding for x-axis labels
        />
        
        {/* Custom tooltip */}
        {tooltip.visible && (
          <div 
            className="absolute bg-white shadow-lg rounded-md border border-gray-200 p-3 z-50 w-64"
            style={{ 
              left: tooltip.x > window.innerWidth / 2 ? tooltip.x - 270 : tooltip.x + 10,
              top: tooltip.y - 80,
            }}
          >
            <div className="text-sm font-medium mb-2">
              {new Date(tooltip.date).toLocaleDateString(undefined, { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-600">Fundamental Value:</div>
              <div className="text-right font-medium text-blue-600">
                {formatCurrency(tooltip.fundamentalValue)}
              </div>
              <div className="text-gray-600">Market Value:</div>
              <div className="text-right font-medium text-green-600">
                {formatCurrency(tooltip.marketValue)}
              </div>
              <div className="text-gray-600">Premium/Discount:</div>
              <div className={`text-right font-medium ${getValueColor(tooltip.premium)}`}>
                {formatPercentage(tooltip.premium)}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Legend explaining the significance */}
      <div className="text-xs text-gray-500 mt-6">
        <p>The chart shows both the property's fundamental value and the token's market trading price. A gap indicates market premium or discount to the property's Net Asset Value (NAV).</p>
      </div>
    </div>
  );
} 