import React, { useState, useEffect } from 'react';
import {
  Bell,
  Check,
  Trash2,
  Sparkles,
  Calendar,
  AlertTriangle,
  Award,
  HelpCircle,
  RefreshCw,
  Zap
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SEO } from '../components/common/SEO';
import api from '../services/api';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [triggeringCron, setTriggeringCron] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      if (response.success && response.notifications) {
        setNotifications(response.notifications);
      }
    } catch (err) {
      console.warn("Failed to load notifications from database:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      const response = await api.patch(`/notifications/${id}`, { read: true });
      if (response.success) {
        setNotifications(prev =>
          prev.map(n => (n._id === id ? { ...n, read: true } : n))
        );
      }
    } catch (err) {
      console.error("Failed to mark notification as read", err.message);
    }
  };

  const handleTriggerCron = async () => {
    setTriggeringCron(true);
    try {
      const response = await api.post('/notifications/trigger-cron');
      if (response.success) {
        alert("Manual activity audit completed! If inactivity or overdue items are detected, a new smart nudge notification has been posted.");
        await fetchNotifications();
      }
    } catch (err) {
      console.error("Failed to run manual cron audit", err.message);
      alert("Cron audit completed with no new events detected.");
    } finally {
      setTriggeringCron(false);
    }
  };

  // Filter conditions
  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'alerts') return n.type === 'alert' || n.type === 'missed_task';
    if (filter === 'nudges') return n.type === 'nudge';
    if (filter === 'achievements') return n.type === 'achievement';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const filters = [
    { key: 'all', label: 'All Notifications' },
    { key: 'alerts', label: 'Alerts & Deadlines' },
    { key: 'nudges', label: 'AI Nudges' },
    { key: 'achievements', label: 'Achievements 🏆' }
  ];

  const getCategoryDetails = (type) => {
    const mappings = {
      nudge: {
        icon: <Sparkles className="text-indigo-500 w-4.5 h-4.5" />,
        bg: "bg-indigo-500/10 border-indigo-500/15"
      },
      alert: {
        icon: <Calendar className="text-red-500 w-4.5 h-4.5" />,
        bg: "bg-red-500/10 border-red-500/15"
      },
      missed_task: {
        icon: <AlertTriangle className="text-amber-500 w-4.5 h-4.5" />,
        bg: "bg-amber-500/10 border-amber-500/15"
      },
      achievement: {
        icon: <Award className="text-emerald-500 w-4.5 h-4.5" />,
        bg: "bg-emerald-500/10 border-emerald-500/15"
      },
      reminder: {
        icon: <HelpCircle className="text-primary w-4.5 h-4.5" />,
        bg: "bg-primary/10 border-primary/15"
      }
    };
    return mappings[type] || {
      icon: <Bell className="text-muted w-4.5 h-4.5" />,
      bg: "bg-muted/10 border-border"
    };
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-pulse">
        <div className="h-8 bg-border/40 w-1/3 rounded-lg" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <Card key={i} className="h-20 border-border/40" />
          ))}
        </div>
      </div>
    );
  }

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

        <div className="flex gap-2 shrink-0 self-end sm:self-center">
          <Button
            variant="glass"
            size="sm"
            onClick={handleTriggerCron}
            disabled={triggeringCron}
            iconLeft={triggeringCron ? <RefreshCw size={13} className="animate-spin" /> : <Zap size={13} />}
          >
            {triggeringCron ? 'Scanning...' : 'Trigger AI Nudges'}
          </Button>
        </div>
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
          filteredNotifications.map((notif) => {
            const isUnread = !notif.read;
            const category = getCategoryDetails(notif.type);
            
            return (
              <div
                key={notif._id || notif.id}
                className={`
                  flex items-start gap-4 p-4 rounded-2xl border transition-all duration-200 relative group
                  ${isUnread
                    ? 'bg-card text-foreground border-primary/25 shadow-sm shadow-primary/[0.02]'
                    : 'bg-card/45 text-foreground/80 border-border/60 opacity-85'
                  }
                `}
              >
                {/* Category icon */}
                <div className={`p-2 rounded-xl border ${category.bg} shrink-0 mt-0.5`}>
                  {category.icon}
                </div>

                {/* Text content */}
                <div className="flex-1 min-w-0 space-y-1.5 pr-8">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className={`text-xs sm:text-sm font-bold text-foreground leading-snug ${isUnread ? 'font-extrabold' : ''}`}>
                      {notif.title}
                    </h4>
                    <span className="text-[9px] text-muted shrink-0">
                      {new Date(notif.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    {notif.message}
                  </p>
                </div>

                {/* Action triggers */}
                <div className="absolute right-3.5 top-3.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {isUnread && (
                    <button
                      onClick={() => handleMarkRead(notif._id || notif.id)}
                      className="p-1 rounded bg-muted/10 border border-border text-muted hover:text-foreground hover:bg-muted/20"
                      title="Mark as read"
                    >
                      <Check size={13} />
                    </button>
                  )}
                </div>
                
                {/* Unread circle marker */}
                {isUnread && (
                  <span className="absolute right-3.5 top-3.5 w-2 h-2 rounded-full bg-primary animate-pulse group-hover:hidden" />
                )}

              </div>
            );
          })
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
