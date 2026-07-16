import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Capitalize path names nicely
  const getDisplayName = (path) => {
    const customNames = {
      dashboard: 'Dashboard',
      courses: 'My Courses',
      tutor: 'AI Tutor',
      flashcards: 'Flashcards',
      analytics: 'Analytics',
      settings: 'Settings',
      profile: 'User Profile'
    };
    return customNames[path] || path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <nav className="flex items-center space-x-1.5 text-xs font-medium text-muted">
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <Home size={13} />
        <span className="sr-only">Home</span>
      </Link>
      
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

        return (
          <React.Fragment key={to}>
            <ChevronRight size={12} className="text-muted/50 shrink-0" />
            {last ? (
              <span className="text-foreground font-semibold truncate max-w-[120px]">
                {getDisplayName(value)}
              </span>
            ) : (
              <Link
                to={to}
                className="hover:text-foreground transition-colors truncate max-w-[120px]"
              >
                {getDisplayName(value)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
