'use client';

import { useState } from 'react';
import ChartComponent from '@/components/ui/ChartComponent';
import { properties } from '@/data/mock/properties';
import { propertyTags, propertyScoreBreakdowns } from '@/data/mock/ai-features';

// Mock engagement data - in a real app, this would come from a database
const mockEngagementData = {
  propertyViews: generateMockViewData(),
  watchlistAdditions: generateMockWatchlistData(),
  userSessions: generateMockSessionData(),
  topProperties: generateMockTopProperties(),
};

// Generate realistic mock data functions
function generateMockViewData() {
  const today = new Date();
  const data = [];
  
  // Create 14 days of data
  for (let i = 13; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // Base views with some randomness, trending upward
    const baseViews = 80 + (13 - i) * 12;
    const randomFactor = Math.random() * 40 - 20; // Random variance between -20 and +20
    
    // Weekend boost
    const dayOfWeek = date.getDay();
    const weekendBoost = (dayOfWeek === 0 || dayOfWeek === 6) ? 50 : 0;
    
    const views = Math.round(baseViews + randomFactor + weekendBoost);
    
    data.push({
      date: date.toISOString().split('T')[0],
      views: views
    });
  }
  
  return data;
}

function generateMockWatchlistData() {
  const today = new Date();
  const data = [];
  
  // Create 14 days of data
  for (let i = 13; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // Base additions with some randomness, trending upward but less than views
    const baseAdditions = 5 + (13 - i) * 0.8;
    const randomFactor = Math.random() * 7 - 3; // Random variance between -3 and +4
    
    // Weekend boost
    const dayOfWeek = date.getDay();
    const weekendBoost = (dayOfWeek === 0 || dayOfWeek === 6) ? 8 : 0;
    
    const additions = Math.round(Math.max(0, baseAdditions + randomFactor + weekendBoost));
    
    data.push({
      date: date.toISOString().split('T')[0],
      additions: additions
    });
  }
  
  return data;
}

function generateMockSessionData() {
  const today = new Date();
  const data = [];
  
  // Create 14 days of data
  for (let i = 13; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // Base sessions with some randomness, trending upward
    const baseSessions = 40 + (13 - i) * 5;
    const randomFactor = Math.random() * 20 - 10; // Random variance
    
    // Weekend boost
    const dayOfWeek = date.getDay();
    const weekendBoost = (dayOfWeek === 0 || dayOfWeek === 6) ? 25 : 0;
    
    const sessions = Math.round(baseSessions + randomFactor + weekendBoost);
    
    // Calculate average session duration (in minutes)
    const avgDuration = 3 + Math.random() * 4;
    
    data.push({
      date: date.toISOString().split('T')[0],
      sessions,
      avgDuration: parseFloat(avgDuration.toFixed(1))
    });
  }
  
  return data;
}

