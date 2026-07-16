import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, GraduationCap } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SEO } from '../components/common/SEO';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      <SEO title="Page Not Found" description="The requested route does not exist. Back to dashboard." />
      
      {/* Background Blurs */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse-slow" />

      <div className="w-full max-w-md">
        <Card isGlass={true} padding="lg" className="shadow-2xl text-center border-border/60">
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 text-3xl mb-6">
            <ShieldAlert size={36} />
          </div>

          <h1 className="text-4xl font-extrabold font-display tracking-tight text-foreground">404</h1>
          <h2 className="text-lg font-bold text-foreground mt-2">Route Not Found</h2>
          <p className="text-xs text-muted max-w-xs mx-auto mt-2 leading-relaxed">
            The study page or syllabus path you requested doesn't exist. Let's redirect you back to your learning space.
          </p>

          <div className="mt-8">
            <Link to="/dashboard">
              <Button
                variant="primary"
                className="w-full"
                iconLeft={<ArrowLeft size={16} />}
              >
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
