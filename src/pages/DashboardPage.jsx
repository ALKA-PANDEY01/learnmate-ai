import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  CheckSquare,
  Clock,
  Calendar,
  Compass,
  Trophy,
  Play,
  Settings,
  Sparkles,
  BookOpen,
  ArrowRight,
  GraduationCap,
  PlusCircle,
  HelpCircle,
  X
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useRoadmap } from '../context/RoadmapContext';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SEO } from '../components/common/SEO';

export default function DashboardPage() {
  const { user } = useAuth();
  const { roadmap, toggleTaskComplete } = useRoadmap();
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Fallback default values if no roadmap is generated
  const activeRoadmap = roadmap || {
    goal: "No active goal. Generate a plan to get started!",
    skillLevel: "Beginner",
    deadline: "N/A",
    hoursPerDay: 1.5,
    learningStyle: "Visual",
    progress: 0,
    streak: 0,
    hoursStudied: 0,
    milestone: "Initialize your learning workspace",
    weeks: []
  };

  // Mock task calculations
  let totalTasks = 0;
  let completedTasks = 0;
  let pendingTasks = 0;

  if (roadmap) {
    roadmap.weeks.forEach(w => {
      w.tasks.forEach(t => {
        if (t.status !== 'skipped') {
          totalTasks++;
          if (t.status === 'completed') completedTasks++;
          else pendingTasks++;
        }
      });
    });
  } else {
    // default stubs
    totalTasks = 10;
    completedTasks = 3;
    pendingTasks = 7;
  }

  // 1. Weekly Study Hours Chart Data
  const weeklyHoursData = [
    { day: 'Mon', hours: roadmap ? 1.8 : 1.2 },
    { day: 'Tue', hours: roadmap ? 2.5 : 0.8 },
    { day: 'Wed', hours: roadmap ? 3.0 : 1.5 },
    { day: 'Thu', hours: roadmap ? 1.5 : 2.0 },
    { day: 'Fri', hours: roadmap ? 2.2 : 0.5 },
    { day: 'Sat', hours: roadmap ? 4.0 : 3.2 },
    { day: 'Sun', hours: roadmap ? activeRoadmap.hoursStudied > 15 ? 3.5 : 2.0 : 0.0 },
  ];

  // 2. Progress Over Time Data
  const progressOverTimeData = [
    { name: 'Week 1', progress: roadmap ? Math.min(activeRoadmap.progress, 25) : 0 },
    { name: 'Week 2', progress: roadmap ? Math.min(activeRoadmap.progress, 50) : 0 },
    { name: 'Week 3', progress: roadmap ? Math.min(activeRoadmap.progress, 75) : 0 },
    { name: 'Week 4', progress: roadmap ? activeRoadmap.progress : 0 },
  ];

  // 3. Quiz Performance Data
  const quizPerformanceData = [
    { quiz: 'Quiz 1', score: 75 },
    { quiz: 'Quiz 2', score: 85 },
    { quiz: 'Quiz 3', score: 90 },
    { quiz: 'Quiz 4', score: 82 },
  ];

  // 4. Task Completion Pie Chart Data
  const pieData = [
    { name: 'Completed', value: completedTasks },
    { name: 'Pending', value: pendingTasks },
  ];
  
  const COLORS = ['#10b981', '#6366f1']; // Emerald (Completed), Indigo (Pending)

  // Mock quiz questions
  const handleQuizSubmit = (e) => {
    e.preventDefault();
    setQuizSubmitted(true);
  };

  const resetQuiz = () => {
    setQuizAnswer(null);
    setQuizSubmitted(false);
    setShowQuizModal(false);
  };

  return (
    <div className="space-y-8 pb-10">
      <SEO title="Dashboard" description="Visualize study progress, analyze task metrics, and explore learning actions." />
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">
            Welcome back, {user?.name || 'Learner'} 👋
          </h1>
          <p className="text-sm text-muted mt-1">
            {roadmap ? `You are active on: "${roadmap.goal}"` : "Set your learning goals to generate a custom syllabus path."}
          </p>
        </div>
        {!roadmap && (
          <Link to="/dashboard/goal-setup" className="shrink-0">
            <Button iconLeft={<PlusCircle size={16} />} variant="primary">
              Setup Your Goal
            </Button>
          </Link>
        )}
      </div>

      {/* Goal Status Warning if empty */}
      {!roadmap && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 text-xs font-medium flex items-center justify-between gap-4 animate-pulse-slow">
          <div className="flex items-center gap-2">
            <Compass size={16} />
            <span>You don't have an active learning roadmap yet. Setup a goal to unlock custom timelines!</span>
          </div>
          <Link to="/dashboard/goal-setup" className="underline hover:opacity-80">
            Generate Plan Now
          </Link>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: Overall Progress */}
        <Card isGlass={true} padding="md" hoverEffect={true}>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted tracking-wider uppercase">Overall Progress</span>
              <p className="text-3xl font-bold font-display tracking-tight text-foreground mt-1">
                {activeRoadmap.progress}%
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Compass size={18} />
            </div>
          </div>
          <div className="w-full bg-border/40 rounded-full h-2 mt-4 overflow-hidden">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${activeRoadmap.progress}%` }}
            />
          </div>
          <p className="text-[10px] text-muted mt-2">
            {roadmap ? `${completedTasks} of ${totalTasks} tasks completed` : "Create a plan to track tasks"}
          </p>
        </Card>

        {/* Card 2: Learning Streak */}
        <Card isGlass={true} padding="md" hoverEffect={true}>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted tracking-wider uppercase">Learning Streak</span>
              <p className="text-3xl font-bold font-display tracking-tight text-secondary mt-1">
                {activeRoadmap.streak} Days
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary border border-secondary/20">
              <Flame size={18} className={activeRoadmap.streak > 0 ? "animate-pulse" : ""} />
            </div>
          </div>
          <p className="text-[10px] text-muted mt-6">
            {activeRoadmap.streak > 0 ? "Daily study streak active. Keep it up!" : "No streak active. Start learning today!"}
          </p>
        </Card>

        {/* Card 3: Today's Tasks */}
        <Card isGlass={true} padding="md" hoverEffect={true}>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted tracking-wider uppercase">Today's Tasks</span>
              <p className="text-3xl font-bold font-display tracking-tight text-foreground mt-1">
                {roadmap ? `${completedTasks}/${totalTasks}` : "0/0"}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
              <CheckSquare size={18} />
            </div>
          </div>
          <p className="text-[10px] text-muted mt-6">
            {roadmap ? `${pendingTasks} remaining syllabus nodes.` : "Generate roadmap tasks."}
          </p>
        </Card>

        {/* Card 4: Upcoming Deadline */}
        <Card isGlass={true} padding="md" hoverEffect={true}>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted tracking-wider uppercase">Upcoming Deadline</span>
              <p className="text-lg font-bold text-foreground mt-1 truncate max-w-[190px]">
                {roadmap ? activeRoadmap.deadline : 'N/A'}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
              <Calendar size={18} />
            </div>
          </div>
          <p className="text-[10px] text-muted mt-6">
            {roadmap ? "Target date to finish syllabus modules." : "No active deadlines."}
          </p>
        </Card>

        {/* Card 5: Current Milestone */}
        <Card isGlass={true} padding="md" hoverEffect={true}>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted tracking-wider uppercase">Current Milestone</span>
              <p className="text-sm font-semibold text-foreground mt-2 line-clamp-2 leading-snug">
                {activeRoadmap.milestone}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Trophy size={18} />
            </div>
          </div>
          <p className="text-[10px] text-muted mt-4">
            {roadmap ? "Milestone 1: Complete Week 1 modules." : "Define your milestone goals."}
          </p>
        </Card>

        {/* Card 6: Hours Studied */}
        <Card isGlass={true} padding="md" hoverEffect={true}>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted tracking-wider uppercase">Hours Studied</span>
              <p className="text-3xl font-bold font-display tracking-tight text-foreground mt-1">
                {activeRoadmap.hoursStudied} hrs
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Clock size={18} />
            </div>
          </div>
          <p className="text-[10px] text-muted mt-6">
            Average {(activeRoadmap.hoursStudied / 7).toFixed(1)} hrs per day this week.
          </p>
        </Card>
      </div>

      {/* Quick Actions Panel */}
      <Card isGlass={true} className="border-border/50">
        <CardHeader className="mb-0 pb-2">
          <CardTitle className="text-base">Quick Learning Actions</CardTitle>
          <CardDescription className="text-xs">Quickly navigate to your active modules or trigger tools.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 pt-2">
            <Link to={roadmap ? "/dashboard/roadmap" : "/dashboard/goal-setup"} className="w-full">
              <Button
                variant="primary"
                className="w-full text-xs justify-between rounded-xl py-3 shadow-md"
                iconRight={<Play size={14} />}
              >
                Continue Learning
              </Button>
            </Link>

            <Link to="/dashboard/goal-setup" className="w-full">
              <Button
                variant="glass"
                className="w-full text-xs justify-between rounded-xl py-3"
                iconRight={<PlusCircle size={14} className="text-primary" />}
              >
                Generate Plan
              </Button>
            </Link>

            <Link to={roadmap ? "/dashboard/roadmap" : "/dashboard/goal-setup"} className="w-full">
              <Button
                variant="outline"
                className="w-full text-xs justify-between rounded-xl py-3"
                iconRight={<BookOpen size={14} className="text-secondary" />}
              >
                Start Study Session
              </Button>
            </Link>

            <Button
              variant="outline"
              className="w-full text-xs justify-between rounded-xl py-3"
              onClick={() => setShowQuizModal(true)}
              iconRight={<HelpCircle size={14} className="text-amber-500" />}
            >
              Take AI Quiz
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts Visualization Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Chart 1: Weekly Study Hours */}
        <Card isGlass={true} className="border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-foreground">Weekly Study Hours</CardTitle>
            <CardDescription className="text-xs">Daily logged study durations (hours) mapped across the week.</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.3} />
                <XAxis dataKey="day" stroke="var(--muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--muted)" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: 'var(--foreground)'
                  }}
                />
                <Bar dataKey="hours" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 2: Progress Over Time */}
        <Card isGlass={true} className="border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-foreground">Progress Over Time</CardTitle>
            <CardDescription className="text-xs">Incremental syllabus completion rate (%) mapped week-over-week.</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressOverTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.3} />
                <XAxis dataKey="name" stroke="var(--muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--muted)" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: 'var(--foreground)'
                  }}
                />
                <Area type="monotone" dataKey="progress" stroke="var(--secondary)" strokeWidth={2} fillOpacity={1} fill="url(#colorProgress)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 3: Quiz Performance */}
        <Card isGlass={true} className="border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-foreground">Quiz Scores history</CardTitle>
            <CardDescription className="text-xs">Grade marks (%) scored across the last four syllabus validation tests.</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={quizPerformanceData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.3} />
                <XAxis dataKey="quiz" stroke="var(--muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--muted)" fontSize={11} tickLine={false} domain={[50, 100]} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: 'var(--foreground)'
                  }}
                />
                <Line type="monotone" dataKey="score" stroke="var(--color-primary)" strokeWidth={2.5} activeDot={{ r: 6 }} dot={{ strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 4: Task Completion Distribution */}
        <Card isGlass={true} className="border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-foreground">Task Completion Status</CardTitle>
            <CardDescription className="text-xs">Syllabus nodes broken down by completed vs pending count ratios.</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex flex-col justify-center">
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      fontSize: '11px',
                      color: 'var(--foreground)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 text-xs mt-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10b981' }} />
                <span className="text-muted">Completed ({completedTasks})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#6366f1' }} />
                <span className="text-muted">Pending ({pendingTasks})</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Quiz Modal */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-lg shadow-2xl relative border-border/80" isGlass={true} padding="lg">
            <button
              onClick={resetQuiz}
              className="absolute top-4 right-4 p-2 rounded-xl hover:bg-card border border-border/30 text-muted hover:text-foreground"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-amber-500 w-5 h-5 animate-pulse" />
              <h3 className="text-lg font-bold font-display text-foreground">AI Flash Quiz</h3>
            </div>

            {!quizSubmitted ? (
              <form onSubmit={handleQuizSubmit} className="space-y-4">
                <p className="text-sm font-medium text-foreground leading-relaxed">
                  Which hook should you prioritize to memoize an expensive object evaluation in React?
                </p>
                <div className="space-y-2">
                  {[
                    { key: 'A', text: 'useCallback' },
                    { key: 'B', text: 'useMemo' },
                    { key: 'C', text: 'useRef' },
                    { key: 'D', text: 'useEffect' }
                  ].map((opt) => (
                    <label
                      key={opt.key}
                      className={`
                        flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all duration-200
                        ${quizAnswer === opt.key
                          ? 'border-primary bg-primary/5 text-primary font-semibold'
                          : 'border-border/60 hover:bg-card/75 text-muted hover:text-foreground'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="quiz-opt"
                        value={opt.key}
                        checked={quizAnswer === opt.key}
                        onChange={() => setQuizAnswer(opt.key)}
                        className="sr-only"
                      />
                      <span className={`w-5 h-5 rounded-lg border text-[10px] font-bold flex items-center justify-center shrink-0 ${
                        quizAnswer === opt.key ? 'bg-primary text-white border-primary' : 'border-border bg-background'
                      }`}>
                        {opt.key}
                      </span>
                      <span>{opt.text}</span>
                    </label>
                  ))}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={resetQuiz}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" disabled={!quizAnswer}>
                    Submit Answer
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-center py-4">
                <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xl font-bold">
                  {quizAnswer === 'B' ? '✓' : '✗'}
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-foreground">
                    {quizAnswer === 'B' ? 'Correct Answer! 🎉' : 'Incorrect Answer'}
                  </h4>
                  <p className="text-xs text-muted max-w-sm mx-auto leading-relaxed">
                    {quizAnswer === 'B'
                      ? 'useMemo returns a memoized value of an expensive evaluation, recalculating it only when dependencies alter.'
                      : 'Incorrect. useRef stores reference objects, and useCallback memoizes function instances. useMemo should be utilized for objects.'}
                  </p>
                </div>
                <div className="pt-2">
                  <Button size="sm" onClick={resetQuiz}>
                    Close Quiz
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
