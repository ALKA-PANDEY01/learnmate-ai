import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverEffect = false,
  isGlass = true,
  padding = 'md',
  ...props
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const baseStyle = 'rounded-2xl border transition-all duration-300';
  const themeStyle = isGlass
    ? 'glass-card'
    : 'bg-card text-card-foreground border-border';
  const hoverStyle = hoverEffect
    ? 'hover:-translate-y-1 hover:shadow-lg hover:border-primary/20 dark:hover:border-primary/30'
    : '';

  return (
    <div
      className={`${baseStyle} ${themeStyle} ${paddings[padding]} ${hoverStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 flex flex-col space-y-1.5 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-xl font-semibold font-display tracking-tight text-foreground ${className}`}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-muted ${className}`}>{children}</p>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-6 flex items-center pt-4 border-t border-border/50 ${className}`}>{children}</div>
);
