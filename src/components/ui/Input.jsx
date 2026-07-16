import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  error,
  type = 'text',
  className = '',
  id,
  iconLeft,
  iconRight,
  ...props
}, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-medium text-foreground/80 tracking-wide select-none"
        >
          {label}
        </label>
      )}
      
      <div className="relative flex items-center">
        {iconLeft && (
          <span className="absolute left-3.5 text-muted pointer-events-none flex items-center">
            {iconLeft}
          </span>
        )}
        
        <input
          ref={ref}
          type={type}
          id={id}
          className={`
            w-full rounded-xl border bg-card/45 px-3.5 py-2.5 text-sm text-foreground
            placeholder:text-muted/60 transition-all duration-200 outline-none
            ${iconLeft ? 'pl-10' : ''}
            ${iconRight ? 'pr-10' : ''}
            ${error
              ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/10'
            }
            ${className}
          `}
          {...props}
        />
        
        {iconRight && (
          <span className="absolute right-3.5 text-muted pointer-events-none flex items-center">
            {iconRight}
          </span>
        )}
      </div>
      
      {error && (
        <p className="text-xs text-red-500 font-medium pl-1 animate-pulse-slow">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
