'use client';

import { useState, useEffect } from 'react';
import { Property, properties as initialProperties } from '@/data/mock/properties';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface AdminPropertyFormProps {
  property?: Property; // Optional: if provided, we're editing; if not, we're adding
}

// Generate a unique ID for new properties
const generateUniqueId = () => {
  return `prop${Math.floor(Math.random() * 1000) + initialProperties.length + 1}`;
};

export default function AdminPropertyForm({ property }: AdminPropertyFormProps) {
  const router = useRouter();
  const isEditing = !!property;
  
  // Form state
  const [formData, setFormData] = useState<Partial<Property>>(
    property || {
      id: generateUniqueId(),
      name: '',
      location: '',
      score: 7.0,
      price: 300000,
      yield: 5.0,
      appreciation: 3.0,
      image: '',
      sqMeters: 100,
      yearBuilt: new Date().getFullYear() - 5,
      energyLabel: 'B',
      description: '',
      active: true
    }
  );
  
  // Form validation
  const [errors, setErrors] = useState<Partial<Record<keyof Property, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let parsedValue: any = value;
    
    // Parse numeric values
    if (type === 'number' || name === 'price' || name === 'sqMeters' || name === 'yearBuilt') {
      parsedValue = value ? Number(value) : 0;
    }
    
    // Parse float values with precision
    if (name === 'score' || name === 'yield' || name === 'appreciation') {
      parsedValue = value ? parseFloat(parseFloat(value).toFixed(1)) : 0;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
    
    // Clear error for this field when it's changed
    if (errors[name as keyof Property]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: Partial<Record<keyof Property, string>> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Property name is required';
    }
    
    if (!formData.location?.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    if (formData.score === undefined || formData.score < 1 || formData.score > 10) {
      newErrors.score = 'Score must be between 1 and 10';
    }
    
    if (formData.yield === undefined || formData.yield < 0) {
      newErrors.yield = 'Yield must be a positive number';
    }
    
    if (formData.appreciation === undefined) {
      newErrors.appreciation = 'Appreciation is required';
    }
    
    if (!formData.sqMeters || formData.sqMeters <= 0) {
      newErrors.sqMeters = 'Square meters must be greater than 0';
    }
    
    if (!formData.yearBuilt) {
      newErrors.yearBuilt = 'Year built is required';
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real application, this would be an API call
      // For this demo, we'll use local storage
      const properties = JSON.parse(localStorage.getItem('properties') || JSON.stringify(initialProperties));
      
      if (isEditing) {
        // Update existing property
        const updatedProperties = properties.map((p: Property) => 
          p.id === formData.id ? { ...formData } as Property : p
        );
        localStorage.setItem('properties', JSON.stringify(updatedProperties));
      } else {
        // Add new property
        const newProperties = [...properties, formData];
        localStorage.setItem('properties', JSON.stringify(newProperties));
      }
      
      setSubmitSuccess(true);
      
      // Simulate navigation after successful submission
      setTimeout(() => {
        // In a real application, we would use router.push('/admin') here
        // For this demo, we'll simulate it
        window.location.href = '/admin';
      }, 1500);
    } catch (error) {
      console.error('Error saving property:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Success message */}
        {submitSuccess && (
          <div className="p-4 mb-4 bg-green-50 border border-green-200 text-green-800 rounded-md">
            <div className="flex">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">
                {isEditing ? 'Property updated successfully!' : 'Property added successfully!'}
              </span>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Property Name*
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location*
              </label>
              <input
                type="text"
                name="location"
                value={formData.location || ''}
                onChange={handleChange}
                placeholder="City, Country"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description*
              </label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>
          </div>
          
          {/* Financial Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Financial & Property Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Price (€)*
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price || ''}
                  onChange={handleChange}
                  min="1000"
                  step="1000"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Size (m²)*
                </label>
                <input
                  type="number"
                  name="sqMeters"
                  value={formData.sqMeters || ''}
                  onChange={handleChange}
                  min="1"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                    errors.sqMeters ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.sqMeters && (
                  <p className="mt-1 text-sm text-red-600">{errors.sqMeters}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Yield (%)*
                </label>
                <input
                  type="number"
                  name="yield"
                  value={formData.yield || ''}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  max="15"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                    errors.yield ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.yield && (
                  <p className="mt-1 text-sm text-red-600">{errors.yield}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Appreciation (%)*
                </label>
                <input
                  type="number"
                  name="appreciation"
                  value={formData.appreciation || ''}
                  onChange={handleChange}
                  step="0.1"
                  min="-5"
                  max="15"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                    errors.appreciation ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.appreciation && (
                  <p className="mt-1 text-sm text-red-600">{errors.appreciation}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Atlas Score (1-10)*
                </label>
                <input
                  type="number"
                  name="score"
                  value={formData.score || ''}
                  onChange={handleChange}
                  step="0.1"
                  min="1"
                  max="10"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                    errors.score ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.score && (
                  <p className="mt-1 text-sm text-red-600">{errors.score}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Year Built*
                </label>
                <input
                  type="number"
                  name="yearBuilt"
                  value={formData.yearBuilt || ''}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear()}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                    errors.yearBuilt ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.yearBuilt && (
                  <p className="mt-1 text-sm text-red-600">{errors.yearBuilt}</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Energy Label*
              </label>
              <select
                name="energyLabel"
                value={formData.energyLabel || 'B'}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>
                <option value="G">G</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            type="button"
            onClick={() => window.location.href = '/admin'}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting || submitSuccess}
          >
            {isEditing ? 'Update Property' : 'Add Property'}
          </Button>
        </div>
      </form>
    </div>
  );
} 