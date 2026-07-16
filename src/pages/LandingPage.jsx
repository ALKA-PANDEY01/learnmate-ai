import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  BookOpen,
  Cpu,
  TrendingUp,
  CheckCircle2,
  GraduationCap,
  ArrowRight,
  Shield,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/Button';
import { SEO } from '../components/common/SEO';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const features = [
    {
      icon: <Sparkles className="text-primary w-6 h-6" />,
      title: "AI-Powered Study Buddy",
      description: "Chat with an intelligent agent that answers questions, simplifies difficult concepts, and summarizes long materials in real time."
    },
    {
      icon: <Cpu className="text-secondary w-6 h-6" />,
      title: "Adaptive Curriculums",
      description: "Your study path automatically adapts based on your quiz scores, learning speed, and target achievements."
    },
    {
      icon: <Layers className="text-indigo-500 w-6 h-6" />,
      title: "Smart Flashcards",
      description: "Auto-generate flashcards from your documents and study them using spaced-repetition schedules designed for maximum recall."
    },
    {
      icon: <TrendingUp className="text-emerald-500 w-6 h-6" />,
      title: "Analytics Dashboard",
      description: "Visualize study velocity, track focus hours, and get clear predictions on which topics you are ready to ace."
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Add Study Materials",
      description: "Upload notes, slide decks, textbooks, or link online courses to build your learning base."
    },
    {
      step: "02",
      title: "AI Analysis",
      description: "Our agent parses your content, outlining core concepts, key equations, and target glossary terms."
    },
    {
      step: "03",
      title: "Learn & Review",
      description: "Practice active recall with generated quizzes, interactive chat dialogs, and adaptive flashcards."
    },
    {
      step: "04",
      title: "Master Your Path",
      description: "Watch your knowledge score grow as you study daily and solidify memory retention."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <SEO title="Home" description="Empower your learning process using LearnMate AI, your dedicated personal learning agent. Customize templates, chat with tutors, and track your metrics." />
      
      {/* Landing Navbar */}
      <header className="sticky top-0 z-50 glass border-b border-border/40 px-4 md:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-white shadow-md shadow-primary/20">
            <GraduationCap size={20} />
          </div>
          <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            LearnMate AI
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-muted hover:text-foreground hover:bg-card/85 transition-colors border border-border/30"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button size="sm">Go to Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-xs font-semibold text-muted hover:text-foreground px-2 py-1.5 transition-colors">
                Log In
              </Link>
              <Link to="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden px-4 max-w-7xl mx-auto">
        {/* Subtle blur circles background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse-slow" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-secondary/15 rounded-full blur-[90px] pointer-events-none -z-10 animate-float" />
        
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          {/* Animated badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/25 text-[11px] font-semibold tracking-wider uppercase animate-fade-in">
            <Sparkles size={12} className="animate-spin-slow" />
            Next-Gen Learning Assistant
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-display leading-[1.1] tracking-tight bg-gradient-to-br from-foreground via-foreground to-muted bg-clip-text text-transparent">
            Your Personal AI Learning Agent, <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Always Ready</span>.
          </h1>

          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto font-sans leading-relaxed">
            Upload notes, interact with an AI tutor, auto-generate flashcards, and master complex subjects faster with a personalized learning system designed just for you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              <Button size="lg" iconRight={<ArrowRight size={18} />}>
                Create Free Account
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline" size="lg">
                Explore Features
              </Button>
            </a>
          </div>
          
          <div className="text-xs text-muted flex items-center justify-center gap-6 pt-8">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-secondary" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-secondary" /> Setup in 2 minutes</span>
          </div>
        </div>

        {/* Hero Product Screen Mockup */}
        <div className="mt-16 md:mt-24 max-w-5xl mx-auto rounded-2xl border border-border/80 glass-card p-2 md:p-3.5 shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/10 to-transparent blur-xl pointer-events-none -z-10" />
          <div className="w-full h-64 md:h-[450px] rounded-xl bg-card border border-border/40 overflow-hidden flex flex-col">
            {/* Mock Dashboard Topbar */}
            <div className="flex items-center justify-between px-4 py-3 bg-background/80 border-b border-border/50">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <span className="text-[10px] text-muted ml-2 font-mono">learnmate-dashboard/overview</span>
              </div>
              <div className="w-24 h-4 bg-muted/20 rounded-md" />
            </div>
            
            {/* Mock Dashboard Split-Pane */}
            <div className="flex flex-1 overflow-hidden">
              {/* Mock Sidebar */}
              <div className="w-40 border-r border-border/40 bg-background/50 p-3 space-y-4 hidden md:block">
                <div className="h-4 bg-primary/10 rounded w-4/5" />
                <div className="space-y-2 pt-2">
                  <div className="h-3.5 bg-muted/20 rounded w-full" />
                  <div className="h-3.5 bg-muted/20 rounded w-11/12" />
                  <div className="h-3.5 bg-muted/20 rounded w-5/6" />
                  <div className="h-3.5 bg-muted/20 rounded w-4/5" />
                </div>
              </div>
              
              {/* Mock Grid */}
              <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="h-5 bg-foreground/15 rounded w-48" />
                    <div className="h-3 bg-muted/20 rounded w-64" />
                  </div>
                  <div className="h-7 bg-primary/20 rounded-lg w-20" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 rounded-xl border border-border/60 bg-background/30 space-y-2.5">
                      <div className="h-3 bg-muted/40 rounded w-1/2" />
                      <div className="h-6 bg-foreground/10 rounded w-2/3" />
                      <div className="h-2 bg-muted/20 rounded w-4/5" />
                    </div>
                  ))}
                </div>

                {/* Mock Chart Area */}
                <div className="h-40 rounded-xl border border-border/50 bg-background/60 p-4 flex flex-col justify-between">
                  <div className="h-3.5 bg-muted/40 rounded w-1/4" />
                  <div className="flex items-end justify-between gap-2 h-20 pt-2">
                    {[45, 60, 52, 78, 65, 88, 72, 95, 82, 100].map((h, idx) => (
                      <div
                        key={idx}
                        style={{ height: `${h}%` }}
                        className="bg-primary/25 hover:bg-primary/40 rounded-t w-full transition-all duration-300"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-card/10 border-t border-border/30 px-4">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-foreground">
              Everything you need to master any subject.
            </h2>
            <p className="text-sm text-muted">
              LearnMate AI combines advanced generative language models with core cognitive science principles to help you study more effectively.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl p-6 border border-border/40 hover:-translate-y-1 hover:shadow-md hover:border-primary/20 transition-all duration-300 space-y-4 group"
              >
                <div className="p-2.5 rounded-xl bg-card border border-border/60 w-fit group-hover:scale-110 transition-transform">
                  {feat.icon}
                </div>
                <h3 className="text-base font-semibold text-foreground font-display">
                  {feat.title}
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-foreground">
            How LearnMate AI works.
          </h2>
          <p className="text-sm text-muted">
            Four simple stages that turn overwhelming workloads into structured, incremental learning victories.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-4 relative">
          {/* Connector line for desktop */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 -translate-y-1/2 -z-10 hidden md:block" />
          
          {steps.map((st, idx) => (
            <div key={idx} className="glass rounded-2xl p-6 relative border border-border/30 hover:border-muted/30 transition-all duration-300">
              <span className="absolute top-4 right-4 text-4xl font-extrabold font-mono text-muted/15 select-none">
                {st.step}
              </span>
              <h3 className="text-base font-semibold text-foreground font-display mb-2">
                {st.title}
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                {st.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <div className="glass-card rounded-3xl p-8 md:p-16 border border-border/80 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-secondary/5 to-transparent pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/10 rounded-full blur-[80px]" />
          
          <div className="relative space-y-6 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-foreground">
              Ready to accelerate your learning?
            </h2>
            <p className="text-sm md:text-base text-muted max-w-lg mx-auto">
              Join thousands of students and lifelong learners who are already using LearnMate AI to master new subjects daily.
            </p>
            <div className="pt-4">
              <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                <Button size="lg" iconRight={<ArrowRight size={18} />}>
                  Start Learning for Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-12 px-4 bg-card/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-muted">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary text-white">
              <GraduationCap size={15} />
            </div>
            <span className="font-bold font-display text-sm tracking-tight text-foreground">LearnMate AI</span>
          </div>
          
          <div className="flex gap-6">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Support</a>
          </div>

          <div>
            &copy; {new Date().getFullYear()} LearnMate AI. Designed with Premium Aesthetics.
          </div>
        </div>
      </footer>

    </div>
  );
}
