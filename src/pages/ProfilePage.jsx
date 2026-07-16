import React, { useState } from 'react';
import {
  User,
  Mail,
  Calendar,
  Flame,
  Clock,
  BookOpen,
  Award,
  Edit3,
  Target,
  Trophy,
  CheckCircle,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRoadmap } from '../context/RoadmapContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { SEO } from '../components/common/SEO';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { roadmap } = useRoadmap();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editError, setEditError] = useState('');

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setEditError('');

    if (!editName.trim() || !editEmail.trim()) {
      setEditError('Please fill out all fields.');
      return;
    }

    try {
      updateUser({ name: editName.trim(), email: editEmail.trim() });
      setIsEditModalOpen(false);
    } catch (e) {
      setEditError('Failed to update details. Please try again.');
    }
  };

  const streak = roadmap ? roadmap.streak : 5;
  const hours = roadmap ? roadmap.hoursStudied : 14.5;
  const progress = roadmap ? roadmap.progress : 20;

  const mockAchievements = [
    { title: 'Early Bird', desc: 'Study before 8:00 AM', unlocked: true, icon: '🌅' },
    { title: 'Deep Focus', desc: 'Complete 4 Pomodoro sessions in a day', unlocked: true, icon: '🧘' },
    { title: 'Quiz Master', desc: 'Score 90% or higher on any quiz', unlocked: true, icon: '💯' }
  ];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      <SEO title="My Profile" description="View details, edit name & email, explore achievements, and check study velocity stats." />

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">
          My Profile👤
        </h1>
        <p className="text-sm text-muted">
          Manage your personal details, learning stats, and unlocked achievements.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Details Card */}
        <div className="md:col-span-1 space-y-6">
          <Card isGlass={true} padding="md" className="border-border/50 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            
            <div className="relative pt-6">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80'}
                alt={user?.name}
                className="w-24 h-24 rounded-2xl mx-auto object-cover ring-4 ring-primary/20 shadow-lg"
              />
              <h2 className="text-xl font-bold font-display text-foreground mt-4">{user?.name}</h2>
              <span className="text-xs font-semibold text-muted bg-primary/10 text-primary border border-primary/15 px-2.5 py-0.5 rounded-full mt-1.5 inline-block">
                {user?.role || 'Student'}
              </span>
            </div>

            <div className="mt-8 space-y-3.5 text-left border-t border-border/40 pt-6 text-xs text-muted">
              <div className="flex items-center gap-2.5">
                <User size={14} className="text-primary" />
                <span className="font-semibold text-foreground truncate">@{user?.username}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="text-primary" />
                <span className="truncate">{user?.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Calendar size={14} className="text-primary" />
                <span>Joined {user?.joinedAt || '2026-01-15'}</span>
              </div>
            </div>

            <div className="mt-6 pt-2">
              <Button
                variant="outline"
                className="w-full text-xs"
                onClick={() => {
                  setEditName(user?.name || '');
                  setEditEmail(user?.email || '');
                  setIsEditModalOpen(true);
                }}
                iconLeft={<Edit3 size={13} />}
              >
                Edit Profile
              </Button>
            </div>
          </Card>

          {/* Current Active Goal */}
          <Card isGlass={true} padding="md" className="border-border/50 bg-primary/5">
            <div className="flex items-start gap-3">
              <Target className="text-primary shrink-0 mt-0.5" size={18} />
              <div className="space-y-1.5 min-w-0">
                <span className="text-[10px] font-bold text-primary tracking-wider uppercase">Active Goal</span>
                <h4 className="text-xs sm:text-sm font-bold text-foreground leading-snug truncate">
                  {roadmap ? roadmap.goal : 'No active goals'}
                </h4>
                {roadmap && (
                  <p className="text-[11px] text-muted">
                    Deadline: {roadmap.deadline} | style: {roadmap.learningStyle}
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Stats and Achievements Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Learning Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Completed Modules", value: roadmap ? `${progress}%` : "0%", icon: <CheckCircle size={16} />, color: "text-secondary", bg: "bg-secondary/10 border-secondary/20" },
              { label: "Hours Studied", value: `${hours} hrs`, icon: <Clock size={16} />, color: "text-primary", bg: "bg-primary/10 border-primary/20" },
              { label: "Current Streak", value: `${streak} Days`, icon: <Flame size={16} className="animate-pulse" />, color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20" }
            ].map((stat, idx) => (
              <Card key={idx} isGlass={true} padding="md" className="border-border/50 text-center flex flex-col items-center">
                <div className={`p-2.5 rounded-xl border mb-3 ${stat.bg} ${stat.color}`}>
                  {stat.icon}
                </div>
                <span className="text-[10px] font-semibold text-muted tracking-wider uppercase">{stat.label}</span>
                <p className="text-xl font-bold font-display text-foreground mt-1.5">{stat.value}</p>
              </Card>
            ))}
          </div>

          {/* Unlocked Achievements shelf */}
          <Card isGlass={true} className="border-border/50">
            <CardHeader className="mb-0 pb-2">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Trophy size={15} className="text-primary" />
                <span>Featured Badges</span>
              </CardTitle>
              <CardDescription className="text-xs">Browse some of your recently unlocked study accomplishments.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid gap-3 sm:grid-cols-3">
                {mockAchievements.map((ach, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-border bg-background/45 flex items-center gap-3 hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <span className="text-2xl select-none">{ach.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">{ach.title}</p>
                      <p className="text-[9px] text-muted line-clamp-2 mt-0.5 leading-snug">{ach.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Profile popup modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile Details"
        size="md"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
          {editError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium">
              {editError}
            </div>
          )}

          <Input
            label="Full Name"
            type="text"
            id="profile-name-edit"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="John Doe"
            required
          />

          <Input
            label="Email Address"
            type="email"
            id="profile-email-edit"
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
            placeholder="john@example.com"
            required
          />

          <div className="flex justify-end gap-2.5 pt-4 border-t border-border/40">
            <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
