import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, User, Mail, Lock, ArrowRight, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { SEO } from '../components/common/SEO';

export default function RegisterPage() {
  const { register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [formError, setFormError] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const tempErrors = {};
    if (!name.trim()) tempErrors.name = 'Full name is required';
    
    if (!email.trim()) {
      tempErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Please enter a valid email address';
    }

    if (!username.trim()) {
      tempErrors.username = 'Username is required';
    } else if (username.length < 3) {
      tempErrors.username = 'Username must be at least 3 characters';
    }

    if (!password) {
      tempErrors.password = 'Password is required';
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!validate()) return;

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), username.trim(), password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setFormError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      <SEO title="Register" description="Create your free personal learning workspace with LearnMate AI." />
      
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

      <div className="w-full max-w-md mt-12 mb-8">
        <Card isGlass={true} padding="lg" className="shadow-2xl">
          
          <div className="text-center space-y-2 mb-6">
            <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-2xl bg-secondary/10 text-secondary border border-secondary/20">
              <UserPlus size={24} />
            </div>
            <h2 className="text-2xl font-bold font-display tracking-tight text-foreground">
              Create an Account
            </h2>
            <p className="text-xs text-muted">
              Get started with your free personal learning workspace.
            </p>
          </div>

          {formError && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium flex items-start gap-2.5">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              id="full-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              iconLeft={<User size={16} />}
              error={errors.name}
              disabled={loading}
            />

            <Input
              label="Email Address"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              iconLeft={<Mail size={16} />}
              error={errors.email}
              disabled={loading}
            />

            <Input
              label="Username"
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="johndoe"
              iconLeft={<User size={16} />}
              error={errors.username}
              disabled={loading}
            />

            <Input
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              iconLeft={<Lock size={16} />}
              error={errors.password}
              disabled={loading}
            />

            <Button
              type="submit"
              variant="secondary"
              className="w-full mt-2"
              isLoading={loading}
              iconRight={<ArrowRight size={16} />}
            >
              Sign Up
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-muted">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-primary hover:underline hover:text-primary-hover"
            >
              Log In
            </Link>
          </div>

        </Card>
      </div>

    </div>
  );
}
