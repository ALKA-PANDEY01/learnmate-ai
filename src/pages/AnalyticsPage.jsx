import React, { useState, useEffect } from 'react';
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
  CheckCircle2,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { useRoadmap } from '../context/RoadmapContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { SEO } from '../components/common/SEO';
import api from '../services/api';

export default function AnalyticsPage() {
  const { roadmap } = useRoadmap();
  
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/analytics');
      if (response.success && response.data) {
        setAnalytics(response.data);
      }
    } catch (err) {
      console.warn("Failed to fetch analytics from DB:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [roadmap]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-pulse">
        <div className="h-8 bg-border/40 w-1/4 rounded-lg" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="h-24 border-border/40" />
          ))}
        </div>
      </div>
    );
  }

  // Fallback defaults if no study logs yet
  const totalHours = analytics ? analytics.totalStudyHours : 0;
  const avgFocus = analytics ? analytics.averageFocusTime : 0;
  const completionRate = analytics ? analytics.completionRate : 0;
  const streakVal = analytics ? analytics.currentStreak : 0;
  const quizAvg = analytics ? analytics.quizAverage : 0;

  const weeklyHoursData = analytics && analytics.weeklyStudyHours?.length > 0
    ? analytics.weeklyStudyHours.map(w => ({ name: w.week, hours: w.hours }))
    : [
        { name: 'Week 1', hours: 0 },
        { name: 'Week 2', hours: 0 },
        { name: 'Week 3', hours: 0 },
        { name: 'Week 4', hours: 0 }
      ];

  const dailyHoursData = analytics && analytics.dailyStudyHours?.length > 0
    ? analytics.dailyStudyHours.map(d => ({ name: d.day, hours: d.hours }))
    : [
        { name: 'Mon', hours: 0 },
        { name: 'Tue', hours: 0 },
        { name: 'Wed', hours: 0 },
        { name: 'Thu', hours: 0 },
        { name: 'Fri', hours: 0 },
        { name: 'Sat', hours: 0 },
        { name: 'Sun', hours: 0 }
      ];

  // Map strong/weak topics to Radar chart data representation
  const topicProgressData = [
    { subject: 'Topic Strengths', value: quizAvg || 50, fullMark: 100 },
    { subject: 'Focus Consistency', value: totalHours > 0 ? 85 : 10, fullMark: 100 },
    { subject: 'Completion Speed', value: completionRate || 10, fullMark: 100 },
    { subject: 'Weak Topic Mitigation', value: analytics && analytics.weakTopics?.length === 0 ? 90 : 40, fullMark: 100 }
  ];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      <SEO title="Learning Analytics" description="Detailed insights and metrics tracing study durations, quiz parameters, and syllabus progress." />

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-display tracking-tight text-foreground flex items-center gap-2">
          <span>Learning Analytics</span>
          <Activity className="text-primary" size={24} />
        </h1>
        <p className="text-sm text-muted mt-1 leading-snug">
          Understand your learning velocity, test results histories, and topic-wise strengths.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Study Hours", value: `${totalHours} hrs`, desc: "Logged focus sessions", icon: <Clock size={16} />, color: "text-primary" },
          { title: "Avg Session Duration", value: `${avgFocus} mins`, desc: "Focus duration blocks", icon: <Activity size={16} />, color: "text-secondary" },
          { title: "Completion Rate", value: `${completionRate}%`, desc: "Of active roadmap syllabus", icon: <TrendingUp size={16} />, color: "text-indigo-500" },
          { title: "Active Streak", value: `${streakVal} days`, desc: "Current study streak", icon: <Trophy size={16} />, color: "text-amber-500" }
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

      {totalHours === 0 && completionRate === 0 ? (
        <div className="glass-card rounded-2xl p-16 border border-border/50 text-center space-y-4">
          <div className="text-4xl">📊</div>
          <p className="text-sm font-semibold text-muted">No focus logs generated yet.</p>
          <p className="text-xs text-muted/80 max-w-sm mx-auto">Start a Pomodoro study session or log milestone quizzes to trigger dynamic performance graphs!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Daily Hours Bar */}
          <Card isGlass={true} className="border-border/50">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-foreground">Daily Study Hours (Last 7 Days)</CardTitle>
              <CardDescription className="text-xs">Hours spent on focus timer blocks.</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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

          {/* Weekly Hours Bar */}
          <Card isGlass={true} className="border-border/50">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-foreground">Weekly Study Hours (Last 4 Weeks)</CardTitle>
              <CardDescription className="text-xs">Aggregate hours logged week-by-week.</CardDescription>
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
                  <Bar dataKey="hours" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Radar Topic Strength Chart */}
          <Card isGlass={true} className="border-border/50">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-foreground">Dynamic Learning Profile</CardTitle>
              <CardDescription className="text-xs">Radial strength mapping across target study parameters.</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex justify-center">
              <div className="w-full h-full max-w-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={topicProgressData}>
                    <PolarGrid stroke="var(--border)" opacity={0.3} />
                    <PolarAngleAxis dataKey="subject" stroke="var(--muted)" fontSize={9} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="var(--border)" tick={false} />
                    <Radar name="Strength" dataKey="value" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Strength / Weakness list */}
          <Card isGlass={true} className="border-border/50">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-foreground">Topic-wise Breakdown</CardTitle>
              <CardDescription className="text-xs">Strengths and adaptive focus priorities deduced by AI.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Strong Concepts ✓</span>
                <div className="flex flex-wrap gap-1.5">
                  {analytics && analytics.strongTopics?.length > 0 ? (
                    analytics.strongTopics.map((topic, i) => (
                      <span key={i} className="text-xs bg-emerald-500/10 text-emerald-500 border border-emerald-500/25 px-2.5 py-1 rounded-xl">
                        {topic}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted">Complete quizzes with score &ge; 80% to list strengths.</span>
                  )}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-border/40">
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Focus Areas (Weak Topics) 🚨</span>
                <div className="flex flex-wrap gap-1.5">
                  {analytics && analytics.weakTopics?.length > 0 ? (
                    analytics.weakTopics.map((topic, i) => (
                      <span key={i} className="text-xs bg-red-500/10 text-red-500 border border-red-500/25 px-2.5 py-1 rounded-xl">
                        {topic}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted">No weak topics logged. Awesome job!</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
