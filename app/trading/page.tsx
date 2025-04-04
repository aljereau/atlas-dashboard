'use client';

import { useState } from 'react';
import ChartComponent from '@/components/ui/ChartComponent';
import Button from '@/components/ui/Button';
import { properties } from '@/data/mock/properties';

export default function TradingPage() {
  // For MVP, just show a placeholder page
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Trading Platform</h1>
      
      {/* Empty state for MVP */}
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Trading feature coming soon</h3>
        <p className="text-gray-700 mb-6">The trading platform is under development and will be available in the next update.</p>
        <Button variant="primary">Explore Available Properties</Button>
      </div>
      
      {/* Placeholder for future trading features */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Market Trends</h2>
          <p className="text-gray-700 mb-6">Monitor real estate token market trends.</p>
          <ChartComponent type="line" />
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Trading Activity</h2>
          <p className="text-gray-700 mb-6">View your recent trading activity.</p>
          <ChartComponent type="bar" />
        </div>
      </div>
    </div>
  );
} 