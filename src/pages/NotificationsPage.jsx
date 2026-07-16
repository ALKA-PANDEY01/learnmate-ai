import React, { useState } from 'react';
import {
  Bell,
  Check,
  Trash2,
  Sparkles,
  Calendar,
  AlertTriangle,
  Award,
  HelpCircle,
  CheckCircle2,
  Eye
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SEO } from '../components/common/SEO';

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: "AI Nudge: Review recommended hooks",
    desc: "We noticed you spent 15 minutes reviewing React Context. Your AI Mentor recommends taking a quick 5-question test on state hooks to lock in the memory.",
    category: "nudge",
    time: "10m ago",
    unread: true,
    icon: <Sparkles className="text-indigo-500 w-4.5 h-4.5" />,
    bg: "bg-indigo-500/10 border-indigo-500/15"
  },
  {
    id: 2,
    title: "Deadline Alert: Week 1 milestone target",
    desc: "Your self-imposed deadline for 'Week 1: Fundamentals of React' is tomorrow at midnight. You have 1 pending task remaining.",
    category: "alert",
    time: "2h ago",
    unread: true,
    icon: <Calendar className="text-red-500 w-4.5 h-4.5" />,
    bg: "bg-red-500/10 border-red-500/15"
  },
  {
    id: 3,
    title: "Missed Task: Practice React memoization",
    desc: "Yesterday's target task 'Practice state memoization using useMemo' was missed. Click here to mark it complete or reschedule.",
    category: "alert",
    time: "1d ago",
    unread: false,
    icon: <AlertTriangle className="text-amber-500 w-4.5 h-4.5" />,
    bg: "bg-amber-500/10 border-amber-500/15"
  },
  {
    id: 4,
    title: "Achievement Unlocked: 5-Day Learning Streak! 🏆",
    desc: "Congratulations! You have logged study minutes for 5 consecutive days. Your learning velocity is 25% higher than last week.",
    category: "achievement",
    time: "2d ago",
    unread: false,
    icon: <Award className="text-emerald-500 w-4.5 h-4.5" />,
    bg: "bg-emerald-500/10 border-emerald-500/15"
  },
  {
    id: 5,
    title: "Quiz Reminder: Vite configuration parameters",
    desc: "You have completed all reading materials for Week 1. Take the diagnostic quiz on Vite builds to assess your score.",
    category: "reminder",
    time: "3d ago",
    unread: false,
    icon: <HelpCircle className="text-primary w-4.5 h-4.5" />,
    bg: "bg-primary/10 border-primary/15"
  }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState('all'); // all, alerts, nudges, achievements

  const handleMarkRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleDeleteAll = () => {
    setNotifications([]);
  };

  // Filter conditions
  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'alerts') return n.category === 'alert';
    if (filter === 'nudges') return n.category === 'nudge';
    if (filter === 'achievements') return n.category === 'achievement';
    return true;
  });

  const unreadCount = notifications.filter(n => n.unread).length;

  const filters = [
    { key: 'all', label: 'All Notifications' },
    { key: 'alerts', label: 'Alerts & Deadlines' },
    { key: 'nudges', label: 'AI Nudges' },
    { key: 'achievements', label: 'Achievements 🏆' }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      <SEO title="Notifications" description="Manage learning alerts, AI study nudges, and unlocked achievements." />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold font-display tracking-tight text-foreground flex items-center gap-2">
            <Bell size={24} className="text-primary" />
            <span>Notifications</span>
          </h1>
          <p className="text-sm text-muted">
            Manage your study notifications, deadlines, and accomplishments.
          </p>
        </div>

        {notifications.length > 0 && (
          <div className="flex gap-2 shrink-0 self-end sm:self-center">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border bg-card/65 text-xs text-muted hover:text-foreground hover:bg-card transition-all font-semibold"
              >
                <Check size={14} />
                <span>Mark all read</span>
              </button>
            )}
            <button
              onClick={handleDeleteAll}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-red-500/10 hover:bg-red-500/10 text-xs text-red-500 transition-all font-semibold"
            >
              <Trash2 size={14} />
              <span>Clear all</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`
              shrink-0 px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200
              ${filter === f.key
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'border-border/60 hover:bg-card/75 text-muted hover:text-foreground'
              }
            `}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Notification items */}
      <div className="space-y-3.5">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`
                flex items-start gap-4 p-4 rounded-2xl border transition-all duration-200 relative group
                ${notif.unread
                  ? 'bg-card text-foreground border-primary/25 shadow-sm shadow-primary/[0.02]'
                  : 'bg-card/45 text-foreground/80 border-border/60 opacity-80'
                }
              `}
            >
              {/* Category icon */}
              <div className={`p-2 rounded-xl border ${notif.bg} shrink-0 mt-0.5`}>
                {notif.icon}
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex justify-between items-start gap-2 pr-6">
                  <h4 className={`text-xs sm:text-sm font-bold text-foreground leading-snug ${notif.unread ? 'font-extrabold' : ''}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-muted shrink-0">{notif.time}</span>
                </div>
                <p className="text-xs text-muted leading-relaxed pr-6">
                  {notif.desc}
                </p>
              </div>

              {/* Action triggers */}
              <div className="absolute right-3.5 top-3.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {notif.unread && (
                  <button
                    onClick={() => handleMarkRead(notif.id)}
                    className="p-1 rounded bg-muted/10 border border-border text-muted hover:text-foreground hover:bg-muted/20"
                    title="Mark as read"
                  >
                    <Check size={13} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(notif.id)}
                  className="p-1 rounded border border-red-500/10 hover:bg-red-500/10 text-muted hover:text-red-500"
                  title="Delete"
                >
                  <Trash2 size={13} />
                </button>
              </div>
              
              {/* Unread circle marker (mobile view indicator) */}
              {notif.unread && (
                <span className="absolute right-3.5 top-3.5 w-2.5 h-2.5 rounded-full bg-primary animate-pulse group-hover:hidden" />
              )}

            </div>
          ))
        ) : (
          <div className="text-center py-16 space-y-3">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-muted/15 flex items-center justify-center text-xl">
              📭
            </div>
            <p className="text-sm font-semibold text-muted">No notifications found</p>
            <p className="text-xs text-muted/80 max-w-xs mx-auto">All clear! Check back later for AI nudges and deadline alerts.</p>
          </div>
        )}
      </div>
    </div>
  );
}
