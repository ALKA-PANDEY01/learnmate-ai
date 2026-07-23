import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, Mail, Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { SEO } from '../components/common/SEO';

export default function LoginPage() {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect target
  const from = location.state?.from?.pathname || '/dashboard';

  React.useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!emailOrUser.trim() || !password.trim()) {
      setFormError('Please enter your email or username, and password.');
      return;
    }

    setLoading(true);
    try {
      await login(emailOrUser.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setFormError(err.message || 'Incorrect credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 animate-bounce">
          <GraduationCap size={32} />
        </div>
        <p className="text-sm font-medium text-muted animate-pulse">
          Setting up your learning environment...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      <SEO title="Login" description="Sign in to your LearnMate AI personal learning account." />
      
      {/* Background Blurs */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse-slow" />

      {/* Back to Home & Theme Toggle */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-white">
            <GraduationCap size={16} />
          </div>
          <span className="font-display font-bold text-sm tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            LearnMate AI
          </span>
        </Link>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-muted hover:text-foreground hover:bg-card border border-border/30 transition-colors"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>

      <div className="w-full max-w-md mt-8">
        <Card isGlass={true} padding="lg" className="shadow-2xl">
          
          <div className="text-center space-y-2 mb-8">
            <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary border border-primary/20">
              <ShieldCheck size={24} />
            </div>
            <h2 className="text-2xl font-bold font-display tracking-tight text-foreground">
              Welcome Back
            </h2>
            <p className="text-xs text-muted">
              Enter your credentials to access your study companion.
            </p>
          </div>

          {formError && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium flex items-start gap-2.5 animate-shake">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username or Email"
              type="text"
              id="username-email"
              value={emailOrUser}
              onChange={(e) => setEmailOrUser(e.target.value)}
              placeholder="e.g. demo"
              iconLeft={<Mail size={16} />}
              required
              disabled={loading}
            />

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                {/* We are only implementing mock styling, no actual reset link exists */}
              </div>
              <Input
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                iconLeft={<Lock size={16} />}
                required
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              isLoading={loading}
              iconRight={<ArrowRight size={16} />}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Mock Login Hint */}
          <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/10 text-[11px] text-muted text-center leading-relaxed">
            💡 <span className="font-semibold text-primary">Demo Account:</span> Enter username <span className="font-bold text-foreground">demo</span> and password <span className="font-bold text-foreground">password123</span>
          </div>

          <div className="mt-8 text-center text-xs text-muted">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-primary hover:underline hover:text-primary-hover"
            >
              Register now
            </Link>
          </div>

        </Card>
      </div>

    </div>
  );
}
