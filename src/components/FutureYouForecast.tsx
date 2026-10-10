import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Briefcase,
  Sparkles,
  Sliders,
  CheckCircle2,
  Calendar,
  Compass,
  ArrowRight,
  ShieldCheck,
  Target
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { User, FutureForecast } from '../types';
import { api } from '../services/api';

interface FutureYouForecastProps {
  currentUser: User;
}

export const FutureYouForecast: React.FC<FutureYouForecastProps> = ({ currentUser }) => {
  const [forecast, setForecast] = useState<FutureForecast | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulation Sliders
  const [simHours, setSimHours] = useState(24);
  const [simAssignments, setSimAssignments] = useState(98);
  const [simVerifiedProjects, setSimVerifiedProjects] = useState(2);
  const [projectedMonths, setProjectedMonths] = useState<number | null>(null);
  const [readinessScore, setReadinessScore] = useState<number | null>(null);
  const [simSummary, setSimSummary] = useState<string | null>(null);

  useEffect(() => {
    loadForecast();
  }, [currentUser]);

  const loadForecast = async () => {
    try {
      setLoading(true);
      const data = await api.getFutureYou(currentUser.id);
      setForecast(data);
      setProjectedMonths(data.currentPaceMonths);
      setReadinessScore(data.readinessScore);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulate = async () => {
    try {
      const res = await api.simulateFuture({
        weeklyHours: simHours,
        assignmentsRate: simAssignments,
        verifiedProjects: simVerifiedProjects
      });
      setProjectedMonths(res.projectedMonths);
      setReadinessScore(res.readinessScore);
      setSimSummary(res.trajectorySummary);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || !forecast) {
    return <div className="p-8 text-slate-400">Projecting Career Readiness Curve...</div>;
  }

  const isZeroBaseline = forecast.readinessScore === 0;
  const currentMonths = projectedMonths ?? forecast.currentPaceMonths;
  const currentReadiness = readinessScore ?? forecast.readinessScore;
  const paceDisplay = isZeroBaseline && currentMonths === 0 ? '~6 Months (Est.)' : `${currentMonths} Months`;

  return (
    <div className="space-y-6">
      {/* 0-Scale Baseline Notice */}
      {isZeroBaseline && (
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Target className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              <strong>Academic Baseline Pending:</strong> Your profile is currently at 0 scale. Enter your academic, attendance, and placement details on the Dashboard to calculate your personalized dynamic forecast.
            </span>
          </div>
        </div>
      )}

      {/* Hero Forecast Card */}
      <div className="p-8 rounded-3xl glass-card border border-brand-500/40 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-brand-500/20 via-sky-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/30 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Trajectory Predictive Model</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              If you keep this pace, you'll be job-ready in{' '}
              <span className="bg-gradient-to-r from-brand-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent underline decoration-brand-500/50 decoration-wavy">
                {paceDisplay}
              </span>
            </h1>

            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Target Role:{' '}
              <span className="font-bold text-white">{forecast.targetRole}</span> • Market
              Readiness Percentile:{' '}
              <span className="font-bold text-emerald-400">
                {isZeroBaseline ? 'Baseline Incomplete' : 'Top 92% of Tier-1 Applicants'}
              </span>
            </p>

            <div className="mt-5 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
              <Compass className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Predictive Guidance:</span>
                <p className="mt-0.5 text-slate-300 leading-relaxed">
                  {simSummary || forecast.aiAdvice}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 text-center flex flex-col items-center justify-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Composite Readiness Score
            </span>
            <div className="my-3 text-5xl font-black text-brand-400">
              {currentReadiness}
              <span className="text-lg text-slate-400 font-bold">/100</span>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              {isZeroBaseline ? '0 Scale Initialized' : 'Accelerated Placement Trajectory'}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Simulation Sandbox */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-brand-400" />
            <h3 className="text-base font-bold text-white">
              Pace Simulator — Test Alternate Study Trajectories
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Slide values to see how hours and verified projects affect graduation timeline
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
              <span>Weekly Learning / Coding Hours</span>
              <span className="text-brand-400 font-bold">{simHours} hrs/wk</span>
            </div>
            <input
              type="range"
              min="10"
              max="40"
              step="1"
              value={simHours}
              onChange={(e) => {
                setSimHours(parseInt(e.target.value));
              }}
              onMouseUp={handleSimulate}
              onTouchEnd={handleSimulate}
              className="w-full accent-brand-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
              <span>Assignment Consistency</span>
              <span className="text-brand-400 font-bold">{simAssignments}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              step="2"
              value={simAssignments}
              onChange={(e) => {
                setSimAssignments(parseInt(e.target.value));
              }}
              onMouseUp={handleSimulate}
              onTouchEnd={handleSimulate}
              className="w-full accent-brand-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
              <span>Proof-of-Build Verified Projects</span>
              <span className="text-brand-400 font-bold">{simVerifiedProjects} Projects</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={simVerifiedProjects}
              onChange={(e) => {
                setSimVerifiedProjects(parseInt(e.target.value));
              }}
              onMouseUp={handleSimulate}
              onTouchEnd={handleSimulate}
              className="w-full accent-brand-500 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleSimulate}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white transition flex items-center gap-1.5"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Update Future Prediction Curve</span>
          </button>

          <span className="text-xs text-slate-400">
            Projected: <strong className="text-white">{currentMonths} months</strong> to Tier-1 job ready
          </span>
        </div>
      </div>

      {/* Trajectory Timeline Chart & Competency Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Timeline Chart */}
        <div className="lg:col-span-7 p-6 rounded-2xl glass-card border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Readiness Trajectory by Month</h3>
              <p className="text-xs text-slate-400">Forecasted market percentile progression</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecast.projections} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="readinessGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '11px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="readiness"
                  stroke="#818cf8"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#readinessGrad)"
                  name="Job Readiness Score"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Competency Sub-Breakdown Cards */}
        <div className="lg:col-span-5 p-6 rounded-2xl glass-card border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white">Competency Readiness Pillars</h3>

          {Object.entries(forecast.breakdown).map(([key, val]) => {
            const numVal = Number(val);
            const labelMap: Record<string, string> = {
              systemDesign: 'System Architecture & Scalability',
              codingProficiency: 'Algorithmic Speed & Clean Code',
              verifiedBuildProof: 'Proof-of-Build Authenticity',
              dailyConsistency: 'Daily Learning Habit Consistency',
              interviewReadiness: 'Technical Spoken Articulation'
            };

            return (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{labelMap[key] || key}</span>
                  <span className="font-bold text-brand-400">{numVal}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-500 h-full rounded-full"
                    style={{ width: `${numVal}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
