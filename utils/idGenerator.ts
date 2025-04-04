/**
 * Simple ID generator utility to replace uuid for better performance
 */

let counter = 0;

/**
 * Generates a unique ID with a prefix, counter, and timestamp
 * @param prefix Optional prefix for the ID
 * @returns A unique ID string
 */
export function generateId(prefix = 'id'): string {
  counter++;
  return `${prefix}-${counter}-${Date.now()}`;
} 