import React from 'react';

export const Button = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  iconLeft,
  iconRight,
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-98 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover shadow-sm shadow-primary/20 focus:ring-primary/50',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 shadow-sm shadow-secondary/20 focus:ring-secondary/50',
    outline: 'border border-border bg-card/30 text-foreground hover:bg-card/80 hover:border-muted/30 focus:ring-primary/30',
    ghost: 'text-foreground hover:bg-card/50 hover:text-foreground/90 focus:ring-primary/25',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-600/20 focus:ring-red-500/50',
    glass: 'glass text-foreground hover:bg-foreground/5 border-border focus:ring-primary/30 shadow-sm'
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5'
  };

  const spinner = (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading && spinner}
      {!isLoading && iconLeft && <span className="flex items-center">{iconLeft}</span>}
      {children}
      {!isLoading && iconRight && <span className="flex items-center">{iconRight}</span>}
    </button>
  );
};
