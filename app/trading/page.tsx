'use client';

import { useState } from 'react';
import ChartComponent from '@/components/ui/ChartComponent';
import Button from '@/components/ui/Button';
import { properties } from '@/data/mock/properties';

export default function TradingPage() {
  const [selectedPropertyId, setSelectedPropertyId] = useState('prop1');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('1000');

  // Find selected property
  const selectedProperty = properties.find(p => p.id === selectedPropertyId);

  // Simulated token price (for MVP)
  const tokenPrice = selectedProperty ? (selectedProperty.price / 1000).toFixed(2) : '0';
  
  // Calculate tokens for the given amount
  const calculatedTokens = amount ? (parseFloat(amount) / parseFloat(tokenPrice)).toFixed(2) : '0';

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Trading</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left panel - Property selection and chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property selector */}
          <div className="bg-white p-4 rounded-lg shadow">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Property
            </label>
            <select
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
            >
              {properties.map(property => (
                <option key={property.id} value={property.id}>
                  {property.name} - {property.location}
                </option>
              ))}
            </select>
          </div>
          
          {/* Price chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Price Chart</h2>
              
              {/* Time period selector */}
              <div className="flex space-x-2">
                {['1D', '1W', '1M', '3M', '1Y', 'All'].map((period) => (
                  <button
                    key={period}
                    className="px-2 py-1 text-xs rounded-md bg-gray-100 hover:bg-gray-200"
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            
            <ChartComponent 
              type="line" 
              height={300}
            />
            
            {/* Price stats */}
            <div className="grid grid-cols-4 gap-4 mt-4 text-sm">
              <div>
                <p className="text-gray-500">Open</p>
                <p className="font-semibold">€{tokenPrice}</p>
              </div>
              <div>
                <p className="text-gray-500">High</p>
                <p className="font-semibold">€{(parseFloat(tokenPrice) * 1.05).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-500">Low</p>
                <p className="font-semibold">€{(parseFloat(tokenPrice) * 0.95).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-500">Volume</p>
                <p className="font-semibold">245 tokens</p>
              </div>
            </div>
          </div>
          
          {/* Market statistics */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Market Statistics</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Holders</p>
                <p className="font-semibold text-lg">126</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Avg. Holding Duration</p>
                <p className="font-semibold text-lg">189 days</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Liquidity Level</p>
                <p className="font-semibold text-lg">Medium</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">24h Change</p>
                <p className="font-semibold text-lg text-green-600">+2.3%</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right panel - Buy/Sell form */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            {selectedProperty ? selectedProperty.name : 'Property'} Tokens
          </h2>
          
          {/* Buy/Sell toggle */}
          <div className="flex mb-4">
            <button
              className={`flex-1 py-2 text-center ${tradeType === 'buy' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setTradeType('buy')}
            >
              Buy
            </button>
            <button
              className={`flex-1 py-2 text-center ${tradeType === 'sell' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setTradeType('sell')}
            >
              Sell
            </button>
          </div>
          
          {/* Token price */}
          <div className="mb-4">
            <p className="text-gray-500 text-sm mb-1">Token Price</p>
            <p className="text-lg font-bold">€{tokenPrice} per token</p>
          </div>
          
          {/* Amount input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (€)
            </label>
            <input
              type="number"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount in EUR"
            />
          </div>
          
          {/* Calculated tokens */}
          <div className="mb-4">
            <p className="text-gray-500 text-sm mb-1">
              {tradeType === 'buy' ? 'You will receive' : 'You will sell'}
            </p>
            <p className="text-lg font-bold">{calculatedTokens} tokens</p>
          </div>
          
          {/* Transaction details */}
          <div className="mb-6 bg-gray-50 p-3 rounded-md text-sm">
            <div className="flex justify-between mb-1">
              <span>Subtotal</span>
              <span>€{amount}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Platform Fee (1%)</span>
              <span>€{(parseFloat(amount || '0') * 0.01).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>€{(parseFloat(amount || '0') * 1.01).toFixed(2)}</span>
            </div>
          </div>
          
          {/* Action button */}
          <Button
            variant={tradeType === 'buy' ? 'primary' : 'danger'}
            fullWidth
          >
            {tradeType === 'buy' ? 'Buy Tokens' : 'Sell Tokens'}
          </Button>
          
          <p className="text-xs text-gray-500 mt-2 text-center">
            By proceeding, you agree to our Terms of Service and confirm this is a simulated transaction.
          </p>
        </div>
      </div>
    </div>
  );
} 