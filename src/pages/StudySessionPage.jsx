import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  Calendar,
  Sparkles,
  Volume2,
  VolumeX,
  Coffee,
  Brain,
  Award,
  RefreshCw
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useRoadmap } from '../context/RoadmapContext';
import { SEO } from '../components/common/SEO';
import api from '../services/api';

export default function StudySessionPage() {
  const { roadmap, refreshRoadmap } = useRoadmap();
  
  // Timer Mode Settings (times in seconds)
  const MODES = {
    focus: { label: 'Focus Session', time: 25 * 60, icon: <Brain size={18} /> },
    shortBreak: { label: 'Short Break', time: 5 * 60, icon: <Coffee size={18} /> },
    longBreak: { label: 'Long Break', time: 15 * 60, icon: <Coffee size={18} /> }
  };

  const [mode, setMode] = useState('focus');
  const [secondsLeft, setSecondsLeft] = useState(MODES.focus.time);
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Dynamic statistics
  const [todayStudyMinutes, setTodayStudyMinutes] = useState(0);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [weeklyStudyHours, setWeeklyStudyHours] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const timerRef = useRef(null);

  const fetchStats = async () => {
    try {
      const response = await api.get('/analytics');
      if (response.success && response.data) {
        // Today hours is the last element in dailyStudyHours
        const daily = response.data.dailyStudyHours || [];
        const todayObj = daily[daily.length - 1];
        const minutesToday = todayObj ? Math.round(todayObj.hours * 60) : 0;
        setTodayStudyMinutes(minutesToday);
        setWeeklyStudyHours(response.data.totalStudyHours);

        // Approximate sessions count
        setSessionsCompleted(Math.round(minutesToday / 25));
      }
    } catch (err) {
      console.warn("Failed to retrieve timer metrics:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [roadmap]);

  // Sync timer when mode changes
  useEffect(() => {
    setSecondsLeft(MODES[mode].time);
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [mode]);

  // Timer Tick Engine
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, mode]);

  const handleTimerComplete = async () => {
    setIsActive(false);
    
    // Web Audio API beep sound
    if (!isMuted) {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.8);
      } catch (e) {
        console.warn("Audio Context beep failed to play:", e);
      }
    }

    if (mode === 'focus') {
      setTodayStudyMinutes(prev => prev + 25);
      setSessionsCompleted(prev => prev + 1);

      // Submit study session details to backend if active roadmap exists
      if (roadmap && roadmap.id) {
        try {
          await api.post('/study-session', {
            goalId: roadmap.id,
            duration: 25, // 25 minutes Pomodoro focus duration
            topic: roadmap.goal || 'General Focus'
          });
          // Refresh global progress to ensure dashboard stats updates instantly
          await refreshRoadmap();
          await fetchStats();
        } catch (err) {
          console.error("Failed to log study session to backend database", err.message);
        }
      }

      alert("Great job! You completed a 25-minute Focus Session. Time for a short break!");
      setMode('shortBreak');
    } else {
      alert("Break is over! Ready to focus again?");
      setMode('focus');
    }
  };

  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setSecondsLeft(MODES[mode].time);
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Percentage for progress ring
  const progressPercent = ((MODES[mode].time - secondsLeft) / MODES[mode].time) * 100;
  const todayHours = (todayStudyMinutes / 60).toFixed(1);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-pulse">
        <div className="h-8 bg-border/40 w-1/4 rounded-lg" />
        <div className="grid gap-6 md:grid-cols-3">
          <div className="h-48 bg-border/30 rounded-2xl" />
          <div className="md:col-span-2 h-64 bg-border/30 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <SEO title="Study Session" description="Interactive Pomodoro focus timer to improve study velocity and tracking statistics." />

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-display tracking-tight text-foreground animate-in fade-in duration-300">
          Study Session ⏳
        </h1>
        <p className="text-sm text-muted">
          Use the Pomodoro technique to divide your studies into focus intervals and structured breaks.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Side: Session Stats */}
        <div className="md:col-span-1 space-y-4">
          <Card isGlass={true} padding="md" className="border-border/50">
            <CardHeader className="mb-0 pb-2">
              <CardTitle className="text-sm">Session Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div className="p-3.5 rounded-xl border border-border bg-background/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-primary" />
                  <span className="text-xs text-muted">Today's Study Time</span>
                </div>
                <span className="text-sm font-bold text-foreground">{todayHours} hrs</span>
              </div>

              <div className="p-3.5 rounded-xl border border-border bg-background/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-secondary" />
                  <span className="text-xs text-muted">Total Study Hours</span>
                </div>
                <span className="text-sm font-bold text-foreground">{weeklyStudyHours} hrs</span>
              </div>

              <div className="p-3.5 rounded-xl border border-border bg-background/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-amber-500 animate-float" />
                  <span className="text-xs text-muted">Today's Sessions</span>
                </div>
                <span className="text-sm font-bold text-foreground">{sessionsCompleted} sessions</span>
              </div>
            </CardContent>
          </Card>

          {/* Productivity Tip */}
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex gap-3">
            <Sparkles size={16} className="text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-foreground">AI Study Advice</h4>
              <p className="text-[11px] text-muted leading-relaxed">
                Spaced repetition is 40% more effective when combined with focus intervals. Take breaks to let memory consolidation happen.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Focus Timer Ring */}
        <div className="md:col-span-2">
          <Card isGlass={true} padding="lg" className="border-border/50 flex flex-col items-center justify-center text-center shadow-lg relative min-h-[380px]">
            {/* Mode selections */}
            <div className="flex bg-background/60 border border-border p-1 rounded-full mb-8 text-xs font-medium">
              {Object.keys(MODES).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`
                    px-4 py-1.5 rounded-full transition-colors flex items-center gap-1.5
                    ${mode === m ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-foreground'}
                  `}
                >
                  {MODES[m].icon}
                  <span>{MODES[m].label}</span>
                </button>
              ))}
            </div>

            {/* Timer visual ring container */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="50%"
                  cy="50%"
                  r="44%"
                  className="stroke-border/40 fill-none"
                  strokeWidth="6%"
                />
                {/* Foreground Active Progress Ring */}
                <circle
                  cx="50%"
                  cy="50%"
                  r="44%"
                  className="stroke-primary fill-none transition-all duration-300"
                  strokeWidth="6%"
                  strokeDasharray="276"
                  strokeDashoffset={276 - (276 * progressPercent) / 100}
                  strokeLinecap="round"
                />
              </svg>
              {/* Centered Time Count */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight font-display">
                  {formatTime(secondsLeft)}
                </span>
                <span className="text-[10px] text-muted font-bold tracking-widest uppercase mt-1">
                  {MODES[mode].label}
                </span>
              </div>
            </div>

            {/* Controls Row */}
            <div className="flex gap-4 mt-8">
              <Button
                variant={isActive ? 'glass' : 'primary'}
                className="w-32 justify-center py-2.5 shadow-sm"
                onClick={handleStartPause}
              >
                {isActive ? 'Pause' : 'Start'}
              </Button>
              <Button
                variant="outline"
                className="w-12 justify-center"
                onClick={handleReset}
                iconLeft={<RotateCcw size={15} />}
              />
              <Button
                variant="outline"
                className="w-12 justify-center"
                onClick={() => setIsMuted(!isMuted)}
                iconLeft={isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
