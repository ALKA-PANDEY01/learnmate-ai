import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  size = 'md'
}) => {
  // Listen for Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop clickable zone */}
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* Modal Dialog Container */}
      <div className={`
        relative w-full rounded-2xl border border-border/80 glass-card p-6 shadow-2xl z-10
        animate-in zoom-in-95 duration-200 ${sizes[size]} ${className}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 pb-4 mb-4">
          <h3 className="text-lg font-bold font-display text-foreground leading-none">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border border-border/40 text-muted hover:text-foreground hover:bg-muted/15 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs sm:text-sm text-muted">
          {children}
        </div>
      </div>
    </div>
  );
};
