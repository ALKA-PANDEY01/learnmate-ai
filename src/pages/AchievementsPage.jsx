import React from 'react';
import { Trophy, ShieldAlert, Award, Star, Lock, Sparkles, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { SEO } from '../components/common/SEO';

const ACHIEVEMENTS = [
  {
    id: 1,
    title: "First Step 🌅",
    desc: "Complete your first task in any learning roadmap.",
    category: "milestone",
    xp: 50,
    unlocked: true,
    progress: 100,
    requirement: "Complete 1 syllabus task node"
  },
  {
    id: 2,
    title: "Focus Master 🧘",
    desc: "Complete a Pomodoro study focus session.",
    category: "focus",
    xp: 100,
    unlocked: true,
    progress: 100,
    requirement: "Finish a 25-minute study interval"
  },
  {
    id: 3,
    title: "Perfect Score 💯",
    desc: "Achieve a score of 100% on any practice quiz.",
    category: "quiz",
    xp: 200,
    unlocked: true,
    progress: 100,
    requirement: "Get 5 out of 5 correct on any quiz"
  },
  {
    id: 4,
    title: "Learning Streak 🔥",
    desc: "Maintain a study session streak for 5 consecutive days.",
    category: "streak",
    xp: 150,
    unlocked: true,
    progress: 100,
    requirement: "Log study times for 5 consecutive days"
  },
  {
    id: 5,
    title: "Sprint Completed 🏆",
    desc: "Finish all scheduled tasks in Week 1 of your goal roadmap.",
    category: "milestone",
    xp: 250,
    unlocked: false,
    progress: 66,
    requirement: "Complete all tasks in Week 1 (2/3 completed)"
  },
  {
    id: 6,
    title: "Consistency Hero 📅",
    desc: "Complete study session timer blocks on 10 separate days.",
    category: "focus",
    xp: 300,
    unlocked: false,
    progress: 30,
    requirement: "Focus on 10 days (3/10 days logged)"
  },
  {
    id: 7,
    title: "Polymath Mastery 📚",
    desc: "Establish and generate three separate learning roadmap goals.",
    category: "milestone",
    xp: 400,
    unlocked: false,
    progress: 33,
    requirement: "Setup 3 learning goals (1/3 generated)"
  },
  {
    id: 8,
    title: "AI Dialogue Specialist 💬",
    desc: "Submit 20 study questions to your AI Mentor chatbot.",
    category: "mentor",
    xp: 150,
    unlocked: false,
    progress: 25,
    requirement: "Send 20 messages to AI Tutor (5/20 sent)"
  }
];

export default function AchievementsPage() {
  const unlockedCount = ACHIEVEMENTS.filter(a => a.unlocked).length;
  const totalXp = ACHIEVEMENTS.filter(a => a.unlocked).reduce((sum, a) => sum + a.xp, 0);

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
              <p className="text-xl font-bold text-secondary font-display">{unlockedCount} of {ACHIEVEMENTS.length}</p>
            </div>
            <div className="text-center space-y-0.5 border-l border-border/60 pl-6">
              <span className="text-[9px] font-semibold text-muted uppercase">Total Points</span>
              <p className="text-xl font-bold text-primary font-display">{totalXp} XP</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Achievements Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {ACHIEVEMENTS.map((ach) => (
          <Card
            key={ach.id}
            isGlass={true}
            padding="md"
            className={`
              border-border/50 relative overflow-hidden transition-all duration-300 hover:shadow-md
              ${ach.unlocked
                ? 'hover:border-primary/20 dark:hover:border-primary/30'
                : 'opacity-70 hover:opacity-90'
              }
            `}
          >
            {/* Left/Right layouts */}
            <div className="flex items-start gap-4">
              
              {/* Badge Icon circle */}
              <div className={`
                w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border text-xl transition-transform duration-300 group-hover:scale-105
                ${ach.unlocked
                  ? 'bg-secondary/10 border-secondary/20 shadow-sm text-secondary'
                  : 'bg-muted/10 border-border/40 text-muted'
                }
              `}>
                {ach.unlocked ? (
                  <span className="select-none">{ach.title.split(' ').pop()}</span>
                ) : (
                  <Lock size={16} className="text-muted/60" />
                )}
              </div>

              {/* Text content details */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className={`text-xs sm:text-sm font-bold text-foreground truncate ${ach.unlocked ? '' : 'text-muted'}`}>
                      {ach.unlocked ? ach.title.split(' ').slice(0, -1).join(' ') : ach.title.split(' ').slice(0, -1).join(' ')}
                    </h4>
                    <span className="text-[9px] text-muted">{ach.category.toUpperCase()}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border shrink-0 ${
                    ach.unlocked
                      ? 'bg-primary/10 border-primary/20 text-primary'
                      : 'bg-muted/10 border-border/30 text-muted'
                  }`}>
                    +{ach.xp} XP
                  </span>
                </div>

                <p className="text-xs text-muted leading-relaxed">
                  {ach.desc}
                </p>

                {/* Progress parameters */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-[10px] font-semibold text-muted">
                    <span>{ach.unlocked ? 'Unlocked' : 'Requirement'}</span>
                    <span>{ach.unlocked ? '100%' : `${ach.progress}%`}</span>
                  </div>
                  
                  {ach.unlocked ? (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-secondary">
                      <Check size={11} className="stroke-[3px]" />
                      <span>{ach.requirement}</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="w-full bg-border/40 rounded-full h-1 overflow-hidden">
                        <div
                          className="bg-primary h-1 rounded-full"
                          style={{ width: `${ach.progress}%` }}
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
        ))}
      </div>

    </div>
  );
}
