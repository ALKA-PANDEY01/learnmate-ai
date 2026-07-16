import React from 'react';

export const Skeleton = ({
  className = '',
  variant = 'text', // text, circle, rect, card
  ...props
}) => {
  const baseClass = 'bg-muted/20 animate-pulse rounded';

  const variants = {
    text: 'h-3.5 w-full',
    circle: 'rounded-full h-10 w-10 shrink-0',
    rect: 'h-24 w-full rounded-xl',
    card: 'h-40 w-full rounded-2xl border border-border/40 p-5 space-y-3.5 bg-card/25'
  };

  if (variant === 'card') {
    return (
      <div className={`${variants.card} ${className}`} {...props}>
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-2 w-full">
            <div className="h-4 bg-muted/20 animate-pulse rounded w-1/3" />
            <div className="h-3 bg-muted/20 animate-pulse rounded w-2/3" />
          </div>
          <div className="h-10 w-10 rounded-xl bg-muted/20 animate-pulse shrink-0" />
        </div>
        <div className="h-2 bg-muted/20 animate-pulse rounded-full w-full mt-4" />
        <div className="h-3 bg-muted/20 animate-pulse rounded w-1/2 mt-2" />
      </div>
    );
  }

  return (
    <div
      className={`${baseClass} ${variants[variant]} ${className}`}
      {...props}
    />
  );
};
