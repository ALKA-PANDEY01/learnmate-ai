import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Trophy,
  CheckCircle,
  HelpCircle,
  Clock,
  Map
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useRoadmap } from '../context/RoadmapContext';
import { SEO } from '../components/common/SEO';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Mock calendar events database for July 2026
const CALENDAR_EVENTS = {
  14: [
    { type: 'complete', title: 'Study Session completed (50 mins)', icon: <Clock size={12} className="text-secondary" /> },
    { type: 'task', title: 'Completed: Intro to React v19 architecture', icon: <CheckCircle size={12} className="text-secondary" /> }
  ],
  15: [
    { type: 'complete', title: 'Study Session completed (90 mins)', icon: <Clock size={12} className="text-secondary" /> },
    { type: 'task', title: 'Completed: Custom hooks Sandbox projects', icon: <CheckCircle size={12} className="text-secondary" /> }
  ],
  16: [
    { type: 'complete', title: 'Today\'s Study Session completed (45 mins)', icon: <Clock size={12} className="text-secondary" /> },
    { type: 'task', title: 'Practice state memoization', icon: <CheckCircle size={12} className="text-secondary" /> }
  ],
  18: [
    { type: 'deadline', title: 'Deadline: Week 1 Quiz validation due', icon: <HelpCircle size={12} className="text-red-500" /> }
  ],
  22: [
    { type: 'milestone', title: 'Milestone target: Week 1 Complete', icon: <Trophy size={12} className="text-amber-500" /> }
  ],
  25: [
    { type: 'deadline', title: 'Deadline: Error boundaries code project', icon: <CheckCircle size={12} className="text-red-500" /> }
  ]
};

export default function CalendarPage() {
  const { roadmap } = useRoadmap();
  const [selectedDay, setSelectedDay] = useState(16); // Default select today (July 16)
  
  // July 2026 parameters
  const monthName = "July 2026";
  const startOffset = 3; // Wednesday start, so Sun-Tue padding
  const totalDays = 31;

  // Compile calendar cells: previous months padding, current days, next months padding
  const cells = [];
  
  // 1. Previous month padding (June)
  for (let i = 28; i <= 30; i++) {
    cells.push({ day: i, isCurrentMonth: false });
  }

  // 2. Current month days (July)
  for (let i = 1; i <= totalDays; i++) {
    const dayEvents = CALENDAR_EVENTS[i] || [];
    const hasDeadline = dayEvents.some(e => e.type === 'deadline');
    const hasMilestone = dayEvents.some(e => e.type === 'milestone');
    const isCompleted = dayEvents.some(e => e.type === 'complete');
    
    cells.push({
      day: i,
      isCurrentMonth: true,
      events: dayEvents,
      hasDeadline,
      hasMilestone,
      isCompleted
    });
  }

  // 3. Next month padding (August)
  const remainingCells = 35 - cells.length; // 5 rows x 7 days = 35 cells
  for (let i = 1; i <= remainingCells; i++) {
    cells.push({ day: i, isCurrentMonth: false });
  }

  const selectedDayEvents = CALENDAR_EVENTS[selectedDay] || [];

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto animate-in fade-in duration-300">
      <SEO title="Study Calendar" description="Track monthly study timetables, quizzes deadlines, and roadmap milestone marks." />

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-display tracking-tight text-foreground flex items-center gap-2">
          <CalendarIcon size={24} className="text-primary" />
          <span>Study Calendar 📅</span>
        </h1>
        <p className="text-sm text-muted">
          Manage your schedule, track deadlines, and review daily progress milestones.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Side: Calendar Grid */}
        <div className="md:col-span-2">
          <Card isGlass={true} padding="md" className="border-border/50">
            {/* Calendar Header controls */}
            <div className="flex items-center justify-between pb-4 border-b border-border/40 mb-4">
              <h3 className="text-sm font-bold text-foreground font-display">{monthName}</h3>
              <div className="flex gap-1.5">
                <button className="p-1 rounded bg-muted/10 hover:bg-muted/20 border border-border/30 text-muted transition-colors">
                  <ChevronLeft size={14} />
                </button>
                <button className="p-1 rounded bg-muted/10 hover:bg-muted/20 border border-border/30 text-muted transition-colors">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Weekdays Labels header */}
            <div className="grid grid-cols-7 text-center text-[10px] font-bold text-muted uppercase pb-2">
              {WEEKDAYS.map(w => (
                <span key={w}>{w}</span>
              ))}
            </div>

            {/* Grid cells */}
            <div className="grid grid-cols-7 gap-1.5 pt-1 text-xs">
              {cells.map((cell, idx) => {
                const isSelected = cell.isCurrentMonth && cell.day === selectedDay;
                
                return (
                  <div
                    key={idx}
                    onClick={() => cell.isCurrentMonth && setSelectedDay(cell.day)}
                    className={`
                      h-12 sm:h-14 rounded-xl border flex flex-col justify-between p-1.5 cursor-pointer transition-all relative
                      ${!cell.isCurrentMonth
                        ? 'border-transparent text-muted/30 bg-muted/[0.02] cursor-not-allowed'
                        : isSelected
                          ? 'border-primary bg-primary/5 text-primary font-bold shadow-sm shadow-primary/5'
                          : 'border-border/60 hover:border-primary/20 hover:bg-card/45 text-foreground'
                      }
                      ${cell.isCompleted && cell.isCurrentMonth ? 'bg-secondary/[0.03]' : ''}
                    `}
                  >
                    {/* Day number */}
                    <span className="leading-none text-[10px] sm:text-xs">{cell.day}</span>

                    {/* Completion ring tick or indicator dots */}
                    <div className="flex items-center gap-1 mt-auto flex-wrap">
                      {cell.isCompleted && cell.isCurrentMonth && (
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary" title="Study session completed" />
                      )}
                      {cell.hasDeadline && cell.isCurrentMonth && (
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" title="Deadline scheduled" />
                      )}
                      {cell.hasMilestone && cell.isCurrentMonth && (
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Milestone scheduled" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Side: Day Details */}
        <div className="md:col-span-1 space-y-4">
          <Card isGlass={true} padding="md" className="border-border/50 min-h-[300px] flex flex-col">
            <CardHeader className="mb-0 pb-2 border-b border-border/40">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted">July {selectedDay} Schedule</CardTitle>
              <CardDescription className="text-xs">Timeline logs scheduled on this calendar cell date.</CardDescription>
            </CardHeader>
            
            <CardContent className="pt-4 flex-1 flex flex-col">
              {selectedDayEvents.length > 0 ? (
                <div className="space-y-3">
                  {selectedDayEvents.map((evt, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-border/50 bg-background/45 flex items-start gap-2.5"
                    >
                      <div className="mt-0.5 shrink-0">
                        {evt.icon}
                      </div>
                      <span className="text-xs font-medium text-foreground leading-relaxed">
                        {evt.title}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="my-auto text-center space-y-2 py-8">
                  <span className="text-xl">☀️</span>
                  <p className="text-xs font-semibold text-muted">No scheduled events</p>
                  <p className="text-[10px] text-muted/80 max-w-xs mx-auto leading-relaxed">
                    No deadlines or study sessions logged on this day. Open your active roadmap to schedule review tasks.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Schedule Tips */}
          <div className="p-4 rounded-2xl bg-secondary/5 border border-secondary/15 space-y-1.5">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Sparkles size={14} className="text-secondary" />
              <span>Calendar Indicators</span>
            </h4>
            <div className="grid gap-1.5 text-[10px] text-muted font-medium pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                <span>Green: Study hours completed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>Red: Task deadline alert</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Gold: Milestone target reached</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
