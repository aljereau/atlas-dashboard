'use client';

import { useState, useEffect, useRef } from 'react';
import { TokenValueDataPoint } from '@/data/types/analytics';
import ChartComponent from '@/components/ui/ChartComponent';
import Chart from 'chart.js/auto';

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

  const chartRef = useRef<HTMLCanvasElement>(null);
  const [chart, setChart] = useState<Chart | null>(null);

  // Format date for chart display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (timeframe === '1w') {
      return date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' });
    } else if (timeframe === '1m') {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
  };

  // Filter data based on timeframe
  const filterDataByTimeframe = (data: TokenValueDataPoint[], timeframe: string) => {
    if (timeframe === 'all') return data;
    
    const now = new Date();
    let cutoffDate = new Date();
    
    if (timeframe === '1w') {
      cutoffDate.setDate(now.getDate() - 7);
    } else if (timeframe === '1m') {
      cutoffDate.setMonth(now.getMonth() - 1);
    } else if (timeframe === '3m') {
      cutoffDate.setMonth(now.getMonth() - 3);
    }
    
    return data.filter(d => new Date(d.date) >= cutoffDate);
  };

  // Filter data based on timeframe
  const filteredData = (() => {
    if (timeframe === 'all') return data;
    
    const now = new Date();
    let cutoffDate = new Date();
    
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
    labels: filteredData.map(d => formatDate(d.date)),
    datasets: [
      {
        type: 'line',
        label: 'Fundamental Value (€)',
        data: filteredData.map(d => d.fundamentalValue),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        fill: false,
        yAxisID: 'y',
        z: 10,
      },
      {
        type: 'line',
        label: 'Token Market Price (€)',
        data: filteredData.map(d => d.tokenPrice || d.marketValue),
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(16, 185, 129, 1)',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        fill: false,
        yAxisID: 'y',
        z: 20,
      },
      {
        type: 'bar',
        label: 'Trading Volume',
        data: filteredData.map(d => d.volume),
        backgroundColor: 'rgba(209, 213, 219, 0.5)',
        borderColor: 'rgba(209, 213, 219, 0.8)',
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.6,
        yAxisID: 'yVolume',
        order: 3,
      }
    ]
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    animation: {
      duration: 1000, // Only animate on initial load
      onComplete: function(this: any) {
        // Store the animation so it won't re-trigger on hover
        this.animationsComplete = true;
      },
      onProgress: function(this: any) {
        // Skip animation if it's already been completed once
        if (this.animationsComplete === true) {
          this.animations.forEach((animation: any) => {
            animation.active = false;
          });
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'start',
        labels: {
          boxWidth: 15,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#4b5563',
        titleFont: {
          size: 13,
          weight: 'bold',
        },
        bodyFont: {
          size: 12,
        },
        padding: 12,
        cornerRadius: 8,
        borderColor: 'rgba(229, 231, 235, 1)',
        borderWidth: 1,
        caretSize: 6,
        boxPadding: 3,
        mode: 'index',
        intersect: false,
        displayColors: true,
        // Fix for persistent tooltip
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.datasetIndex === 2) { // Volume
              label += context.parsed.y;
            } else {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 2,
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 8,
          padding: 10, // Increase padding to prevent date cutoff
          color: '#6b7280',
        },
        border: {
          display: false,
        }
      },
      y: {
        position: 'left',
        title: {
          display: true,
          text: 'Price (€)',
          color: '#6b7280',
          font: {
            size: 12,
            weight: 'normal',
          },
          padding: { top: 0, bottom: 10 },
        },
        ticks: {
          precision: 0,
          padding: 8,
          color: '#6b7280',
          callback: function(value: any) {
            return '€' + value;
          }
        },
        grid: {
          color: 'rgba(243, 244, 246, 1)',
        },
        border: {
          display: false,
        }
      },
      yVolume: {
        position: 'right',
        title: {
          display: true,
          text: 'Volume',
          color: '#6b7280',
          font: {
            size: 12,
            weight: 'normal',
          },
          padding: { top: 0, bottom: 10 },
        },
        ticks: {
          precision: 0,
          padding: 8,
          color: '#6b7280',
        },
        grid: {
          drawOnChartArea: false,
          color: 'rgba(243, 244, 246, 1)',
        },
        border: {
          display: false,
        }
      }
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 20,
        bottom: 15 // Increased bottom padding to prevent date cutoff
      }
    }
  };

  useEffect(() => {
    if (!chartRef.current) return;
    
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;
    
    // Filter data based on timeframe
    const filteredData = filterDataByTimeframe(data, timeframe);
    
    if (chart) {
      chart.destroy();
    }
    
    const newChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: filteredData.map(d => formatDate(d.date)),
        datasets: [
          {
            type: 'line',
            label: 'Fundamental Value (€)',
            data: filteredData.map(d => d.fundamentalValue),
            borderColor: 'rgba(59, 130, 246, 1)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(59, 130, 246, 1)',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2,
            fill: false,
            yAxisID: 'y',
            z: 10,
          },
          {
            type: 'line',
            label: 'Token Market Price (€)',
            data: filteredData.map(d => d.tokenPrice || d.marketValue),
            borderColor: 'rgba(16, 185, 129, 1)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(16, 185, 129, 1)',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2,
            fill: false,
            yAxisID: 'y',
            z: 20,
          },
          {
            type: 'bar',
            label: 'Trading Volume',
            data: filteredData.map(d => d.volume),
            backgroundColor: 'rgba(209, 213, 219, 0.5)',
            borderColor: 'rgba(209, 213, 219, 0.8)',
            borderWidth: 1,
            borderRadius: 4,
            barPercentage: 0.6,
            yAxisID: 'yVolume',
            order: 3,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        animation: {
          duration: 1000, // Only animate on initial load
          onComplete: function() {
            // Store the animation so it won't re-trigger on hover
            this.animationsComplete = true;
          },
          onProgress: function() {
            // Skip animation if it's already been completed once
            if (this.animationsComplete === true) {
              this.animations.forEach(animation => {
                animation.active = false;
              });
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            align: 'start',
            labels: {
              boxWidth: 15,
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 20,
            },
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#1f2937',
            bodyColor: '#4b5563',
            titleFont: {
              size: 13,
              weight: 'bold',
            },
            bodyFont: {
              size: 12,
            },
            padding: 12,
            cornerRadius: 8,
            borderColor: 'rgba(229, 231, 235, 1)',
            borderWidth: 1,
            caretSize: 6,
            boxPadding: 3,
            mode: 'index',
            intersect: false,
            displayColors: true,
            // Fix for persistent tooltip
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.datasetIndex === 2) { // Volume
                  label += context.parsed.y;
                } else {
                  label += new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'EUR',
                    minimumFractionDigits: 2,
                  }).format(context.parsed.y);
                }
                return label;
              }
            }
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 8,
              padding: 10, // Increase padding to prevent date cutoff
              color: '#6b7280',
            },
            border: {
              display: false,
            }
          },
          y: {
            position: 'left',
            title: {
              display: true,
              text: 'Price (€)',
              color: '#6b7280',
              font: {
                size: 12,
                weight: 'normal',
              },
              padding: { top: 0, bottom: 10 },
            },
            ticks: {
              precision: 0,
              padding: 8,
              color: '#6b7280',
              callback: function(value) {
                return '€' + value;
              }
            },
            grid: {
              color: 'rgba(243, 244, 246, 1)',
            },
            border: {
              display: false,
            }
          },
          yVolume: {
            position: 'right',
            title: {
              display: true,
              text: 'Volume',
              color: '#6b7280',
              font: {
                size: 12,
                weight: 'normal',
              },
              padding: { top: 0, bottom: 10 },
            },
            ticks: {
              precision: 0,
              padding: 8,
              color: '#6b7280',
            },
            grid: {
              drawOnChartArea: false,
              color: 'rgba(243, 244, 246, 1)',
            },
            border: {
              display: false,
            }
          }
        },
        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 20,
            bottom: 15 // Increased bottom padding to prevent date cutoff
          }
        }
      },
    });
    
    setChart(newChart);
    
    return () => {
      if (newChart) {
        newChart.destroy();
      }
    };
  }, [data, timeframe]);

  return (
    <div className="bg-white p-4 rounded-lg shadow relative" style={{ height: `${height}px` }}>
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      
      <div className="relative h-full">
        <ChartComponent 
          type="bar"
          data={chartData}
          options={chartOptions}
          height={height}
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
      <div className="mt-3 text-xs text-gray-500">
        <p>The chart shows both the property's fundamental value and the token's market trading price. A gap indicates market premium or discount to the property's Net Asset Value (NAV).</p>
      </div>
    </div>
  );
} 