import React from 'react';

const Button = ({ children, variant = 'primary', className = '', onClick, disabled = false, as = 'button' }) => {
  const baseStyle = "px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center transform hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-primary-blue text-white hover:bg-blue-700 focus:ring-primary-blue",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-primary-blue",
    success: "bg-success-green text-white hover:bg-green-600 focus:ring-success-green",
    danger: "bg-error-red text-white hover:bg-red-600 focus:ring-error-red",
  };

  const Component = as === 'span' ? 'span' : 'button';

  return (
    <Component
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </Component>
  );
};

export default Button;
