import { Property } from '@/data/mock/properties';
import { Filters, ScoreFilter, YieldFilter } from '@/components/ui/FilterBar';

/**
 * Filter properties based on user-selected filters
 */
export const filterProperties = (properties: Property[], filters: Filters): Property[] => {
  return properties.filter(property => {
    // Filter by location
    if (filters.location !== 'All Locations') {
      const city = property.location.split(',')[0].trim();
      if (city !== filters.location) {
        return false;
      }
    }

    // Filter by score
    if (filters.score !== 'all') {
      switch (filters.score) {
        case 'high':
          if (property.score < 8) return false;
          break;
        case 'medium':
          if (property.score < 6 || property.score >= 8) return false;
          break;
        case 'low':
          if (property.score >= 6) return false;
          break;
      }
    }

    // Filter by yield
    if (filters.yield !== 'all') {
      switch (filters.yield) {
        case 'high':
          if (property.yield < 6) return false;
          break;
        case 'medium':
          if (property.yield < 4 || property.yield >= 6) return false;
          break;
        case 'low':
          if (property.yield >= 4) return false;
          break;
      }
    }

    return true;
  });
}; 