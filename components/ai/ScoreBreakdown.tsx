'use client';

import { useState } from 'react';
import { PropertyScoreBreakdown } from '@/data/mock/ai-features';

// Score color mapping
const getScoreColor = (score: number) => {
  if (score >= 8.5) return 'bg-green-500 dark:bg-green-400';
  if (score >= 7) return 'bg-blue-500 dark:bg-blue-400';
  if (score >= 5.5) return 'bg-yellow-500 dark:bg-yellow-400';
  if (score >= 4) return 'bg-orange-500 dark:bg-orange-400';
  return 'bg-red-500 dark:bg-red-400';
};

// Score text color mapping
const getScoreTextColor = (score: number) => {
  if (score >= 8.5) return 'text-green-600 dark:text-green-400';
  if (score >= 7) return 'text-blue-600 dark:text-blue-400';
  if (score >= 5.5) return 'text-yellow-600 dark:text-yellow-400';
  if (score >= 4) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
};

// Change indicator
const ScoreChangeIndicator = ({ change }: { change: number }) => {
  if (change === 0) return (
    <span className="text-gray-500 dark:text-gray-400 text-xs ml-1 flex items-center">
      (no change)
    </span>
  );
  
  return (
    <span 
      className={`text-xs ml-1 flex items-center ${
        change > 0 
          ? 'text-green-600 dark:text-green-400' 
          : 'text-red-600 dark:text-red-400'
      }`}
    >
      {change > 0 ? '+' : ''}{change.toFixed(1)}
      {change > 0 ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-0.5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-0.5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      )}
    </span>
  );
};

interface ScoreBreakdownProps {
  scoreData: PropertyScoreBreakdown;
  className?: string;
}

export default function ScoreBreakdown({ scoreData, className = '' }: ScoreBreakdownProps) {
  const [activeMetric, setActiveMetric] = useState<keyof typeof scoreData.subscores | null>(null);
  
  // Calculate the weighted average of all subscores
  const calculateAverage = () => {
    const { risk, yield: yieldScore, growth, location, condition } = scoreData.subscores;
    return ((risk + yieldScore + growth + location + condition) / 5).toFixed(1);
  };
  
  const getExplanation = () => {
    if (!activeMetric) return '';
    return scoreData.explanation[activeMetric];
  };
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Atlas AI Score Breakdown</h3>
        <div className="flex items-center">
          <span className={`text-xl font-bold ${getScoreTextColor(scoreData.overallScore)}`}>
            {scoreData.overallScore.toFixed(1)}
          </span>
          <ScoreChangeIndicator change={scoreData.change} />
        </div>
      </div>
      
      <div className="space-y-3">
        {/* Risk score */}
        <div 
          className={`cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg ${activeMetric === 'risk' ? 'bg-gray-50 dark:bg-gray-700 ring-1 ring-gray-200 dark:ring-gray-600' : ''}`}
          onClick={() => setActiveMetric(activeMetric === 'risk' ? null : 'risk')}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Risk</span>
            <span className={`text-sm font-semibold ${getScoreTextColor(scoreData.subscores.risk)}`}>
              {scoreData.subscores.risk.toFixed(1)}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${getScoreColor(scoreData.subscores.risk)}`} 
              style={{ width: `${scoreData.subscores.risk * 10}%` }}
            ></div>
          </div>
        </div>
        
        {/* Yield score */}
        <div 
          className={`cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg ${activeMetric === 'yield' ? 'bg-gray-50 dark:bg-gray-700 ring-1 ring-gray-200 dark:ring-gray-600' : ''}`}
          onClick={() => setActiveMetric(activeMetric === 'yield' ? null : 'yield')}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Yield</span>
            <span className={`text-sm font-semibold ${getScoreTextColor(scoreData.subscores.yield)}`}>
              {scoreData.subscores.yield.toFixed(1)}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${getScoreColor(scoreData.subscores.yield)}`} 
              style={{ width: `${scoreData.subscores.yield * 10}%` }}
            ></div>
          </div>
        </div>
        
        {/* Growth score */}
        <div 
          className={`cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg ${activeMetric === 'growth' ? 'bg-gray-50 dark:bg-gray-700 ring-1 ring-gray-200 dark:ring-gray-600' : ''}`}
          onClick={() => setActiveMetric(activeMetric === 'growth' ? null : 'growth')}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Growth</span>
            <span className={`text-sm font-semibold ${getScoreTextColor(scoreData.subscores.growth)}`}>
              {scoreData.subscores.growth.toFixed(1)}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${getScoreColor(scoreData.subscores.growth)}`} 
              style={{ width: `${scoreData.subscores.growth * 10}%` }}
            ></div>
          </div>
        </div>
        
        {/* Location score */}
        <div 
          className={`cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg ${activeMetric === 'location' ? 'bg-gray-50 dark:bg-gray-700 ring-1 ring-gray-200 dark:ring-gray-600' : ''}`}
          onClick={() => setActiveMetric(activeMetric === 'location' ? null : 'location')}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</span>
            <span className={`text-sm font-semibold ${getScoreTextColor(scoreData.subscores.location)}`}>
              {scoreData.subscores.location.toFixed(1)}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${getScoreColor(scoreData.subscores.location)}`} 
              style={{ width: `${scoreData.subscores.location * 10}%` }}
            ></div>
          </div>
        </div>
        
        {/* Condition score */}
        <div 
          className={`cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg ${activeMetric === 'condition' ? 'bg-gray-50 dark:bg-gray-700 ring-1 ring-gray-200 dark:ring-gray-600' : ''}`}
          onClick={() => setActiveMetric(activeMetric === 'condition' ? null : 'condition')}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Condition</span>
            <span className={`text-sm font-semibold ${getScoreTextColor(scoreData.subscores.condition)}`}>
              {scoreData.subscores.condition.toFixed(1)}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${getScoreColor(scoreData.subscores.condition)}`} 
              style={{ width: `${scoreData.subscores.condition * 10}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Explanation area */}
      {activeMetric && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 animate-slide-up">
          <p>{getExplanation()}</p>
        </div>
      )}
      
      {/* Calculated average footer */}
      <div className="mt-4 flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400">
        <div>
          <span>Weighted Average: </span>
          <span className="font-semibold">{calculateAverage()}</span>
        </div>
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>Atlas AI powered scoring</span>
        </div>
      </div>
    </div>
  );
} 