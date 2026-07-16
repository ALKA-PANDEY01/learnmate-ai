import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line
} from 'recharts';
import {
  Clock,
  TrendingUp,
  Brain,
  Calendar,
  Sparkles,
  Trophy,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { useRoadmap } from '../context/RoadmapContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { SEO } from '../components/common/SEO';

export default function AnalyticsPage() {
  const { roadmap } = useRoadmap();

  // Fallback defaults
  const activeHours = roadmap ? roadmap.hoursStudied : 14.5;
  const activeProgress = roadmap ? roadmap.progress : 20;

  // 1. Weekly hours data
  const weeklyHoursData = [
    { name: 'Mon', hours: 2.1 },
    { name: 'Tue', hours: 1.5 },
    { name: 'Wed', hours: 3.2 },
    { name: 'Thu', hours: 0.8 },
    { name: 'Fri', hours: 2.5 },
    { name: 'Sat', hours: 4.4 },
    { name: 'Sun', hours: 1.8 }
  ];

  // 2. Monthly progress timeline data
  const monthlyProgressData = [
    { name: 'Week 1', progress: Math.min(activeProgress, 25) },
    { name: 'Week 2', progress: Math.min(activeProgress, 50) },
    { name: 'Week 3', progress: Math.min(activeProgress, 75) },
    { name: 'Week 4', progress: activeProgress }
  ];

  // 3. Topic progress data (Radar style topics)
  const topicProgressData = [
    { subject: 'React v19', value: 85, fullMark: 100 },
    { subject: 'Tailwind v4', value: 92, fullMark: 100 },
    { subject: 'API Interceptors', value: 60, fullMark: 100 },
    { subject: 'Route Guards', value: 75, fullMark: 100 },
    { subject: 'Build Tools', value: 45, fullMark: 100 }
  ];

  // 4. Quiz Trend scores
  const quizTrendData = [
    { quiz: 'Test 1', score: 72 },
    { quiz: 'Test 2', score: 85 },
    { quiz: 'Test 3', score: 94 },
    { quiz: 'Test 4', score: 80 },
    { quiz: 'Test 5', score: 88 }
  ];

  // 5. Heatmap contributions: 7 rows (Mon-Sun) by 18 columns.
  // Shading is based on index or random mock values
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const columnsCount = 18;
  
  // Static seed matrix matching consistency
  const heatmapData = [
    [2, 0, 4, 3, 1, 0, 3, 2, 4, 1, 0, 2, 3, 4, 1, 0, 2, 3], // Mon
    [0, 1, 2, 0, 3, 4, 1, 0, 2, 3, 4, 1, 0, 3, 2, 4, 1, 0], // Tue
    [3, 4, 1, 0, 2, 3, 4, 1, 0, 2, 3, 4, 1, 0, 3, 2, 4, 1], // Wed
    [1, 0, 2, 3, 4, 1, 0, 3, 2, 4, 1, 0, 2, 3, 4, 1, 0, 2], // Thu
    [2, 3, 4, 1, 0, 2, 3, 4, 1, 0, 2, 3, 4, 1, 0, 2, 3, 4], // Fri
    [4, 1, 0, 2, 3, 4, 1, 0, 2, 3, 4, 1, 0, 3, 2, 4, 1, 0], // Sat
    [0, 2, 3, 4, 1, 0, 3, 2, 4, 1, 0, 2, 3, 4, 1, 0, 2, 3]  // Sun
  ];

  // Shading colors mapper
  const getShadeColor = (val) => {
    switch (val) {
      case 0: return 'bg-border/20 dark:bg-border/5'; // zero study
      case 1: return 'bg-emerald-500/20'; // light study (15m)
      case 2: return 'bg-emerald-500/40'; // average study (30m)
      case 3: return 'bg-emerald-500/75'; // high study (60m)
      case 4: return 'bg-emerald-500'; // intense study (90m+)
      default: return 'bg-border/20';
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      <SEO title="Learning Analytics" description="Detailed insights and metrics tracing study durations, quiz parameters, and syllabus progress." />

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">
          Learning Analytics 📊
        </h1>
        <p className="text-sm text-muted mt-1 leading-snug">
          Understand your learning velocity, test results histories, and topic-wise strengths.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Study Hours", value: `${activeHours} hrs`, desc: "Logged focus minutes", icon: <Clock size={16} />, color: "text-primary" },
          { title: "Average Daily Focus", value: "2.1 hrs", desc: "Monitored across 7 days", icon: <Activity size={16} />, color: "text-secondary" },
          { title: "Completion Rate", value: `${activeProgress}%`, desc: "Of active roadmap syllabus", icon: <TrendingUp size={16} />, color: "text-indigo-500" },
          { title: "Quizzes Taken", value: roadmap ? "4 tests" : "0 tests", desc: "Concept validations tests", icon: <Brain size={16} />, color: "text-amber-500" }
        ].map((stat, idx) => (
          <Card key={idx} isGlass={true} padding="md" hoverEffect={true}>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-muted tracking-wider uppercase">{stat.title}</span>
                <p className={`text-2xl font-bold font-display tracking-tight mt-1 ${stat.color}`}>{stat.value}</p>
              </div>
              <div className="p-2.5 rounded-xl border border-border/40 bg-card/65 text-muted shrink-0">
                {stat.icon}
              </div>
            </div>
            <p className="text-[10px] text-muted mt-4 font-semibold">{stat.desc}</p>
          </Card>
        ))}
      </div>

      {/* Learning Heatmap Consistency Card */}
      <Card isGlass={true} className="border-border/50">
        <CardHeader className="mb-0 pb-2">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Calendar size={15} className="text-primary" />
            <span>Learning Consistency Heatmap</span>
          </CardTitle>
          <CardDescription className="text-xs">Visualize your daily study consistency. Darker cells represent longer focus sessions.</CardDescription>
        </CardHeader>
        <CardContent className="pt-4 overflow-x-auto select-none">
          <div className="min-w-[500px] flex gap-2">
            {/* Row index labels */}
            <div className="grid grid-rows-7 text-[10px] text-muted font-semibold leading-relaxed pr-2 pt-1 gap-1">
              {daysOfWeek.map((day, idx) => (
                <span key={day} className={idx % 2 === 0 ? '' : 'opacity-0'}>{day}</span>
              ))}
            </div>

            {/* Grid of nodes */}
            <div className="flex-1 grid grid-flow-col grid-rows-7 gap-1">
              {heatmapData.map((row, rIdx) => 
                row.map((cellVal, cIdx) => (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    title={`Day status: ${cellVal * 25} minutes focus`}
                    className={`w-3.5 h-3.5 rounded-[4px] border border-border/20 transition-all hover:scale-110 cursor-pointer ${getShadeColor(cellVal)}`}
                  />
                ))
              )}
            </div>
          </div>
          
          {/* Heatmap Legend */}
          <div className="flex items-center gap-2 text-[10px] text-muted font-medium mt-4 justify-end">
            <span>Less</span>
            <div className="w-2.5 h-2.5 rounded bg-border/20 dark:bg-border/5 border border-border/25" />
            <div className="w-2.5 h-2.5 rounded bg-emerald-500/20" />
            <div className="w-2.5 h-2.5 rounded bg-emerald-500/40" />
            <div className="w-2.5 h-2.5 rounded bg-emerald-500/75" />
            <div className="w-2.5 h-2.5 rounded bg-emerald-500" />
            <span>More</span>
          </div>
        </CardContent>
      </Card>

      {/* Recharts Core Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Weekly Hours Bar */}
        <Card isGlass={true} className="border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-foreground">Weekly Study Hours</CardTitle>
            <CardDescription className="text-xs">Hours spent on focus timer blocks across the week.</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.3} />
                <XAxis dataKey="name" stroke="var(--muted)" fontSize={11} tickLine={false} />
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

        {/* Monthly Progress Line */}
        <Card isGlass={true} className="border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-foreground">Monthly Progress Timeline</CardTitle>
            <CardDescription className="text-xs">Overall completion percentages mapped week-by-week.</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyProgressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="analyticsProgressGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
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
                <Area type="monotone" dataKey="progress" stroke="var(--primary)" strokeWidth={2.5} fillOpacity={1} fill="url(#analyticsProgressGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quiz Scores Trend Line */}
        <Card isGlass={true} className="border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-foreground">Quiz Scores History</CardTitle>
            <CardDescription className="text-xs">Scores (%) obtained across successive diagnostic quizzes.</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={quizTrendData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
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
                <Line type="monotone" dataKey="score" stroke="var(--color-secondary)" strokeWidth={2.5} dot={{ strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Radar Topic Strength Chart */}
        <Card isGlass={true} className="border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-foreground">Topic-wise Syllabus Progress</CardTitle>
            <CardDescription className="text-xs">Radial strength mapping across target study modules.</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex justify-center">
            <div className="w-full h-full max-w-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={topicProgressData}>
                  <PolarGrid stroke="var(--border)" opacity={0.3} />
                  <PolarAngleAxis dataKey="subject" stroke="var(--muted)" fontSize={9} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="var(--border)" tick={false} />
                  <Radar name="Progress" dataKey="value" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
