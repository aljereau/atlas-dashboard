'use client';

interface ChartComponentProps {
  type: 'line' | 'bar' | 'pie';
  title?: string;
  height?: number;
  data?: any; // Will be properly typed in future phases
}

export default function ChartComponent({
  type,
  title,
  height = 200,
  data
}: ChartComponentProps) {
  // Placeholder colors for the chart
  const getRandomColor = () => {
    const colors = [
      '#4C51BF', '#2B6CB0', '#38A169', '#D69E2E', 
      '#DD6B20', '#C53030', '#805AD5', '#D53F8C'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Generate a random number between min and max
  const getRandomValue = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Render a placeholder bar chart
  const renderBarChart = () => {
    return (
      <div className="flex items-end justify-between h-full px-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div 
            key={index}
            style={{ 
              height: `${getRandomValue(30, 100)}%`,
              backgroundColor: getRandomColor(),
              width: '14%'
            }}
            className="rounded-t"
          />
        ))}
      </div>
    );
  };

  // Render a placeholder line chart
  const renderLineChart = () => {
    // Create SVG points for the line
    const points = Array.from({ length: 7 }).map((_, index) => {
      const x = (index * 16.66) + '%';
      const y = (100 - getRandomValue(20, 80)) + '%';
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="h-full w-full">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            points={points}
            fill="none"
            stroke="#4C51BF"
            strokeWidth="2"
          />
          <polyline
            points={`0,100 ${points.split(' ')[0]} ${points} 100,100`}
            fill="rgba(76, 81, 191, 0.1)"
            stroke="none"
          />
        </svg>
      </div>
    );
  };

  // Render a placeholder pie chart
  const renderPieChart = () => {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="w-24 h-24 rounded-full border-8 border-blue-500 relative">
          <div 
            className="absolute top-0 left-0 w-1/2 h-full bg-green-500" 
            style={{ borderRadius: '100% 0 0 100% / 50% 0 0 50%' }}
          />
          <div 
            className="absolute top-0 right-0 w-1/2 h-1/2 bg-yellow-500" 
            style={{ borderRadius: '0 100% 0 0 / 0 50% 0 0' }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow">
      {title && (
        <div className="mb-3 text-sm font-semibold text-gray-700">{title}</div>
      )}
      
      <div style={{ height: `${height}px` }} className="overflow-hidden">
        {type === 'bar' && renderBarChart()}
        {type === 'line' && renderLineChart()}
        {type === 'pie' && renderPieChart()}
      </div>

      <div className="mt-3 flex justify-between text-xs text-gray-500">
        <span>Jan</span>
        <span>Feb</span>
        <span>Mar</span>
        <span>Apr</span>
        <span>May</span>
        <span>Jun</span>
      </div>
    </div>
  );
} 