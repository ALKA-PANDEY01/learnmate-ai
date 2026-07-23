import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Award,
  Clock,
  Play,
  CheckCircle2,
  Calendar,
  Compass,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SEO } from '../components/common/SEO';
import api from '../services/api';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/goals');
      if (response.success && response.goals) {
        setCourses(response.goals);
      }
    } catch (err) {
      console.warn("Failed to load goals/courses from backend database:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const activeCourses = courses.filter(c => c.status === 'active');
  const completedCourses = courses.filter(c => c.status === 'completed');

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-pulse">
        <div className="h-8 bg-border/40 w-1/4 rounded-lg" />
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2].map(i => (
            <Card key={i} className="h-48 border-border/40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      <SEO title="My Courses" description="Display active roadmaps, study completion rates, and certifications." />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold font-display tracking-tight text-foreground flex items-center gap-2">
            <BookOpen className="text-primary" size={24} />
            <span>My Courses & Learning Paths</span>
          </h1>
          <p className="text-sm text-muted">
            Track your active goals, estimated study completion, and unlocked certificates.
          </p>
        </div>

        {activeCourses.length === 0 && (
          <Link to="/dashboard/goal-setup" className="shrink-0">
            <Button iconLeft={<PlusCircle size={16} />} variant="primary">
              Generate New Course
            </Button>
          </Link>
        )}
      </div>

      {/* Active Courses Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold tracking-wider uppercase text-muted">Active Syllabus Paths ({activeCourses.length})</h3>

        {activeCourses.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {activeCourses.map(course => (
              <Card key={course._id || course.id} isGlass={true} padding="md" hoverEffect={true} className="border-border/50">
                <div className="space-y-4 h-full flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[10px] font-bold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                        {course.domain}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-muted">
                        <Calendar size={11} />
                        Due: {new Date(course.deadline).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-base font-bold font-display text-foreground line-clamp-1">
                      {course.goal}
                    </h4>
                    <p className="text-xs text-muted">
                      Difficulty Level: <span className="font-semibold text-foreground">{course.skillLevel}</span>
                    </p>
                  </div>

                  {/* Progress ring slider */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted">Completion Rate</span>
                      <span className="font-bold text-foreground">{course.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-border/40 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-primary h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-border/40">
                    <span className="text-[10px] text-muted flex items-center gap-1">
                      <Clock size={12} />
                      {course.hoursStudied || 0} hrs studied
                    </span>

                    <Link to="/dashboard/roadmap">
                      <Button variant="primary" size="sm" iconRight={<Play size={12} />}>
                        Continue Learning
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-8 border border-border/50 text-center space-y-4">
            <div className="text-3xl">🧭</div>
            <p className="text-sm font-semibold text-muted">No active learning paths found.</p>
            <p className="text-xs text-muted/80 max-w-sm mx-auto">Generate a custom AI learning roadmap goal to kickstart your study modules!</p>
            <Link to="/dashboard/goal-setup" className="inline-block pt-1">
              <Button size="sm" variant="outline">Setup a Goal</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Completed Courses & Certificates */}
      <div className="space-y-4 pt-4">
        <h3 className="text-sm font-bold tracking-wider uppercase text-muted">Completed Courses & Certificates ({completedCourses.length})</h3>

        {completedCourses.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {completedCourses.map(course => (
              <Card key={course._id || course.id} isGlass={true} padding="md" className="border-border/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-500 text-[9px] font-bold px-3 py-1 rounded-bl-xl border-l border-b border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 size={10} />
                  <span>Completed</span>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-secondary uppercase bg-secondary/10 px-2 py-0.5 rounded border border-secondary/20">
                      {course.domain}
                    </span>
                    <h4 className="text-base font-bold font-display text-foreground line-clamp-1">
                      {course.goal}
                    </h4>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex gap-2.5 items-center">
                    <Award size={20} className="text-emerald-500 shrink-0" />
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-foreground">Course Certificate Issued</p>
                      <p className="text-[10px] text-muted">Verification Hash ID: lm-cert-{course._id || course.id}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-8 border border-border/50 text-center space-y-4">
            <div className="text-3xl text-muted">🎓</div>
            <p className="text-sm font-semibold text-muted">No certificates unlocked yet</p>
            <p className="text-xs text-muted/80 max-w-sm mx-auto">Complete 100% of all week modules on your active roadmap to receive your verified course badge.</p>
          </div>
        )}
      </div>
    </div>
  );
}
