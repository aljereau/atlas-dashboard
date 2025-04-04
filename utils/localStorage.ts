const WATCHLIST_KEY = 'atlas_dashboard_watchlist';

/**
 * Get watchlisted property IDs from local storage
 */
export const getWatchlist = (): string[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const watchlist = localStorage.getItem(WATCHLIST_KEY);
    return watchlist ? JSON.parse(watchlist) : [];
  } catch (error) {
    console.error('Error getting watchlist from localStorage:', error);
    return [];
  }
};

/**
 * Add a property ID to the watchlist
 */
export const addToWatchlist = (propertyId: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const watchlist = getWatchlist();
    if (!watchlist.includes(propertyId)) {
      watchlist.push(propertyId);
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
    }
  } catch (error) {
    console.error('Error adding to watchlist:', error);
  }
};

/**
 * Remove a property ID from the watchlist
 */
export const removeFromWatchlist = (propertyId: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const watchlist = getWatchlist();
    const updatedWatchlist = watchlist.filter(id => id !== propertyId);
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updatedWatchlist));
  } catch (error) {
    console.error('Error removing from watchlist:', error);
  }
};

/**
 * Check if a property ID is in the watchlist
 */
export const isInWatchlist = (propertyId: string): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const watchlist = getWatchlist();
    return watchlist.includes(propertyId);
  } catch (error) {
    console.error('Error checking watchlist:', error);
    return false;
  }
};

/**
 * Toggle a property ID in the watchlist
 */
export const toggleWatchlist = (propertyId: string): boolean => {
  if (isInWatchlist(propertyId)) {
    removeFromWatchlist(propertyId);
    return false;
  } else {
    addToWatchlist(propertyId);
    return true;
  }
}; 