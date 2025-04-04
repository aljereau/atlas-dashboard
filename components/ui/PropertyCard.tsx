import { Property } from '@/data/mock/properties';

interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
}

export default function PropertyCard({ property, onClick }: PropertyCardProps) {
  // Format price to currency format
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Determine score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'bg-green-500';
    if (score >= 7) return 'bg-blue-500';
    if (score >= 5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
      onClick={onClick}
    >
      {/* Placeholder for property image */}
      <div className="h-40 bg-gray-300 relative">
        <div className="absolute top-2 right-2">
          <span className={`inline-block ${getScoreColor(property.score)} text-white text-sm font-bold px-2 py-1 rounded`}>
            {property.score.toFixed(1)}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold truncate">{property.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{property.location}</p>
        
        <div className="text-xl font-bold mb-2">
          {formatPrice(property.price)}
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-500">Yield:</span>
            <span className="ml-1 font-medium text-green-600">{property.yield}%</span>
          </div>
          <div>
            <span className="text-gray-500">Appreciation:</span>
            <span className="ml-1 font-medium text-blue-600">{property.appreciation}%</span>
          </div>
        </div>
        
        <button className="mt-3 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
} 