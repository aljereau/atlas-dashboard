'use client';

import ChartComponent from '@/components/ui/ChartComponent';

export default function PortfolioPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Portfolio</h1>
      
      {/* Performance summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-sm text-gray-500 mb-1">Total Value</h2>
          <p className="text-2xl font-bold">€52,450</p>
          <p className="text-sm text-green-600">+12.4% overall</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-sm text-gray-500 mb-1">Monthly Income</h2>
          <p className="text-2xl font-bold">€320</p>
          <p className="text-sm text-green-600">7.3% yield</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-sm text-gray-500 mb-1">Properties Owned</h2>
          <p className="text-2xl font-bold">4</p>
          <p className="text-sm text-gray-600">12 transactions</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-sm text-gray-500 mb-1">Next Payout</h2>
          <p className="text-2xl font-bold">€175</p>
          <p className="text-sm text-gray-600">In 12 days</p>
        </div>
      </div>
      
      {/* Performance chart */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Portfolio Performance</h2>
        <ChartComponent 
          type="line" 
          height={250}
        />
      </div>
      
      {/* Properties table - placeholder */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-lg font-semibold p-4 border-b">Your Properties</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tokens</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entry Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROI</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Income</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Placeholder rows */}
              {Array.from({ length: 4 }).map((_, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-300 rounded-md mr-3"></div>
                      <div>
                        <div className="font-medium text-gray-900">Property {index + 1}</div>
                        <div className="text-sm text-gray-500">Location {index + 1}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(index + 1) * 10}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">€{(index + 1) * 100}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">€{(index + 1) * 110}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+{(index + 1) * 2}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">€{(index + 1) * 20}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">View Details</button>
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