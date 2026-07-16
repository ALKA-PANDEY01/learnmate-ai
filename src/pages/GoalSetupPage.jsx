import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Calendar, BookOpen, Target, Clock, GraduationCap, RefreshCw } from 'lucide-react';
import { useRoadmap } from '../context/RoadmapContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { SEO } from '../components/common/SEO';

export default function GoalSetupPage() {
  const { generateRoadmap, isGenerating } = useRoadmap();
  const navigate = useNavigate();

  const [goal, setGoal] = useState('');
  const [skillLevel, setSkillLevel] = useState('Intermediate');
  const [deadline, setDeadline] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [learningStyle, setLearningStyle] = useState('Practical');
  
  const [loadingStep, setLoadingStep] = useState(0);

  const mockLoadingSteps = [
    "Analyzing goal parameters and requirements...",
    "Curating relative syllabus modules...",
    "Injecting active recall quizzes and code challenges...",
    "Assembling spaced-repetition timelines...",
    "Finalizing customized study resource links..."
  ];

  // Animate loading steps during generation
  useEffect(() => {
    let interval;
    if (isGenerating) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < mockLoadingSteps.length - 1 ? prev + 1 : prev));
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!goal.trim() || !deadline) return;

    try {
      await generateRoadmap({
        goal: goal.trim(),
        skillLevel,
        deadline,
        hoursPerDay: Number(hoursPerDay),
        learningStyle
      });
      navigate('/dashboard/roadmap');
    } catch (err) {
      console.error("Roadmap generation failed", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 relative pb-10">
      <SEO title="Goal Setup" description="Input learning goals, available study durations, and preferred modes to generate AI roadmap guides." />
      
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">
          Define Your Learning Goal 🎯
        </h1>
        <p className="text-sm text-muted">
          Input your objectives, availability, and preferences. LearnMate AI will compile a custom weekly syllabus.
        </p>
      </div>

      <Card isGlass={true} padding="lg" className="border-border/50 relative overflow-hidden">
        {/* Full-Screen Loading Overlay */}
        {isGenerating && (
          <div className="absolute inset-0 bg-background/90 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center space-y-6 animate-in fade-in duration-300">
            <div className="relative">
              {/* Spinner animation */}
              <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-primary">
                <Sparkles size={20} className="animate-pulse" />
              </div>
            </div>

            <div className="space-y-2 max-w-sm">
              <h3 className="text-lg font-bold font-display text-foreground">Generating Your Learning Plan</h3>
              <p className="text-xs text-muted/80 h-10 flex items-center justify-center leading-normal animate-pulse">
                {mockLoadingSteps[loadingStep]}
              </p>
            </div>
            
            <div className="w-48 bg-border/40 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((loadingStep + 1) / mockLoadingSteps.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="What topic or skill do you want to learn?"
            id="learning-goal"
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g. React 19 & Tailwind CSS v4, Docker containerization, etc."
            iconLeft={<Target size={16} />}
            required
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="skill-level" className="text-xs font-medium text-foreground/80">
                Current Skill Level
              </label>
              <select
                id="skill-level"
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
                className="w-full rounded-xl border border-border bg-card/45 px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-200"
              >
                <option value="Beginner">Beginner (No prior experience)</option>
                <option value="Intermediate">Intermediate (Basic understanding)</option>
                <option value="Advanced">Advanced (Looking for deep mastery)</option>
              </select>
            </div>

            <Input
              label="Target Completion Deadline"
              id="target-deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              iconLeft={<Calendar size={16} />}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Available Study Hours Per Day"
              id="hours-per-day"
              type="number"
              min="0.5"
              max="24"
              step="0.5"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(e.target.value)}
              iconLeft={<Clock size={16} />}
              required
            />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="learning-style" className="text-xs font-medium text-foreground/80">
                Preferred Learning Style
              </label>
              <select
                id="learning-style"
                value={learningStyle}
                onChange={(e) => setLearningStyle(e.target.value)}
                className="w-full rounded-xl border border-border bg-card/45 px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-200"
              >
                <option value="Visual">Visual (Videos, charts, diagrams)</option>
                <option value="Practical">Practical (Projects, challenges, sandboxes)</option>
                <option value="Theoretical">Theoretical (Reading, documentations, articles)</option>
              </select>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full pt-3 pb-3"
            variant="primary"
            iconLeft={<Sparkles size={16} />}
          >
            Generate AI Learning Plan
          </Button>
        </form>
      </Card>
      
      {/* Visual Recommendation Hint */}
      <div className="flex gap-3 p-4 rounded-2xl bg-secondary/5 border border-secondary/15">
        <GraduationCap className="text-secondary shrink-0" size={20} />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-foreground">Active Spaced-Repetition Active</h4>
          <p className="text-[11px] text-muted leading-relaxed">
            By analyzing your learning styles, our scheduler arranges theory papers preceding hands-on sandbox labs. Quizzes will validate your progress.
          </p>
        </div>
      </div>
    </div>
  );
}
