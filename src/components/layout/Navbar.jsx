import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Search,
  Menu,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Sparkles,
  Command,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Breadcrumbs } from './Breadcrumbs';

export const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const mockNotifications = [
    {
      id: 1,
      title: 'AI Study Guide Ready',
      desc: 'Your personalized guide for React Hooks is compiled.',
      time: '5m ago',
      unread: true,
      type: 'ai'
    },
    {
      id: 2,
      title: 'Quiz Completed!',
      desc: 'You scored 85% on "Tailwind CSS Basics".',
      time: '2h ago',
      unread: false,
      type: 'quiz'
    },
    {
      id: 3,
      title: 'Achievement Unlocked 🏆',
      desc: '3-day learning streak! Keep it up.',
      time: '1d ago',
      unread: false,
      type: 'milestone'
    }
  ];

  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    alert(`Searching for: "${searchQuery}" (Search functionality is mocked)`);
    setSearchQuery('');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 border-b border-border/50 glass-nav">
      
      {/* Left side: Menu toggle (mobile) & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-muted hover:text-foreground hover:bg-card border border-border/50 transition-colors"
        >
          <Menu size={20} />
        </button>
        <div className="hidden sm:block">
          <Breadcrumbs />
        </div>
      </div>

      {/* Right side: Search, Notifications, Profile */}
      <div className="flex items-center gap-4">
        
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative hidden md:flex items-center">
          <Search size={16} className="absolute left-3 text-muted pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search learning materials..."
            className="w-64 rounded-xl border border-border bg-card/45 pl-9 pr-8 py-1.5 text-xs text-foreground placeholder:text-muted/60 transition-all duration-200 outline-none focus:border-primary/50 focus:w-80"
          />
          <kbd className="absolute right-2.5 px-1.5 py-0.5 rounded border border-border/80 bg-background text-[10px] text-muted pointer-events-none flex items-center gap-0.5 font-sans font-medium">
            <Command size={10} />K
          </kbd>
        </form>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-muted hover:text-foreground hover:bg-card border border-border/50 transition-all duration-200"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-background">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-80 rounded-2xl glass-card border border-border p-2 shadow-xl animate-in fade-in slide-in-from-top-3 duration-200">
              <div className="flex items-center justify-between px-3 py-2 border-b border-border/50">
                <span className="text-sm font-semibold text-foreground">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[10px] font-medium text-primary hover:underline"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="mt-1 max-h-72 overflow-y-auto space-y-1">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`flex gap-3 p-2.5 rounded-xl transition-colors cursor-pointer hover:bg-card ${
                      notif.unread ? 'bg-primary/5 dark:bg-primary/10' : ''
                    }`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {notif.type === 'ai' && (
                        <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
                          <Sparkles size={14} />
                        </div>
                      )}
                      {notif.type === 'quiz' && (
                        <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                          <BookOpen size={14} />
                        </div>
                      )}
                      {notif.type === 'milestone' && (
                        <span className="text-base select-none">🏆</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-1">
                        <p className={`text-xs text-foreground truncate ${notif.unread ? 'font-semibold' : ''}`}>
                          {notif.title}
                        </p>
                        <span className="text-[9px] text-muted whitespace-nowrap">{notif.time}</span>
                      </div>
                      <p className="text-[10px] text-muted line-clamp-2 mt-0.5">{notif.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border/40 mt-2 pt-2 pb-0.5 text-center">
                <Link
                  to="/dashboard/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] font-bold text-primary hover:underline block"
                >
                  See all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        {user && (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-card border border-transparent hover:border-border/50 transition-all duration-200"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-border"
              />
              <ChevronDown size={14} className="text-muted" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2.5 w-56 rounded-2xl glass-card border border-border p-1.5 shadow-xl animate-in fade-in slide-in-from-top-3 duration-200">
                <div className="px-3 py-2 border-b border-border/50 mb-1">
                  <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
                  <p className="text-[10px] text-muted truncate mt-0.5">{user.email}</p>
                </div>
                
                <div className="space-y-0.5">
                  <Link
                    to="/dashboard/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-muted hover:text-foreground hover:bg-card transition-colors"
                  >
                    <User size={14} />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/dashboard/settings"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-muted hover:text-foreground hover:bg-card transition-colors"
                  >
                    <Settings size={14} />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </header>
  );
};
