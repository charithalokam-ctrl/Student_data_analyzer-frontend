import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  AlertTriangle,
  CheckCircle2,
  Users,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  Clock,
  BookOpen,
  Briefcase,
  Layers,
  Award,
  Brain,
  MessageSquare,
  Calendar,
  Mail,
  UserCheck
} from 'lucide-react';
import { User, StudentProfile } from '../types';
import { api } from '../services/api';

interface EducatorDashboardProps {
  onSelectStudent: (student: User) => void;
}

export const EducatorDashboard: React.FC<EducatorDashboardProps> = ({ onSelectStudent }) => {
  const [data, setData] = useState<{
    students: Array<User & { profile: StudentProfile; streak: number; verifiedProjectsCount: number }>;
    summary: {
      totalStudents: number;
      criticalRiskCount: number;
      watchlistCount: number;
      avgSuccessScore: number;
      avgAttendance: number;
      avgPlacementReadiness: number;
    };
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [segmentFilter, setSegmentFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Drill-down Student Profile Modal
  const [drilldownStudent, setDrilldownStudent] = useState<
    (User & { profile: StudentProfile; streak: number; verifiedProjectsCount: number }) | null
  >(null);
  const [interventionNote, setInterventionNote] = useState('');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  useEffect(() => {
    loadCohort();
  }, []);

  const loadCohort = async () => {
    try {
      setLoading(true);
      const res = await api.getAllStudents();
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleIntervention = async (studentId: string, interventionType: string) => {
    try {
      const res = await api.logIntervention({
        studentId,
        interventionType,
        notes: interventionNote,
        facultyName: 'Dr. Sarah Lin (Faculty Dean)'
      });
      setActionFeedback(res.message);
      setInterventionNote('');
      setTimeout(() => setActionFeedback(null), 4500);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center p-16 text-slate-400">
        Loading Faculty Intelligence & Risk Surveillance Hub...
      </div>
    );
  }

  const { students, summary } = data;

  // Filter by segmentation and search
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.batch?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (segmentFilter === 'all') return true;
    if (segmentFilter === 'high-academics-low-placement') {
      return (
        s.segmentation === 'high-academics-low-placement' ||
        ((s.profile?.academics?.cgpa ?? 0) >= 8.5 && (s.profile?.placement?.codingChallengeScore ?? 0) < 60)
      );
    }
    if (segmentFilter === 'high-placement-low-attendance') {
      return (
        s.segmentation === 'high-placement-low-attendance' ||
        ((s.profile?.placement?.codingChallengeScore ?? 0) >= 80 && (s.profile?.attendance?.attendancePct ?? 0) < 75)
      );
    }
    if (segmentFilter === 'critical-academic-risk') {
      return s.profile?.riskLevel === 'high' || s.segmentation === 'critical-academic-risk';
    }
    if (segmentFilter === 'all-round-leader') {
      return s.profile?.riskLevel === 'low' && (s.profile?.successScore ?? 0) >= 85;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Faculty Hub Header Banner */}
      <div className="p-6 rounded-3xl glass-card border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-purple-500/15 text-purple-400 border border-purple-500/30 shadow-lg">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">
                Faculty & Admin Surveillance Hub: Academic & Placement Risk Matrix
              </h1>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Dean Access
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Real-time multi-indicator surveillance. Explainable scoring reveals specific drivers of risk—separating students who struggle with course theory from those at risk of failing corporate placement drives.
            </p>
          </div>
        </div>

        <button
          onClick={loadCohort}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition self-start md:self-auto"
        >
          Refresh Cohort Live Feed
        </button>
      </div>

      {actionFeedback && (
        <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 text-xs font-semibold text-purple-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
            <span>{actionFeedback}</span>
          </div>
          <button onClick={() => setActionFeedback(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Cohort Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-card border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Cohort Tracked</span>
          <span className="text-3xl font-black text-white mt-1 block">{summary.totalStudents} Students</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">3 Academic Batches</span>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-rose-500/40 bg-rose-950/15">
          <span className="text-[10px] uppercase font-bold text-rose-300 block">Critical Risk Flags</span>
          <span className="text-3xl font-black text-rose-400 mt-1 block">{summary.criticalRiskCount} Flagged</span>
          <span className="text-[10px] text-rose-300 block mt-0.5">Debarment or Backlog Barrier</span>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-amber-500/30 bg-amber-950/10">
          <span className="text-[10px] uppercase font-bold text-amber-300 block">Targeted Watchlist</span>
          <span className="text-3xl font-black text-amber-400 mt-1 block">{summary.watchlistCount} Students</span>
          <span className="text-[10px] text-amber-300 block mt-0.5">Placement or Attendance Deficit</span>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Cohort Average Success</span>
          <span className="text-3xl font-black text-brand-400 mt-1 block">{summary.avgSuccessScore}%</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Avg Attendance: {summary.avgAttendance}%</span>
        </div>
      </div>

      {/* Student Segmentation Tabs & Search */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span>Targeted Student Segmentation</span>
            </h3>
            <p className="text-xs text-slate-400">Select segment for targeted pedagogical or placement intervention</p>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search student or batch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 w-64"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Segment Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          {[
            { id: 'all', label: 'All Students' },
            { id: 'high-academics-low-placement', label: 'High Academics, Low Placement' },
            { id: 'high-placement-low-attendance', label: 'High Placement, Attendance Risk' },
            { id: 'critical-academic-risk', label: 'Critical Academic Risk' },
            { id: 'all-round-leader', label: 'All-Round Leaders' }
          ].map((seg) => (
            <button
              key={seg.id}
              onClick={() => setSegmentFilter(seg.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                segmentFilter === seg.id
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
              }`}
            >
              {seg.label}
            </button>
          ))}
        </div>

        {/* Student Surveillance Table */}
        <div className="space-y-3 pt-3">
          {filteredStudents.map((st) => {
            const p = st.profile || {};
            const isHigh = p.riskLevel === 'high';
            const isMed = p.riskLevel === 'medium';
            const cgpa = p.academics?.cgpa ?? 0;
            const backlogs = p.academics?.activeBacklogs ?? 0;
            const attPct = p.attendance?.attendancePct ?? 0;
            const lecturesAtt = p.attendance?.lecturesAttended ?? 0;
            const codingScore = p.placement?.codingChallengeScore ?? 0;
            const aptScore = p.placement?.aptitudeScore ?? 0;
            const succScore = p.successScore ?? 0;

            return (
              <div
                key={st.id}
                className={`p-4 rounded-2xl border transition flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                  isHigh
                    ? 'bg-rose-950/25 border-rose-500/40 shadow-lg shadow-rose-950/20'
                    : isMed
                    ? 'bg-amber-950/15 border-amber-500/30'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Student Info */}
                <div className="flex items-center gap-3 min-w-[220px]">
                  <img
                    src={st.avatar}
                    alt={st.name}
                    className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-700"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">{st.name}</h4>
                      {isHigh ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          Critical Flag
                        </span>
                      ) : isMed ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Watchlist
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                          On Track
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">{st.batch}</p>
                    <span className="text-[10px] text-purple-300 font-medium">
                      Goal: {st.targetJobRole}
                    </span>
                  </div>
                </div>

                {/* Score & Pillar Stats */}
                <div className="grid grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">CGPA</span>
                    <span className="font-bold text-white">{cgpa}/10</span>
                    <span className={`text-[10px] block ${backlogs > 0 ? 'text-rose-400 font-bold' : 'text-slate-500'}`}>
                      {backlogs} Backlogs
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block">Attendance</span>
                    <span className={`font-bold ${attPct < 75 ? 'text-rose-400' : 'text-white'}`}>
                      {attPct}%
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {lecturesAtt} classes
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block">Placement Coding</span>
                    <span className={`font-bold ${codingScore < 60 ? 'text-rose-400' : 'text-white'}`}>
                      {codingScore}/100
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Aptitude: {aptScore}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block">Success Score</span>
                    <span className={`text-base font-black ${isHigh ? 'text-rose-400' : isMed ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {succScore}%
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Streak: {st.streak}d
                    </span>
                  </div>
                </div>

                {/* Explainable Factor Snippet */}
                <div className="text-[11px] max-w-xs text-slate-300">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Key Driver:
                  </span>
                  <span>{p.explainableFactors?.[0]?.note || 'Baseline pending submission'}</span>
                </div>

                {/* Drill-down Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setDrilldownStudent(st)}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs transition shadow-md shadow-purple-500/20"
                  >
                    Drill-Down Profile
                  </button>
                  <button
                    onClick={() => onSelectStudent(st)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
                  >
                    Student View
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Drill-Down Individual Student Unified Profile Modal */}
      {drilldownStudent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl my-8 bg-slate-950 rounded-3xl border border-purple-500/40 p-6 max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <img
                  src={drilldownStudent.avatar}
                  alt={drilldownStudent.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-500/40"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-white">{drilldownStudent.name}</h2>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-brand-300">
                      Success Score: {drilldownStudent.profile.successScore}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {drilldownStudent.batch} • {drilldownStudent.email}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setDrilldownStudent(null)}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            {/* 6 Unified Indicators Matrix */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Unified 6-Indicator Diagnostic Breakdown
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">1. Academics</span>
                  <div className="text-sm font-extrabold text-white mt-1">
                    {drilldownStudent.profile?.academics?.cgpa ?? 0} CGPA ({drilldownStudent.profile?.academics?.marksPct ?? 0}%)
                  </div>
                  <span className={`text-[11px] block mt-0.5 ${(drilldownStudent.profile?.academics?.activeBacklogs ?? 0) > 0 ? 'text-rose-400 font-bold' : 'text-emerald-400'}`}>
                    {drilldownStudent.profile?.academics?.activeBacklogs ?? 0} Active Backlogs
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">2. Attendance</span>
                  <div className="text-sm font-extrabold text-white mt-1">
                    {drilldownStudent.profile?.attendance?.attendancePct ?? 0}%
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {drilldownStudent.profile?.attendance?.lecturesAttended ?? 0}/{drilldownStudent.profile?.attendance?.totalLectures ?? 0} Lectures
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">3. LMS Submissions</span>
                  <div className="text-sm font-extrabold text-white mt-1">
                    {drilldownStudent.profile?.lms?.assignmentCompletionPct ?? 0}% Completed
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {drilldownStudent.profile?.lms?.weeklyStudyHours ?? 0} hrs/wk online
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">4. Engagement</span>
                  <div className="text-sm font-extrabold text-white mt-1">
                    {drilldownStudent.profile?.engagement?.eventsAttended ?? 0} Events Attended
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {drilldownStudent.profile?.engagement?.hackathonsCount ?? 0} Hackathons • {drilldownStudent.profile?.engagement?.certificationsCount ?? 0} Certs
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">5. Placement Readiness</span>
                  <div className="text-sm font-extrabold text-white mt-1">
                    {drilldownStudent.profile?.placement?.codingChallengeScore ?? 0}/100 Coding
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Aptitude: {drilldownStudent.profile?.placement?.aptitudeScore ?? 0} • Mock: {drilldownStudent.profile?.placement?.mockInterviewScore ?? 0}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">6. Skills Core</span>
                  <div className="text-sm font-extrabold text-white mt-1">
                    {drilldownStudent.profile?.skillsAssessments?.dsaScore ?? 0}/100 DSA
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    System Design: {drilldownStudent.profile?.skillsAssessments?.systemDesignScore ?? 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Explainable Factor Details */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <h4 className="text-xs font-bold text-white mb-2">Explainable Indicator Contributions:</h4>
              <div className="space-y-2">
                {drilldownStudent.profile.explainableFactors.map((factor, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg bg-black/40">
                    <div>
                      <span className="font-bold text-slate-200">{factor.indicator}</span>
                      <p className="text-[11px] text-slate-400">{factor.note}</p>
                    </div>
                    <span className={`font-black ${factor.type === 'positive' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {factor.contribution}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Targeted Faculty Intervention Actions */}
            <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-3">
              <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                Targeted Intervention Dispatcher
              </h4>

              <input
                type="text"
                placeholder="Optional advisor note or customized action instructions..."
                value={interventionNote}
                onChange={(e) => setInterventionNote(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => handleIntervention(drilldownStudent.id, 'Mandatory 1-on-1 Academic Counseling Scheduled')}
                  className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Schedule 1-on-1 Counseling</span>
                </button>

                <button
                  onClick={() => handleIntervention(drilldownStudent.id, 'Enrolled in Remedial Placement DSA Bootcamp')}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Brain className="w-3.5 h-3.5 text-brand-400" />
                  <span>Assign Placement Bootcamp</span>
                </button>

                <button
                  onClick={() => handleIntervention(drilldownStudent.id, 'Assigned High-Performing Peer Mentor (Alex Mercer)')}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Assign Peer Mentor</span>
                </button>

                <button
                  onClick={() => handleIntervention(drilldownStudent.id, 'Granted 7-Day Lab Submission Extension')}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Grant Lab Extension</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
