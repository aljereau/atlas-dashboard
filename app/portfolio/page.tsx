'use client';

import Button from '@/components/ui/Button';
import ChartComponent from '@/components/ui/ChartComponent';

export default function PortfolioPage() {
  // MVP state - empty portfolio
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Portfolio</h1>
      
      {/* Empty state */}
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Your portfolio is empty</h3>
        <p className="text-gray-700 mb-6">Start building your real estate portfolio by exploring available properties.</p>
        <Button variant="primary">Explore Properties</Button>
      </div>
      
      {/* Placeholder for future investment summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Portfolio Overview</h2>
          <p className="text-gray-700 mb-6">When you add properties to your portfolio, you'll see performance metrics here.</p>
          <ChartComponent type="pie" />
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Investment Growth</h2>
          <p className="text-gray-700 mb-6">Track your investment growth over time.</p>
          <ChartComponent type="line" />
        </div>
      </div>
    </div>
  );
} 