import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Award,
  BookOpen,
  Clock,
  CheckCircle2,
  Sliders,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  Flame,
  Briefcase,
  Code2,
  Calendar,
  Layers,
  HelpCircle,
  Brain
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { User, StudentProfile, StreakData } from '../types';
import { api } from '../services/api';
import { StudentMetricsModal } from './StudentMetricsModal';

interface StudentDashboardProps {
  currentUser: User;
  profile: StudentProfile | null;
  streak: StreakData | null;
  onNavigateToTab: (tab: string) => void;
  onRefreshData: () => void;
  onOpenMetricsModal?: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  profile,
  streak,
  onNavigateToTab,
  onRefreshData,
  onOpenMetricsModal
}) => {
  // Modal & Simulation State
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [simCgpa, setSimCgpa] = useState(profile?.academics?.cgpa || 8.5);
  const [simBacklogs, setSimBacklogs] = useState(profile?.academics?.activeBacklogs || 0);
  const [simAttendance, setSimAttendance] = useState(profile?.attendance?.attendancePct || 90);
  const [simAssignmentPct, setSimAssignmentPct] = useState(profile?.lms?.assignmentCompletionPct || 95);
  const [simStudyHours, setSimStudyHours] = useState(profile?.lms?.weeklyStudyHours || 20);
  const [simCodingScore, setSimCodingScore] = useState(profile?.placement?.codingChallengeScore || 80);

  const [simResult, setSimResult] = useState<{
    simulatedScore: number;
    riskLevel: string;
    projected3MonthScore: number;
    predictionStatement: string;
  } | null>(null);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    if (!profile) {
      onRefreshData();
    }
  }, [profile, onRefreshData]);

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-slate-400 gap-4">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-300">
            Loading unified student analytics for {currentUser.name}...
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Connecting to real-time student telemetry matrix
          </p>
        </div>
        <button
          onClick={onRefreshData}
          className="mt-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
        >
          🔄 Refresh Student Analytics
        </button>
      </div>
    );
  }

  const handleSimulate = async () => {
    setSimulating(true);
    try {
      const res = await api.simulateMetrics(currentUser.id, {
        cgpa: simCgpa,
        activeBacklogs: simBacklogs,
        attendancePct: simAttendance,
        assignmentCompletionPct: simAssignmentPct,
        weeklyStudyHours: simStudyHours,
        codingChallengeScore: simCodingScore
      });
      setSimResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setSimulating(false);
    }
  };

  const currentScore = simResult ? simResult.simulatedScore : profile.successScore;
  const currentRisk = simResult ? simResult.riskLevel : profile.riskLevel;
  const isHighRisk = currentRisk === 'high';
  const isMediumRisk = currentRisk === 'medium';

  const scoreGradient =
    currentScore >= 85
      ? 'from-emerald-400 via-teal-300 to-sky-400'
      : currentScore >= 70
      ? 'from-amber-400 via-yellow-400 to-orange-400'
      : 'from-rose-500 via-red-500 to-amber-500';

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl glass-card border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-500/40 shadow-xl"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">{currentUser.name}</h1>
              {isHighRisk ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  Critical Academic Risk Flag
                </span>
              ) : isMediumRisk ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  Targeted Watchlist
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  High Success Probability
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {currentUser.batch} • Career Goal: <span className="text-brand-300 font-semibold">{currentUser.targetJobRole}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 border border-brand-500/40 transition shadow-sm"
          >
            <span>✏️ Enter / Update My Details</span>
          </button>
          <button
            onClick={() => setShowSimulator(!showSimulator)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <Sliders className="w-4 h-4 text-brand-400" />
            <span>{showSimulator ? 'Close Sandbox' : 'What-If Score Sandbox'}</span>
          </button>
          <button
            onClick={() => onNavigateToTab('interview')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white transition shadow-lg shadow-brand-500/25"
          >
            <Sparkles className="w-4 h-4" />
            <span>Proof of Build Voice Defense</span>
          </button>
        </div>
      </div>

      {/* 0-Scale Baseline Alert Notice (Requirement 2) */}
      {(!profile.hasProvidedData || profile.successScore === 0) && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-sky-950/40 via-indigo-950/30 to-purple-950/40 border border-sky-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-sky-500/20 text-sky-300 shrink-0">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                Baseline Data Pending (0 Scale)
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Your Student Profile is currently at 0 Scale
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                You have not provided your academic, attendance, LMS, or placement scores yet. Enter your details to calculate your real Success Score, analyze early risk flags, and connect your GitHub projects.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowEditModal(true)}
            className="px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/25 transition shrink-0"
          >
            ✏️ Enter My Details Now
          </button>
        </div>
      )}

      {/* At-Risk Warning Box (Shown if high/medium risk) */}
      {(isHighRisk || (profile.riskFlags && profile.riskFlags.length > 0)) && (
        <div className={`p-5 rounded-2xl border ${isHighRisk ? 'bg-rose-950/30 border-rose-500/40' : 'bg-amber-950/20 border-amber-500/30'}`}>
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-xl shrink-0 ${isHighRisk ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className={`text-sm font-bold ${isHighRisk ? 'text-rose-200' : 'text-amber-200'}`}>
                  {isHighRisk ? 'Early Warning Flags Requiring Action' : 'Targeted Placement & Attendance Flags'}
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-black/40 text-slate-300">
                  Surveillance Active
                </span>
              </div>
              <ul className="mt-2 space-y-1 text-xs text-slate-300">
                {profile.riskFlags.map((flag, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${isHighRisk ? 'bg-rose-400' : 'bg-amber-400'}`} />
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* What-If Simulation Sandbox */}
      {showSimulator && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-brand-500/40 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-brand-400" />
              <h3 className="text-sm font-bold text-white">
                What-If Predictive Sandbox: Multi-Pillar Simulator
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              Simulate changes in CGPA, backlogs, attendance, and coding to see the unified score recalculate
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>CGPA</span>
                <span className="text-brand-400">{simCgpa.toFixed(2)}/10</span>
              </div>
              <input
                type="range"
                min="4.0"
                max="10.0"
                step="0.1"
                value={simCgpa}
                onChange={(e) => setSimCgpa(parseFloat(e.target.value))}
                className="w-full accent-brand-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Backlogs</span>
                <span className={simBacklogs > 0 ? "text-rose-400" : "text-emerald-400"}>{simBacklogs} Active</span>
              </div>
              <input
                type="range"
                min="0"
                max="4"
                step="1"
                value={simBacklogs}
                onChange={(e) => setSimBacklogs(parseInt(e.target.value))}
                className="w-full accent-brand-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Attendance</span>
                <span className="text-brand-400">{simAttendance}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                step="1"
                value={simAttendance}
                onChange={(e) => setSimAttendance(parseInt(e.target.value))}
                className="w-full accent-brand-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>LMS Submissions</span>
                <span className="text-brand-400">{simAssignmentPct}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                step="1"
                value={simAssignmentPct}
                onChange={(e) => setSimAssignmentPct(parseInt(e.target.value))}
                className="w-full accent-brand-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>LMS Study Hours</span>
                <span className="text-brand-400">{simStudyHours}h/wk</span>
              </div>
              <input
                type="range"
                min="4"
                max="35"
                step="1"
                value={simStudyHours}
                onChange={(e) => setSimStudyHours(parseInt(e.target.value))}
                className="w-full accent-brand-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Placement Coding</span>
                <span className="text-brand-400">{simCodingScore}/100</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="2"
                value={simCodingScore}
                onChange={(e) => setSimCodingScore(parseInt(e.target.value))}
                className="w-full accent-brand-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              onClick={handleSimulate}
              disabled={simulating}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{simulating ? 'Recalculating Combined Formula...' : 'Run Simulation'}</span>
            </button>

            {simResult && (
              <div className="flex items-center gap-4 text-xs">
                <span className="text-slate-300">
                  Simulated Score:{' '}
                  <span className="font-extrabold text-sm text-brand-300">
                    {simResult.simulatedScore}%
                  </span>
                </span>
                <span className="text-slate-400">
                  {simResult.predictionStatement}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main KPI Row: Combined Success Score & The 6 Multi-Pillar Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Combined Success Score Hero Card */}
        <div className="lg:col-span-4 p-6 rounded-3xl glass-card border border-brand-500/30 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">
                Unified Composite Index
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                Pillars: 6/6
              </span>
            </div>

            <h2 className="text-lg font-black text-white mt-1">Student Success Score</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Academics + Attendance + LMS + Engagement + Placement Readiness + Skills
            </p>
          </div>

          {/* Radial Circular Score Display */}
          <div className="my-5 flex items-center justify-center">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-800"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 * (1 - currentScore / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                  className={
                    currentScore >= 85
                      ? 'text-brand-400'
                      : currentScore >= 70
                      ? 'text-amber-400'
                      : 'text-rose-500'
                  }
                  style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className={`text-4xl font-black bg-gradient-to-r ${scoreGradient} bg-clip-text text-transparent`}>
                  {currentScore}
                </span>
                <span className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">
                  Out of 100
                </span>
              </div>
            </div>
          </div>

          {/* Explainable Factor Pills */}
          <div className="space-y-1.5 pt-3 border-t border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
              Top Score Contributors:
            </span>
            {(profile.explainableFactors || []).slice(0, 3).map((factor, i) => (
              <div key={i} className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300 truncate max-w-[170px]">{factor.indicator}</span>
                <span className={`font-bold ${factor.type === 'positive' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {factor.contribution}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 6 Multi-Pillar Breakdown Cards */}
        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          {/* Pillar 1: Academics (CGPA, marks, backlogs) */}
          <div className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-sky-400 uppercase">1. Academics</span>
              <Award className="w-4 h-4 text-sky-400" />
            </div>
            <div className="mt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">{profile.academics?.cgpa ?? 0}</span>
                <span className="text-[10px] text-slate-400">/ 10 CGPA</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Marks: <strong className="text-slate-200">{profile.academics?.marksPct ?? 0}%</strong>
              </div>
              <div className={`text-[11px] font-bold mt-0.5 ${(profile.academics?.activeBacklogs ?? 0) > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {profile.academics?.activeBacklogs ?? 0} Active Backlogs
              </div>
            </div>
          </div>

          {/* Pillar 2: Attendance */}
          <div className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-400 uppercase">2. Attendance</span>
              <Clock className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">{profile.attendance?.attendancePct ?? 0}%</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {profile.attendance?.lecturesAttended ?? 0}/{profile.attendance?.totalLectures ?? 0} Lectures
              </div>
              <div className={`text-[11px] font-bold mt-0.5 ${(profile.attendance?.attendancePct ?? 0) >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {(profile.attendance?.attendancePct ?? 0) >= 75 ? 'Above Threshold' : 'Debarment Risk'}
              </div>
            </div>
          </div>

          {/* Pillar 3: LMS & Assignments */}
          <div className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-purple-400 uppercase">3. LMS & Labs</span>
              <BookOpen className="w-4 h-4 text-purple-400" />
            </div>
            <div className="mt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">{profile.lms?.assignmentCompletionPct ?? 0}%</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Submissions Completed
              </div>
              <div className="text-[11px] text-purple-300 font-semibold mt-0.5">
                {profile.lms?.weeklyStudyHours ?? 0} hrs/wk online
              </div>
            </div>
          </div>

          {/* Pillar 4: Engagement (Events, Hackathons, Certs) */}
          <div className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-400 uppercase">4. Engagement</span>
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">{profile.engagement?.eventsAttended ?? 0}</span>
                <span className="text-[10px] text-slate-400">Events</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {profile.engagement?.hackathonsCount ?? 0} Hackathons
              </div>
              <div className="text-[11px] text-amber-300 font-semibold mt-0.5">
                {profile.engagement?.certificationsCount ?? 0} Certifications
              </div>
            </div>
          </div>

          {/* Pillar 5: Placement Readiness (Aptitude, Coding, Mock) */}
          <div className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-rose-400 uppercase">5. Placement</span>
              <Briefcase className="w-4 h-4 text-rose-400" />
            </div>
            <div className="mt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">{profile.placement?.codingChallengeScore ?? 0}</span>
                <span className="text-[10px] text-slate-400">/ 100 Coding</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Aptitude: <strong className="text-slate-200">{profile.placement?.aptitudeScore ?? 0}</strong>
              </div>
              <div className="text-[11px] text-rose-300 font-semibold mt-0.5">
                Mock Interview: {profile.placement?.mockInterviewScore ?? 0}/100
              </div>
            </div>
          </div>

          {/* Pillar 6: Skills Assessments */}
          <div className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-indigo-400 uppercase">6. Skills Core</span>
              <Brain className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="mt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">{profile.skillsAssessments?.dsaScore ?? 0}</span>
                <span className="text-[10px] text-slate-400">DSA Score</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                System Design: <strong className="text-slate-200">{profile.skillsAssessments?.systemDesignScore ?? 0}</strong>
              </div>
              <div className="text-[11px] text-indigo-300 font-semibold mt-0.5">
                Core CS: {profile.skillsAssessments?.coreCsScore ?? 0}/100
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* "Future You" 3-Month Projection Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-950/60 via-slate-900 to-indigo-950/40 border border-brand-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-2xl bg-brand-500/20 text-brand-300 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">
              Future You Prediction Engine
            </span>
            <h3 className="text-lg font-black text-white mt-0.5">
              "{profile.futureYou?.statement || 'Enter your academic metrics to generate your 3-month trajectory.'}"
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Target Milestone: <strong className="text-emerald-400">{profile.futureYou?.targetMilestone || 'Baseline Data Pending'}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateToTab('future-you')}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 self-start md:self-auto shrink-0"
        >
          <span>Explore Timeline & What-If Forecast</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Historical Progress Over Time Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 p-6 rounded-2xl glass-card border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Monthly Progress Trajectory</h3>
              <p className="text-xs text-slate-400">Historical combined score across past 5 months</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
              Verified Academic Records
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={profile.history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis domain={[40, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
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
                  dataKey="score"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#scoreArea)"
                  name="Combined Success Score"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Suggested Topics to Learn Next */}
        <div className="lg:col-span-4 p-6 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-purple-400" />
                <span>Next AI Learning Units</span>
              </h3>
              <span className="text-[10px] text-purple-400 font-bold uppercase">To Lift Score</span>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-bold text-brand-300 block">Security & Distributed Auth</span>
                <p className="text-xs font-semibold text-white mt-0.5">Zero-Knowledge Proofs in Auth</p>
                <span className="text-[10px] text-slate-400 block mt-1">+120 XP • Bolsters Security DNA Node</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-bold text-indigo-300 block">Placement Coding</span>
                <p className="text-xs font-semibold text-white mt-0.5">Dynamic Programming Graphs</p>
                <span className="text-[10px] text-slate-400 block mt-1">+95 XP • Lifts Placement Readiness</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab('skill-dna')}
            className="w-full mt-4 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <span>Open Interactive Skill DNA Map</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Enter / Update Metrics Modal */}
      <StudentMetricsModal
        currentUser={currentUser}
        profile={profile}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={onRefreshData}
      />
    </div>
  );
};
