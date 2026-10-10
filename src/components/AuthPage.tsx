import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  GraduationCap,
  UserCheck,
  ArrowRight,
  Flame,
  CheckCircle,
  AlertCircle,
  Lock,
  Mail,
  User,
  Building,
  Briefcase
} from 'lucide-react';
import { api } from '../services/api';
import { User as UserType } from '../types';

interface AuthPageProps {
  onLoginSuccess: (user: UserType) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [selectedRole, setSelectedRole] = useState<'student' | 'educator'>('student');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [batch, setBatch] = useState('Class of 2026 - CS-A');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [targetJobRole, setTargetJobRole] = useState('Full-Stack Software Engineer');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await api.login({ email, password });
        onLoginSuccess(res.user);
      } else {
        const res = await api.signup({
          name,
          email,
          password,
          role: selectedRole,
          batch: selectedRole === 'student' ? batch : undefined,
          department: selectedRole === 'educator' ? department : undefined,
          targetJobRole: selectedRole === 'student' ? targetJobRole : undefined
        });
        onLoginSuccess(res.user);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Demo 1-Click Persona Logins
  const handleQuickLogin = async (userId: string) => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const res = await api.login({ userId });
      onLoginSuccess(res.user);
    } catch (err: any) {
      setErrorMsg(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Header */}
      <header className="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 via-sky-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-500/30 border border-sky-300/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-black text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-sky-400 bg-clip-text text-transparent">
              AURA
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 ml-2 rounded-full bg-brand-500/15 text-brand-400 border border-brand-500/30">
              v2.4 AI
            </span>
            <p className="text-[11px] text-slate-400 font-medium">AI-Powered Student Success & Proof-of-Build Platform</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Unified Predictive Scoring & Voice Defense Active</span>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="max-w-6xl w-full mx-auto px-4 py-6 z-10 flex flex-col lg:flex-row items-center gap-12 my-auto">
        {/* Left Hero Context */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-xs text-brand-300 shadow-sm">
            <Flame className="w-4 h-4 text-orange-400 animate-flame-flicker" />
            <span>Habit streaks • Voice AI Interviews • Predictive Analytics</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Predict Success.{' '}
            <span className="bg-gradient-to-r from-brand-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              Verify Real Builds.
            </span>{' '}
            Prevent At-Risk Dropouts.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
            A comprehensive intelligence platform uniting academics, attendance, LMS submissions, engagement, and placement readiness with spoken voice AI code defense.
          </p>

          {/* Quick Demo Persona Badges */}
          <div className="pt-4 border-t border-slate-800/80 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              ⚡ Instant 1-Click Test Personas
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-lg mx-auto lg:mx-0">
              {/* Persona 1: Alex Mercer (High Performer) */}
              <button
                type="button"
                onClick={() => handleQuickLogin('u1')}
                className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-brand-500/30 text-left transition flex items-center gap-3 group"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Alex"
                  className="w-10 h-10 rounded-lg object-cover ring-1 ring-brand-500/40"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white group-hover:text-brand-300 truncate">
                    Alex Mercer (Student)
                  </div>
                  <div className="text-[10px] text-emerald-400">89.4 Score • 21-Day Streak</div>
                </div>
              </button>

              {/* Persona 2: Marcus Vance (At-Risk Student) */}
              <button
                type="button"
                onClick={() => handleQuickLogin('u3')}
                className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-rose-500/40 text-left transition flex items-center gap-3 group"
              >
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Marcus"
                  className="w-10 h-10 rounded-lg object-cover ring-1 ring-rose-500/40"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white group-hover:text-rose-300 truncate">
                    Marcus Vance (At-Risk)
                  </div>
                  <div className="text-[10px] text-rose-400">46.8 Score • 2 Backlogs</div>
                </div>
              </button>

              {/* Persona 3: Maya Patel (High CGPA, Low Placement) */}
              <button
                type="button"
                onClick={() => handleQuickLogin('u5')}
                className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-amber-500/40 text-left transition flex items-center gap-3 group"
              >
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
                  alt="Maya"
                  className="w-10 h-10 rounded-lg object-cover ring-1 ring-amber-500/40"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white group-hover:text-amber-300 truncate">
                    Maya Patel (Targeted)
                  </div>
                  <div className="text-[10px] text-amber-400">9.2 CGPA • Low Placement</div>
                </div>
              </button>

              {/* Persona 4: Dr. Sarah Lin (Faculty Admin) */}
              <button
                type="button"
                onClick={() => handleQuickLogin('u2')}
                className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-purple-500/40 text-left transition flex items-center gap-3 group"
              >
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                  alt="Sarah Lin"
                  className="w-10 h-10 rounded-lg object-cover ring-1 ring-purple-500/40"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white group-hover:text-purple-300 truncate">
                    Dr. Sarah Lin (Dean)
                  </div>
                  <div className="text-[10px] text-purple-400">Faculty/Admin Surveillance Hub</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Authentication Form Card */}
        <div className="w-full max-w-md bg-slate-900/90 rounded-3xl border border-slate-800 p-8 shadow-2xl relative backdrop-blur-xl">
          {/* Role Selection Tabs */}
          <div className="p-1 rounded-2xl bg-slate-950 border border-slate-800 flex items-center mb-6">
            <button
              type="button"
              onClick={() => setSelectedRole('student')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
                selectedRole === 'student'
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Student Role</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('educator')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
                selectedRole === 'educator'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Faculty / Admin</span>
            </button>
          </div>

          {/* Mode Switcher: Sign In vs Sign Up */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-black text-white">
                {mode === 'login'
                  ? selectedRole === 'student'
                    ? 'Student Sign In'
                    : 'Faculty / Admin Portal'
                  : 'Create Your Account'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {mode === 'login'
                  ? 'Enter your institutional credentials'
                  : 'Register for student or advisor access'}
              </p>
            </div>

            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  mode === 'login' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  mode === 'signup' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rizawan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder={
                    selectedRole === 'student'
                      ? 'student@university.edu'
                      : 'sarah.lin@university.edu'
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-bold text-slate-300">Password</label>
                {mode === 'login' && (
                  <span className="text-[10px] text-slate-400">Demo: password123</span>
                )}
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            {mode === 'signup' && selectedRole === 'student' && (
              <>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Batch / Class</label>
                  <input
                    type="text"
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Target Career Role</label>
                  <input
                    type="text"
                    value={targetJobRole}
                    onChange={(e) => setTargetJobRole(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </>
            )}

            {mode === 'signup' && selectedRole === 'educator' && (
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 shadow-xl mt-2 ${
                selectedRole === 'student'
                  ? 'bg-gradient-to-r from-brand-600 via-sky-500 to-indigo-600 hover:from-brand-500 hover:to-sky-400 text-white shadow-brand-500/25'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-500/25'
              }`}
            >
              <span>{loading ? 'Authenticating...' : mode === 'login' ? 'Sign In & Access Dashboard' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto px-6 py-6 text-center text-xs text-slate-500 border-t border-slate-900 z-10 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>Student Success Analytics Platform © 2026</span>
        <span>Secure Role-Based Access for Students & Academic Advisors</span>
      </footer>
    </div>
  );
};
