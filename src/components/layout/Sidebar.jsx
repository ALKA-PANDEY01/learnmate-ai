import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  Layers,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  GraduationCap,
  Compass,
  Clock,
  HelpCircle,
  Trophy,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';

export const Sidebar = ({
  isCollapsed,
  setIsCollapsed,
  isOpen,
  setIsOpen
}) => {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Learning Roadmap', path: '/dashboard/roadmap', icon: Compass },
    { name: 'Study Session', path: '/dashboard/study', icon: Clock },
    { name: 'Syllabus Quiz', path: '/dashboard/quiz', icon: HelpCircle },
    { name: 'Syllabus Calendar', path: '/dashboard/calendar', icon: Calendar },
    { name: 'Achievements', path: '/dashboard/achievements', icon: Trophy },
    { name: 'My Courses', path: '/dashboard/courses', icon: BookOpen },
    { name: 'AI Study Tutor', path: '/dashboard/tutor', icon: Sparkles },
    { name: 'Flashcards', path: '/dashboard/flashcards', icon: Layers },
    { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
  };

  const sidebarWidthClass = isCollapsed ? 'w-20' : 'w-64';

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 flex flex-col h-full glass border-r border-border transition-all duration-300
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${sidebarWidthClass}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border/50">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-white shrink-0 shadow-md shadow-primary/20 animate-pulse-slow">
              <GraduationCap size={20} />
            </div>
            {!isCollapsed && (
              <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent truncate">
                LearnMate AI
              </span>
            )}
          </div>

          {/* Collapse toggle (desktop only) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-muted hover:text-foreground hover:bg-card border border-border/50 shadow-sm"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                  ${isActive
                    ? 'bg-primary text-white shadow-sm shadow-primary/10'
                    : 'text-muted hover:text-foreground hover:bg-card/60'
                  }
                `}
              >
                <Icon
                  size={18}
                  className={`
                    transition-transform duration-200 group-hover:scale-110 shrink-0
                    ${isCollapsed ? 'mx-auto' : ''}
                  `}
                />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-border/50 space-y-2">
          {/* User Profile Summary (when not collapsed) */}
          {!isCollapsed && user && (
            <div className="flex items-center gap-3 p-2 rounded-xl bg-card/45 border border-border/50">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-lg object-cover ring-2 ring-primary/20 shrink-0"
              />
              <div className="overflow-hidden min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
                <p className="text-[10px] text-muted truncate">{user.email}</p>
              </div>
            </div>
          )}

          {/* Theme Toggler & Logout */}
          <div className={`flex ${isCollapsed ? 'flex-col items-center' : 'items-center justify-between'} gap-1.5`}>
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              className="flex items-center justify-center p-2.5 rounded-xl text-muted hover:text-foreground hover:bg-card/80 border border-border/50"
            >
              {theme === 'light' ? (
                <span className="text-xs font-medium flex items-center gap-2">
                  🌙 {!isCollapsed && 'Dark Mode'}
                </span>
              ) : (
                <span className="text-xs font-medium flex items-center gap-2">
                  ☀️ {!isCollapsed && 'Light Mode'}
                </span>
              )}
            </button>

            <button
              onClick={handleLogout}
              title="Logout"
              className={`
                flex items-center justify-center p-2.5 rounded-xl text-red-500 hover:text-white hover:bg-red-600 border border-red-500/10 transition-colors
                ${isCollapsed ? 'w-full' : 'flex-1'}
              `}
            >
              <LogOut size={16} />
              {!isCollapsed && <span className="text-xs font-semibold ml-2">Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
