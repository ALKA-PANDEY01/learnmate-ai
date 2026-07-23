import React, { useState, useEffect } from 'react';
import { Trophy, ShieldAlert, Award, Star, Lock, Sparkles, Check, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { SEO } from '../components/common/SEO';
import api from '../services/api';

const BADGES_LIST = [
  {
    id: 'first_session',
    title: 'First Focus Cycle 🧠',
    desc: 'Logged your very first focus study session!',
    category: 'focus',
    xp: 100,
    requirement: 'Log 1 study Pomodoro session'
  },
  {
    id: 'streak_7',
    title: '7-Day Burner 🔥',
    desc: 'Maintained a daily study streak for 7 consecutive days.',
    category: 'streak',
    xp: 200,
    requirement: 'Maintain a 7-day study streak'
  },
  {
    id: 'hours_10',
    title: 'Dedicated Scholar 📚',
    desc: 'Logged over 10 hours of active focus study sessions.',
    category: 'focus',
    xp: 300,
    requirement: 'Accumulate 10 study hours'
  },
  {
    id: 'flashcards_50',
    title: 'Memory Master 🧠',
    desc: 'Added 50 active flashcards to your revision decks.',
    category: 'retention',
    xp: 150,
    requirement: 'Generate or add 50 flashcards'
  },
  {
    id: 'quizzes_10',
    title: 'Concept Check Champion 🏆',
    desc: 'Completed 10 validation quizzes.',
    category: 'quiz',
    xp: 250,
    requirement: 'Finish 10 practice quizzes'
  },
  {
    id: 'roadmap_completed',
    title: 'Syllabus Conqueror 🎓',
    desc: 'Marked all core tasks on your roadmap complete!',
    category: 'milestone',
    xp: 500,
    requirement: 'Complete 100% of tasks in active goal'
  }
];

export default function AchievementsPage() {
  const [unlockedIds, setUnlockedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const fetchAchievements = async () => {
    try {
      const response = await api.get('/achievements');
      if (response.success && response.achievements) {
        const ids = new Set(response.achievements.map(a => a.badgeId));
        setUnlockedIds(ids);
      }
    } catch (err) {
      console.warn("Failed to fetch achievements:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const totalUnlocked = BADGES_LIST.filter(b => unlockedIds.has(b.id)).length;
  const earnedXp = BADGES_LIST.filter(b => unlockedIds.has(b.id)).reduce((sum, b) => sum + b.xp, 0);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-pulse">
        <div className="h-8 bg-border/40 w-1/4 rounded-lg" />
        <div className="h-20 bg-border/30 rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3].map(i => (
            <Card key={i} className="h-32 border-border/40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      <SEO title="Achievements" description="Check unlocked badges, locked goals, and points/XP summaries." />

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-display tracking-tight text-foreground flex items-center gap-2">
          <Trophy size={24} className="text-primary animate-float" />
          <span>Achievements</span>
        </h1>
        <p className="text-sm text-muted">
          Unlock badges, accumulate experience points (XP), and track learning milestones.
        </p>
      </div>

      {/* Stats Summary Shelf */}
      <Card isGlass={true} padding="md" className="border-border/50 bg-secondary/5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-sm font-bold text-foreground">Unlocked Achievements</h3>
            <p className="text-xs text-muted max-w-sm">
              Study daily, finish timeline tasks, and score well on practice quizzes to earn more badges.
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <div className="text-center space-y-0.5">
              <span className="text-[9px] font-semibold text-muted uppercase">Badges Earned</span>
              <p className="text-xl font-bold text-secondary font-display">{totalUnlocked} of {BADGES_LIST.length}</p>
            </div>
            <div className="text-center space-y-0.5 border-l border-border/60 pl-6">
              <span className="text-[9px] font-semibold text-muted uppercase">Total Points</span>
              <p className="text-xl font-bold text-primary font-display">{earnedXp} XP</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Achievements Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {BADGES_LIST.map((ach) => {
          const unlocked = unlockedIds.has(ach.id);
          return (
            <Card
              key={ach.id}
              isGlass={true}
              padding="md"
              className={`
                border-border/50 relative overflow-hidden transition-all duration-300 hover:shadow-md
                ${unlocked
                  ? 'hover:border-primary/20 dark:hover:border-primary/30'
                  : 'opacity-70 hover:opacity-90'
                }
              `}
            >
              <div className="flex items-start gap-4">
                {/* Badge Icon circle */}
                <div className={`
                  w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border text-xl transition-transform duration-300
                  ${unlocked
                    ? 'bg-secondary/10 border-secondary/20 shadow-sm text-secondary'
                    : 'bg-muted/10 border-border/40 text-muted'
                  }
                `}>
                  {unlocked ? (
                    <span className="select-none">{ach.title.split(' ').pop()}</span>
                  ) : (
                    <Lock size={16} className="text-muted/60" />
                  )}
                </div>

                {/* Text content details */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className={`text-xs sm:text-sm font-bold text-foreground truncate ${unlocked ? '' : 'text-muted'}`}>
                        {unlocked ? ach.title.split(' ').slice(0, -1).join(' ') : ach.title.split(' ').slice(0, -1).join(' ')}
                      </h4>
                      <span className="text-[9px] text-muted">{ach.category.toUpperCase()}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border shrink-0 ${
                      unlocked
                        ? 'bg-primary/10 border-primary/20 text-primary'
                        : 'bg-muted/10 border-border/30 text-muted'
                    }`}>
                      +{ach.xp} XP
                    </span>
                  </div>

                  <p className="text-xs text-muted leading-relaxed">
                    {ach.desc}
                  </p>

                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between items-center text-[10px] font-semibold text-muted">
                      <span>{unlocked ? 'Unlocked' : 'Requirement'}</span>
                      <span>{unlocked ? '100%' : '0%'}</span>
                    </div>
                    
                    {unlocked ? (
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-secondary">
                        <Check size={11} className="stroke-[3px]" />
                        <span>Completed</span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="w-full bg-border/40 rounded-full h-1 overflow-hidden">
                          <div
                            className="bg-primary h-1 rounded-full"
                            style={{ width: '0%' }}
                          />
                        </div>
                        <p className="text-[9px] text-muted/80 truncate leading-none">
                          Lock condition: {ach.requirement}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
