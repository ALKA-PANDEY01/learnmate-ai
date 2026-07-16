import React, { useState } from 'react';
import {
  Settings,
  Bell,
  Lock,
  User,
  LogOut,
  Moon,
  Sun,
  Shield,
  HelpCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { SEO } from '../components/common/SEO';

export default function SettingsPage() {
  const { user, logout, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Settings Forms States
  const [email, setEmail] = useState(user?.email || '');
  const [username, setUsername] = useState(user?.username || '');
  const [isAccountSaved, setIsAccountSaved] = useState(false);
  
  // Security Form States
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secMessage, setSecMessage] = useState('');
  const [secError, setSecError] = useState('');

  // Preference Checkbox States
  const [prefNudges, setPrefNudges] = useState(true);
  const [prefWeekly, setPrefWeekly] = useState(true);
  const [prefAchievements, setPrefAchievements] = useState(false);

  const handleAccountSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !username.trim()) return;

    updateUser({ email: email.trim(), username: username.trim() });
    setIsAccountSaved(true);
    setTimeout(() => setIsAccountSaved(false), 2500);
  };

  const handleSecuritySubmit = (e) => {
    e.preventDefault();
    setSecError('');
    setSecMessage('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setSecError('Please enter all password parameters.');
      return;
    }

    if (newPassword.length < 6) {
      setSecError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setSecError('Confirm password does not match new password.');
      return;
    }

    // Success Mock
    setSecMessage('Password updated successfully.');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSecMessage(''), 3000);
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto animate-in fade-in duration-300">
      <SEO title="Settings" description="Manage dark mode toggles, notification options, security keys, and account parameters." />

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-display tracking-tight text-foreground flex items-center gap-2">
          <Settings size={24} className="text-primary" />
          <span>Settings</span>
        </h1>
        <p className="text-sm text-muted">
          Configure preferences, dark modes, notifications, and security protocols.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Side: Category Links */}
        <div className="md:col-span-1 space-y-4">
          <Card isGlass={true} padding="sm" className="border-border/50">
            <div className="p-2 space-y-1 text-xs sm:text-sm text-muted font-medium">
              <a href="#appearance" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-card/45 hover:text-foreground transition-colors">
                <Sun size={15} />
                <span>Appearance Theme</span>
              </a>
              <a href="#notifications" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-card/45 hover:text-foreground transition-colors">
                <Bell size={15} />
                <span>Notifications Prefs</span>
              </a>
              <a href="#account" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-card/45 hover:text-foreground transition-colors">
                <User size={15} />
                <span>Account Parameters</span>
              </a>
              <a href="#security" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-card/45 hover:text-foreground transition-colors">
                <Shield size={15} />
                <span>Security & Password</span>
              </a>
            </div>
          </Card>
        </div>

        {/* Right Side: Options Sheets */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Section 1: Appearance Theme */}
          <Card isGlass={true} padding="md" id="appearance" className="border-border/50 scroll-mt-24">
            <CardHeader className="mb-0 pb-2">
              <CardTitle className="text-sm font-semibold">Appearance Theme</CardTitle>
              <CardDescription className="text-xs">Configure how LearnMate AI renders in your browser.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  {theme === 'light' ? <Sun size={16} /> : <Moon size={16} />}
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Dark Mode Mode</p>
                  <p className="text-[10px] text-muted">Currently {theme === 'light' ? 'Light' : 'Dark'} mode active.</p>
                </div>
              </div>

              <button
                onClick={toggleTheme}
                className={`
                  relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 outline-none
                  ${theme === 'dark' ? 'bg-primary' : 'bg-muted/30'}
                `}
              >
                <span className={`
                  pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200
                  ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}
                `} />
              </button>
            </CardContent>
          </Card>

          {/* Section 2: Notifications Preferences */}
          <Card isGlass={true} padding="md" id="notifications" className="border-border/50 scroll-mt-24">
            <CardHeader className="mb-0 pb-2">
              <CardTitle className="text-sm font-semibold">Notification Preferences</CardTitle>
              <CardDescription className="text-xs">Adjust what alerts trigger notifications.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {[
                { label: "AI Study Nudges & Advice", desc: "Tips regarding active recall intervals", val: prefNudges, setter: setPrefNudges },
                { label: "Weekly Progress Digests", desc: "Detailed summary logs of studied hours", val: prefWeekly, setter: setPrefWeekly },
                { label: "Achievements & Milestones", desc: "Alerts when unlocking features", val: prefAchievements, setter: setPrefAchievements }
              ].map((pref, idx) => (
                <label
                  key={idx}
                  className="flex items-start justify-between gap-4 p-3 rounded-xl border border-border/60 hover:bg-card/30 transition-all cursor-pointer"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-foreground">{pref.label}</p>
                    <p className="text-[10px] text-muted">{pref.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={pref.val}
                    onChange={(e) => pref.setter(e.target.checked)}
                    className="h-4.5 w-4.5 rounded border-border text-primary focus:ring-primary/20 accent-primary shrink-0 cursor-pointer mt-0.5"
                  />
                </label>
              ))}
            </CardContent>
          </Card>

          {/* Section 3: Account Parameters */}
          <Card isGlass={true} padding="md" id="account" className="border-border/50 scroll-mt-24">
            <CardHeader className="mb-0 pb-2">
              <CardTitle className="text-sm font-semibold">Account Details</CardTitle>
              <CardDescription className="text-xs">Update your email addresses and handle settings.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleAccountSubmit} className="space-y-4">
                {isAccountSaved && (
                  <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary text-xs font-medium flex items-center gap-2 animate-fade-in">
                    <CheckCircle2 size={15} />
                    <span>Account parameters saved.</span>
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Username"
                    type="text"
                    id="settings-username-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    id="settings-email-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="flex justify-end pt-2 border-t border-border/40">
                  <Button type="submit" size="sm">
                    Save Account
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Section 4: Security & Password */}
          <Card isGlass={true} padding="md" id="security" className="border-border/50 scroll-mt-24">
            <CardHeader className="mb-0 pb-2">
              <CardTitle className="text-sm font-semibold">Security & Password</CardTitle>
              <CardDescription className="text-xs">Protect your credentials and update security keys.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleSecuritySubmit} className="space-y-4">
                {secMessage && (
                  <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary text-xs font-medium flex items-center gap-2">
                    <CheckCircle2 size={15} />
                    <span>{secMessage}</span>
                  </div>
                )}
                {secError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium flex items-center gap-2">
                    <AlertCircle size={15} />
                    <span>{secError}</span>
                  </div>
                )}

                <Input
                  label="Current Password"
                  type="password"
                  id="settings-old-pass"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="New Password"
                    type="password"
                    id="settings-new-pass"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                  />

                  <Input
                    label="Confirm New Password"
                    type="password"
                    id="settings-confirm-pass"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                  />
                </div>

                <div className="flex justify-end pt-2 border-t border-border/40">
                  <Button type="submit" size="sm" variant="secondary">
                    Update Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Section 5: Logout */}
          <Card isGlass={true} padding="md" className="border-red-500/10 bg-red-500/5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-0.5 text-center sm:text-left">
                <p className="text-xs font-bold text-foreground">Sign Out of Learnmate</p>
                <p className="text-[10px] text-muted">Disconnect active sessions from this computer.</p>
              </div>
              <Button
                variant="danger"
                size="sm"
                iconLeft={<LogOut size={13} />}
                onClick={logout}
              >
                Sign Out
              </Button>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
