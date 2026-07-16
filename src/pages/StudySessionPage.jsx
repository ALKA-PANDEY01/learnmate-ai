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
  Award
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useRoadmap } from '../context/RoadmapContext';
import { SEO } from '../components/common/SEO';

export default function StudySessionPage() {
  const { roadmap } = useRoadmap();
  
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
  const [todayStudyMinutes, setTodayStudyMinutes] = useState(115); // Mock initial studied minutes
  const [sessionsCompleted, setSessionsCompleted] = useState(3);
  
  const timerRef = useRef(null);

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
            // Timer finished
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
  }, [isActive]);

  const handleTimerComplete = () => {
    setIsActive(false);
    if (!isMuted) {
      try {
        // Trigger generic web audio API beep so it works out-of-the-box without asset files
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

  // Format seconds to MM:SS
  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Percentage for progress ring calculations
  const progressPercent = ((MODES[mode].time - secondsLeft) / MODES[mode].time) * 100;

  const weeklyStudyHours = roadmap ? roadmap.hoursStudied : 14.5;
  const todayHours = (todayStudyMinutes / 60).toFixed(1);

  return (
    <div className="space-y-8 pb-10">
      <SEO title="Study Session" description="Interactive Pomodoro focus timer to improve study velocity and tracking statistics." />

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">
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
                  <span className="text-xs text-muted">Weekly Study Time</span>
                </div>
                <span className="text-sm font-bold text-foreground">{weeklyStudyHours} hrs</span>
              </div>

              <div className="p-3.5 rounded-xl border border-border bg-background/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-amber-500" />
                  <span className="text-xs text-muted">Sessions Completed</span>
                </div>
                <span className="text-sm font-bold text-foreground">{sessionsCompleted}</span>
              </div>
            </CardContent>
          </Card>

          {/* AI Nudge Quote */}
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/15 space-y-2">
            <div className="flex items-center gap-2 text-primary font-display font-semibold text-xs">
              <Sparkles size={14} className="animate-pulse" />
              <span>AI Study Tip</span>
            </div>
            <p className="text-[11px] text-muted leading-relaxed">
              "Studies show that studying in 25-minute intervals with 5-minute cognitive breaks enhances retention rates by up to 30% compared to cramming."
            </p>
          </div>
        </div>

        {/* Right Side: Core Timer App */}
        <div className="md:col-span-2">
          <Card isGlass={true} padding="lg" className="border-border/50 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            
            {/* Audio volume toggler */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="absolute top-4 right-4 p-2 rounded-xl border border-border/50 text-muted hover:text-foreground hover:bg-card transition-colors"
              title={isMuted ? 'Unmute alerts' : 'Mute alerts'}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            {/* Timer mode buttons */}
            <div className="flex items-center gap-2 p-1.5 bg-background/60 border border-border/40 rounded-2xl mb-8">
              {Object.entries(MODES).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setMode(key)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200
                    ${mode === key
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-muted hover:text-foreground hover:bg-card/45'
                    }
                  `}
                >
                  {value.icon}
                  <span>{value.label}</span>
                </button>
              ))}
            </div>

            {/* Glowing countdown display */}
            <div className="relative flex items-center justify-center w-52 h-52 mb-8">
              {/* Circular SVG track */}
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle
                  cx="104"
                  cy="104"
                  r="92"
                  className="stroke-border/20 fill-none"
                  strokeWidth="6"
                />
                <circle
                  cx="104"
                  cy="104"
                  r="92"
                  className={`fill-none transition-all duration-1000 ${
                    mode === 'focus' ? 'stroke-primary' : 'stroke-secondary'
                  }`}
                  strokeWidth="7"
                  strokeDasharray={2 * Math.PI * 92}
                  strokeDashoffset={2 * Math.PI * 92 * (1 - progressPercent / 100)}
                  strokeLinecap="round"
                />
              </svg>

              <div className="flex flex-col items-center justify-center">
                <span className="text-4xl sm:text-5xl font-bold font-mono tracking-tight text-foreground select-none drop-shadow-sm">
                  {formatTime(secondsLeft)}
                </span>
                <span className="text-[10px] font-semibold text-muted tracking-wider uppercase mt-1 select-none">
                  {isActive ? 'focusing' : 'paused'}
                </span>
              </div>
            </div>

            {/* Control triggers */}
            <div className="flex items-center gap-4">
              <Button
                variant={isActive ? 'outline' : 'primary'}
                onClick={handleStartPause}
                iconLeft={isActive ? <Pause size={16} /> : <Play size={16} />}
                className="w-32 rounded-xl font-bold shadow-sm"
              >
                {isActive ? 'Pause' : 'Start'}
              </Button>
              <Button
                variant="glass"
                onClick={handleReset}
                iconLeft={<RotateCcw size={16} />}
                className="rounded-xl border border-border/50 text-muted hover:text-foreground"
              >
                Reset
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
