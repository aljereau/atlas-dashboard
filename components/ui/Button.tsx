import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  animateScale?: boolean;
  animateOnHover?: 'none' | 'pulse' | 'scale';
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  animateScale = true,
  animateOnHover = 'none',
  ...rest
}: ButtonProps) {
  // Variant styles with dark mode support
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 shadow-sm hover:shadow',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200',
    outline: 'bg-transparent hover:bg-gray-100 text-blue-600 border border-blue-600 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white dark:bg-red-500 dark:hover:bg-red-600',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800',
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  // Animation styles
  const getAnimationStyles = () => {
    if (disabled || isLoading) return '';
    
    let styles = '';
    if (animateScale) {
      styles += ' active:scale-95 transition-transform';
    }
    
    if (animateOnHover === 'pulse') {
      styles += ' hover:animate-pulse';
    } else if (animateOnHover === 'scale') {
      styles += ' hover:scale-105 transition-transform';
    }
    
    return styles;
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center rounded-md font-medium transition-all duration-200
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${(disabled || isLoading) ? 'opacity-60 cursor-not-allowed' : ''}
        ${getAnimationStyles()}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {!isLoading && leftIcon && (
        <span className="mr-2 inline-flex">{leftIcon}</span>
      )}
      
      {children}
      
      {!isLoading && rightIcon && (
        <span className="ml-2 inline-flex">{rightIcon}</span>
      )}
    </button>
  );
} 