function generateMockTopProperties() {
  return properties
    .map(property => ({
      id: property.id,
      name: property.name,
      views: Math.floor(Math.random() * 500) + 100,
      watchlistAdds: Math.floor(Math.random() * 50) + 5,
      conversionRate: parseFloat((Math.random() * 8 + 2).toFixed(1))
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);
}

export default function AdminAnalytics() {
  // Timeframe state
  const [timeframe, setTimeframe] = useState<'7d' | '14d' | '30d' | '90d'>('14d');
  
  // Helper functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Calculate total properties by tags
  const calculateTagDistribution = () => {
    const tagCount: Record<string, number> = {};
    
    propertyTags.forEach(propertyTag => {
      propertyTag.tags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });
    
    // Sort by count
    return Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => ({ tag, count }));
  };
  
  // Calculate score distribution
  const calculateScoreDistribution = () => {
    const distribution = [0, 0, 0, 0, 0]; // <5, 5-6, 6-7, 7-8, 8+
    
    propertyScoreBreakdowns.forEach(property => {
      if (property.overallScore < 5) distribution[0]++;
      else if (property.overallScore < 6) distribution[1]++;
      else if (property.overallScore < 7) distribution[2]++;
      else if (property.overallScore < 8) distribution[3]++;
      else distribution[4]++;
    });
    
    return [
      { label: '< 5', count: distribution[0] },
      { label: '5-6', count: distribution[1] },
      { label: '6-7', count: distribution[2] },
      { label: '7-8', count: distribution[3] },
      { label: '8+', count: distribution[4] },
    ];
  };
  
  // Calculate metrics
  const totalViews = mockEngagementData.propertyViews.reduce((sum, day) => sum + day.views, 0);
  const totalWatchlistAdds = mockEngagementData.watchlistAdditions.reduce((sum, day) => sum + day.additions, 0);
  const totalSessions = mockEngagementData.userSessions.reduce((sum, day) => sum + day.sessions, 0);
  const avgSessionDuration = parseFloat((mockEngagementData.userSessions.reduce((sum, day) => sum + day.avgDuration, 0) / mockEngagementData.userSessions.length).toFixed(1));
  
  // Prepare chart data
  const viewsChartData = {
    labels: mockEngagementData.propertyViews.map(day => formatDate(day.date)),
    datasets: [
      {
        label: 'Property Views',
        data: mockEngagementData.propertyViews.map(day => day.views),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      },
    ],
  };
  
  const watchlistChartData = {
    labels: mockEngagementData.watchlistAdditions.map(day => formatDate(day.date)),
    datasets: [
      {
        label: 'Watchlist Additions',
        data: mockEngagementData.watchlistAdditions.map(day => day.additions),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      },
    ],
  };
  
  const sessionsChartData = {
    labels: mockEngagementData.userSessions.map(day => formatDate(day.date)),
    datasets: [
      {
        label: 'User Sessions',
        data: mockEngagementData.userSessions.map(day => day.sessions),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      },
    ],
  };
  
  // Tag distribution data
  const tagDistribution = calculateTagDistribution();
  const tagDistributionData = {
    labels: tagDistribution.map(item => item.tag.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')),
    datasets: [
      {
        label: 'Properties',
        data: tagDistribution.map(item => item.count),
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)', // blue
          'rgba(16, 185, 129, 0.7)', // green
          'rgba(139, 92, 246, 0.7)', // purple
          'rgba(236, 72, 153, 0.7)', // pink
          'rgba(245, 158, 11, 0.7)', // amber
          'rgba(14, 165, 233, 0.7)', // sky
          'rgba(249, 115, 22, 0.7)', // orange
          'rgba(6, 182, 212, 0.7)',  // cyan
          'rgba(168, 85, 247, 0.7)', // violet
          'rgba(239, 68, 68, 0.7)',  // red
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Score distribution data
  const scoreDistribution = calculateScoreDistribution();
  const scoreDistributionData = {
    labels: scoreDistribution.map(item => item.label),
    datasets: [
      {
        label: 'Properties',
        data: scoreDistribution.map(item => item.count),
        backgroundColor: [
          'rgba(239, 68, 68, 0.7)',   // red (< 5)
          'rgba(245, 158, 11, 0.7)',  // amber (5-6)
          'rgba(249, 115, 22, 0.7)',  // orange (6-7)
          'rgba(59, 130, 246, 0.7)',  // blue (7-8)
          'rgba(16, 185, 129, 0.7)',  // green (8+)
        ],
        borderWidth: 1,
      },
    ],
  };
  
  return (
    <div className="p-6">
      {/* Summary metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Property Views</h3>
          <div className="flex items-end">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalViews.toLocaleString()}</p>
            <p className="text-sm text-green-600 dark:text-green-400 ml-2">+12.8%</p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Compared to previous period</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Watchlist Additions</h3>
          <div className="flex items-end">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalWatchlistAdds.toLocaleString()}</p>
            <p className="text-sm text-green-600 dark:text-green-400 ml-2">+5.3%</p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Compared to previous period</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">User Sessions</h3>
          <div className="flex items-end">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalSessions.toLocaleString()}</p>
            <p className="text-sm text-green-600 dark:text-green-400 ml-2">+8.1%</p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Compared to previous period</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Avg. Session Duration</h3>
          <div className="flex items-end">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{avgSessionDuration} min</p>
            <p className="text-sm text-green-600 dark:text-green-400 ml-2">+1.2%</p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Compared to previous period</p>
        </div>
      </div>
      
      {/* Timeframe selector */}
      <div className="flex justify-end mb-4">
        <div className="inline-flex rounded-md shadow-sm">
          {['7d', '14d', '30d', '90d'].map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period as any)}
              className={`px-4 py-2 text-sm font-medium ${
                period === timeframe
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              } ${
                period === '7d'
                  ? 'rounded-l-md'
                  : period === '90d'
                  ? 'rounded-r-md'
                  : ''
              } border border-gray-300 dark:border-gray-600`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
      
      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Property views chart */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Property Views</h3>
          <div className="h-64">
            <ChartComponent
              type="line"
              data={viewsChartData}
              options={{
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      display: true,
                      color: 'rgba(0, 0, 0, 0.05)',
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    mode: 'index',
                    intersect: false,
                  },
                },
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
        
        {/* Watchlist chart */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Watchlist Additions</h3>
          <div className="h-64">
            <ChartComponent
              type="line"
              data={watchlistChartData}
              options={{
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      display: true,
                      color: 'rgba(0, 0, 0, 0.05)',
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    mode: 'index',
                    intersect: false,
                  },
                },
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Second row of charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* AI Tag distribution */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Property Tags Distribution</h3>
          <div className="h-64">
            <ChartComponent
              type="bar"
              data={tagDistributionData}
              options={{
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      display: true,
                      color: 'rgba(0, 0, 0, 0.05)',
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    mode: 'index',
                    intersect: false,
                  },
                },
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
        
        {/* Score distribution */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Atlas Score Distribution</h3>
          <div className="h-64">
            <ChartComponent
              type="pie"
              data={scoreDistributionData}
              options={{
                plugins: {
                  legend: {
                    position: 'right',
                    labels: {
                      boxWidth: 12,
                    },
                  },
                },
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Top Properties Table */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Top Performing Properties</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Property
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Views
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Watchlist Adds
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Conversion Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {mockEngagementData.topProperties.map((property) => (
                <tr key={property.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{property.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">ID: {property.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{property.views}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{property.watchlistAdds}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{property.conversionRate}%</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 