import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  CheckCircle,
  Circle,
  HelpCircle,
  Eye,
  SkipForward,
  ChevronDown,
  ChevronUp,
  FileText,
  Video,
  Code,
  GraduationCap,
  Sparkles,
  ArrowLeft,
  X,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { useRoadmap } from '../context/RoadmapContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SEO } from '../components/common/SEO';

export default function RoadmapPage() {
  const {
    roadmap,
    toggleTaskComplete,
    skipTask,
    toggleWeekExpand,
    resetRoadmap
  } = useRoadmap();

  // Resource drawer states
  const [activeTaskResources, setActiveTaskResources] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  if (!roadmap) {
    return (
      <div className="max-w-md mx-auto text-center space-y-6 py-16 animate-in fade-in duration-300">
        <SEO title="Learning Roadmap" description="Track week-by-week learning goals, tasks, and achievements." />
        <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary border border-primary/20 text-3xl animate-bounce">
          🎯
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-display text-foreground">No Active Learning Roadmap</h2>
          <p className="text-sm text-muted max-w-xs mx-auto leading-relaxed">
            Specify your goal, deadlines, and daily hours, and LearnMate AI will generate a structured timeline for you.
          </p>
        </div>
        <div className="pt-2">
          <Link to="/dashboard/goal-setup">
            <Button variant="primary" iconLeft={<Sparkles size={16} />}>
              Create Learning Roadmap
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Opens the resource sidebar drawer
  const openResources = (task) => {
    setActiveTaskResources(task);
    setIsDrawerOpen(true);
  };

  const closeResources = () => {
    setIsDrawerOpen(false);
    // Add timer to prevent content flash during slide animation
    setTimeout(() => setActiveTaskResources(null), 300);
  };

  // Helper to count completed/total tasks per week
  const getWeekStats = (week) => {
    const activeTasks = week.tasks.filter(t => t.status !== 'skipped');
    const completed = activeTasks.filter(t => t.status === 'completed').length;
    return {
      total: activeTasks.length,
      completed,
      percentage: activeTasks.length > 0 ? Math.round((completed / activeTasks.length) * 100) : 0
    };
  };

  return (
    <div className="space-y-8 pb-16 relative">
      <SEO title="Learning Roadmap" description={`Track timeline tasks for: "${roadmap.goal}"`} />
      
      {/* Header section with Reset */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">
            Learning Roadmap 🗺️
          </h1>
          <p className="text-sm text-muted mt-1 leading-snug">
            Targeting: <span className="font-semibold text-foreground">"{roadmap.goal}"</span> | Level: {roadmap.skillLevel}
          </p>
        </div>
        <button
          onClick={resetRoadmap}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-muted hover:text-red-500 hover:bg-red-500/10 border border-border/50 hover:border-red-500/20 transition-all duration-200"
        >
          <RotateCcw size={14} />
          Reset Goal Plan
        </button>
      </div>

      {/* Progress Card Summary */}
      <Card isGlass={true} padding="md" className="border-border/50 bg-primary/5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="text-base font-semibold text-foreground font-display">Roadmap Progress Summary</h3>
            <p className="text-xs text-muted max-w-md">
              Complete tasks within week timeline nodes. Checking items will update your overall statistics instantly.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <span className="text-[10px] font-semibold text-muted tracking-wider uppercase">Completion Rate</span>
              <p className="text-2xl font-bold text-primary font-display">{roadmap.progress}%</p>
            </div>
            <div className="w-24 bg-border/40 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-primary h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${roadmap.progress}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Timeline Core UI */}
      <div className="relative pl-6 sm:pl-8 space-y-6">
        {/* Continuous vertical timeline connector line */}
        <div className="absolute top-4 bottom-4 left-[15px] sm:left-[19px] w-0.5 bg-gradient-to-b from-primary via-secondary to-border/30" />

        {roadmap.weeks.map((week, wIdx) => {
          const stats = getWeekStats(week);
          const isWeekCompleted = stats.percentage === 100 && stats.total > 0;
          
          return (
            <div key={week.id} className="relative group animate-in fade-in duration-300">
              
              {/* Timeline Bullet Node Icon */}
              <div className={`
                absolute -left-[27px] sm:-left-[31px] top-4 z-10 flex items-center justify-center w-6 h-6 rounded-full border shadow-sm transition-all duration-300
                ${isWeekCompleted
                  ? 'bg-secondary border-secondary text-white'
                  : week.isExpanded
                    ? 'bg-primary border-primary text-white scale-110'
                    : 'bg-card border-border text-muted'
                }
              `}>
                {isWeekCompleted ? (
                  <CheckCircle size={14} className="stroke-[3px]" />
                ) : (
                  <span className="text-[9px] font-extrabold">{wIdx + 1}</span>
                )}
              </div>

              {/* Week Card Container */}
              <Card
                isGlass={true}
                padding="none"
                className={`
                  border-border/50 overflow-hidden shadow-sm transition-shadow duration-300 hover:shadow-md
                  ${week.isExpanded ? 'border-primary/25' : ''}
                `}
              >
                {/* Accordion header click to expand */}
                <div
                  onClick={() => toggleWeekExpand(week.id)}
                  className="p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-card/40 transition-colors"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-sm sm:text-base font-bold font-display text-foreground truncate">
                        {week.title}
                      </h3>
                      {stats.total > 0 && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                          isWeekCompleted
                            ? 'bg-secondary/15 border-secondary/25 text-secondary'
                            : 'bg-primary/10 border-primary/20 text-primary'
                        }`}>
                          {stats.completed}/{stats.total} Tasks ({stats.percentage}%)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted/80 line-clamp-1 truncate max-w-xl">
                      {week.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-muted font-medium bg-muted/10 px-2 py-0.5 rounded border border-border/30">
                      Est: {week.tasks.reduce((acc, t) => acc + (t.status !== 'skipped' ? parseInt(t.duration) || 0 : 0), 0)} mins
                    </span>
                    <span className="text-muted hover:text-foreground">
                      {week.isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  </div>
                </div>

                {/* Week Progress Bar inside Header */}
                <div className="w-full bg-border/20 h-1">
                  <div
                    className={`h-1 transition-all duration-300 ${isWeekCompleted ? 'bg-secondary' : 'bg-primary'}`}
                    style={{ width: `${stats.percentage}%` }}
                  />
                </div>

                {/* Tasks List (Expands accordion) */}
                {week.isExpanded && (
                  <div className="p-5 bg-card/10 border-t border-border/30 space-y-3.5">
                    {week.tasks.map((task) => {
                      const isCompleted = task.status === 'completed';
                      const isSkipped = task.status === 'skipped';
                      
                      return (
                        <div
                          key={task.id}
                          className={`
                            flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all duration-200
                            ${isCompleted
                              ? 'bg-secondary/5 border-secondary/20 dark:bg-secondary/10'
                              : isSkipped
                                ? 'bg-muted/5 border-border/50 opacity-55'
                                : 'bg-background/45 border-border hover:border-primary/20 hover:bg-background/80'
                            }
                          `}
                        >
                          {/* Task Checkbox & Info */}
                          <div className="flex items-start gap-3 min-w-0">
                            <button
                              onClick={() => toggleTaskComplete(week.id, task.id)}
                              disabled={isSkipped}
                              className={`mt-0.5 shrink-0 transition-transform active:scale-90 ${
                                isSkipped ? 'cursor-not-allowed opacity-50' : ''
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle className="text-secondary w-5 h-5 fill-secondary/15" />
                              ) : (
                                <Circle className="text-muted/60 hover:text-primary w-5 h-5" />
                              )}
                            </button>

                            <div className="space-y-1 min-w-0">
                              <span className={`text-xs sm:text-sm font-medium leading-tight block text-foreground truncate ${
                                isCompleted ? 'text-foreground/70' : ''
                                } ${isSkipped ? 'line-through text-muted' : ''}
                              `}>
                                {task.title}
                              </span>
                              <div className="flex items-center gap-2 flex-wrap text-[10px] text-muted">
                                <span className="bg-muted/10 border border-border/30 px-1.5 py-0.5 rounded font-mono font-medium">
                                  ⏱️ {task.duration}
                                </span>
                                
                                {/* Badges based on type */}
                                {task.type === 'theory' && (
                                  <span className="flex items-center gap-1 bg-indigo-500/10 text-indigo-500 border border-indigo-500/15 px-1.5 py-0.5 rounded font-semibold">
                                    <FileText size={10} /> Theory
                                  </span>
                                )}
                                {task.type === 'practical' && (
                                  <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/15 px-1.5 py-0.5 rounded font-semibold">
                                    <Code size={10} /> Sandbox Lab
                                  </span>
                                )}
                                {task.type === 'quiz' && (
                                  <span className="flex items-center gap-1 bg-amber-500/10 text-amber-500 border border-amber-500/15 px-1.5 py-0.5 rounded font-semibold">
                                    <GraduationCap size={10} /> Quiz
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Task Action Trigger Panel */}
                          <div className="flex items-center gap-2 sm:shrink-0 self-end sm:self-center">
                            {task.resources && task.resources.length > 0 && (
                              <Button
                                variant="glass"
                                size="sm"
                                onClick={() => openResources(task)}
                                iconLeft={<Eye size={12} />}
                                className="text-[11px] rounded-lg py-1.5"
                              >
                                Resources
                              </Button>
                            )}
                            
                            <button
                              onClick={() => skipTask(week.id, task.id)}
                              title={isSkipped ? "Restore Task" : "Skip Task"}
                              className={`
                                p-1.5 rounded-lg border border-border/50 hover:bg-card text-muted transition-colors
                                ${isSkipped ? 'bg-primary/10 text-primary border-primary/20' : 'hover:text-amber-500'}
                              `}
                            >
                              <SkipForward size={13} />
                            </button>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>

            </div>
          );
        })}
      </div>

      {/* Sliding Resources Drawer (Right Side Drawer Overlay) */}
      {isDrawerOpen && activeTaskResources && (
        <>
          {/* Backdrop overlay filter */}
          <div
            className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={closeResources}
          />
          
          <div
            className={`
              fixed top-0 bottom-0 right-0 z-50 w-full sm:w-[420px] bg-card border-l border-border shadow-2xl p-6 flex flex-col justify-between
              animate-in slide-in-from-right duration-300
            `}
          >
            {/* Drawer Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <div className="flex items-center gap-2 text-primary font-display font-semibold text-sm">
                  <Sparkles size={16} />
                  <span>Syllabus Resources</span>
                </div>
                <button
                  onClick={closeResources}
                  className="p-1.5 rounded-xl border border-border/40 text-muted hover:text-foreground hover:bg-muted/15"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-muted tracking-wider uppercase bg-muted/10 px-2 py-0.5 border border-border/20 rounded">
                  {activeTaskResources.type} task
                </span>
                <h4 className="text-base font-bold text-foreground font-display leading-snug">
                  {activeTaskResources.title}
                </h4>
                <p className="text-xs text-muted leading-relaxed">
                  Carefully vetted articles and tools to help you complete this syllabus task module.
                </p>
              </div>

              {/* Resource list links */}
              <div className="space-y-3 pt-4">
                {activeTaskResources.resources.map((res, index) => (
                  <a
                    key={index}
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-background/40 hover:bg-primary/5 hover:border-primary/20 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-card border border-border group-hover:scale-105 transition-transform text-muted group-hover:text-primary">
                        {res.name.toLowerCase().includes('video') ? <Video size={14} /> : <FileText size={14} />}
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-foreground leading-none">{res.name}</p>
                        <p className="text-[10px] text-muted mt-1">Visit reference site</p>
                      </div>
                    </div>
                    <ExternalLink size={12} className="text-muted group-hover:text-primary transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="border-t border-border/50 pt-4 flex gap-3">
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => {
                  // Simply trigger task completion from drawer
                  const currentWeek = roadmap.weeks.find(w => w.tasks.some(t => t.id === activeTaskResources.id));
                  if (currentWeek) {
                    toggleTaskComplete(currentWeek.id, activeTaskResources.id);
                  }
                  closeResources();
                }}
              >
                Mark as Complete
              </Button>
              <Button variant="outline" className="px-4" onClick={closeResources}>
                Close
              </Button>
            </div>

          </div>
        </>
      )}

    </div>
  );
}
