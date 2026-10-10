import React, { useState } from 'react';
import { X, Sparkles, BookOpen, Clock, Briefcase, Brain, Award, Layers } from 'lucide-react';
import { User, StudentProfile } from '../types';
import { api } from '../services/api';

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

interface StudentMetricsModalProps {
  currentUser: User;
  profile: StudentProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const StudentMetricsModal: React.FC<StudentMetricsModalProps> = ({
  currentUser,
  profile,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'academics' | 'attendance' | 'lms' | 'placement' | 'skills' | 'github'>('academics');
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [cgpa, setCgpa] = useState<number>(profile?.academics?.cgpa || 0);
  const [marksPct, setMarksPct] = useState<number>(profile?.academics?.marksPct || 0);
  const [activeBacklogs, setActiveBacklogs] = useState<number>(profile?.academics?.activeBacklogs || 0);
  const [completedCredits, setCompletedCredits] = useState<number>(profile?.academics?.completedCredits || 0);
  const [totalCredits, setTotalCredits] = useState<number>(profile?.academics?.totalCredits || 160);

  const [attendancePct, setAttendancePct] = useState<number>(profile?.attendance?.attendancePct || 0);
  const [lecturesAttended, setLecturesAttended] = useState<number>(profile?.attendance?.lecturesAttended || 0);
  const [totalLectures, setTotalLectures] = useState<number>(profile?.attendance?.totalLectures || 180);

  const [assignmentCompletionPct, setAssignmentCompletionPct] = useState<number>(profile?.lms?.assignmentCompletionPct || 0);
  const [weeklyLogins, setWeeklyLogins] = useState<number>(profile?.lms?.weeklyLogins || 0);
  const [weeklyStudyHours, setWeeklyStudyHours] = useState<number>(profile?.lms?.weeklyStudyHours || 0);

  const [eventsAttended, setEventsAttended] = useState<number>(profile?.engagement?.eventsAttended || 0);
  const [hackathonsCount, setHackathonsCount] = useState<number>(profile?.engagement?.hackathonsCount || 0);
  const [certificationsCount, setCertificationsCount] = useState<number>(profile?.engagement?.certificationsCount || 0);

  const [aptitudeScore, setAptitudeScore] = useState<number>(profile?.placement?.aptitudeScore || 0);
  const [codingChallengeScore, setCodingChallengeScore] = useState<number>(profile?.placement?.codingChallengeScore || 0);
  const [mockInterviewScore, setMockInterviewScore] = useState<number>(profile?.placement?.mockInterviewScore || 0);

  const [dsaScore, setDsaScore] = useState<number>(profile?.skillsAssessments?.dsaScore || 0);
  const [systemDesignScore, setSystemDesignScore] = useState<number>(profile?.skillsAssessments?.systemDesignScore || 0);
  const [coreCsScore, setCoreCsScore] = useState<number>(profile?.skillsAssessments?.coreCsScore || 0);

  // GitHub & Project State (Requirement 5)
  const [githubUsername, setGithubUsername] = useState<string>(currentUser.githubUsername || '');
  const [targetJobRole, setTargetJobRole] = useState<string>(currentUser.targetJobRole || 'Full-Stack Software Engineer');
  const [projectTitle, setProjectTitle] = useState<string>('');
  const [projectTechStack, setProjectTechStack] = useState<string>('React, Node.js, Express, MongoDB');
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [sampleSnippet, setSampleSnippet] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMsg(null);

    try {
      // 1. Update student profile metrics
      await api.updateStudentMetrics(currentUser.id, {
        cgpa: Number(cgpa),
        marksPct: Number(marksPct),
        activeBacklogs: Number(activeBacklogs),
        completedCredits: Number(completedCredits),
        totalCredits: Number(totalCredits),
        attendancePct: Number(attendancePct),
        lecturesAttended: Number(lecturesAttended),
        totalLectures: Number(totalLectures),
        assignmentCompletionPct: Number(assignmentCompletionPct),
        weeklyLogins: Number(weeklyLogins),
        weeklyStudyHours: Number(weeklyStudyHours),
        eventsAttended: Number(eventsAttended),
        hackathonsCount: Number(hackathonsCount),
        certificationsCount: Number(certificationsCount),
        aptitudeScore: Number(aptitudeScore),
        codingChallengeScore: Number(codingChallengeScore),
        mockInterviewScore: Number(mockInterviewScore),
        dsaScore: Number(dsaScore),
        systemDesignScore: Number(systemDesignScore),
        coreCsScore: Number(coreCsScore),
        targetJobRole,
        githubUsername
      });

      // 2. If student provided a project title, also register the GitHub project repository
      if (projectTitle.trim()) {
        await api.addGithubRepo({
          studentId: currentUser.id,
          title: projectTitle.trim(),
          description: projectDescription.trim() || 'Built and submitted by student user for proof-of-build technical defense.',
          techStack: projectTechStack.split(',').map((s) => s.trim()).filter(Boolean),
          sampleSnippet: sampleSnippet.trim()
        });
      }

      setStatusMsg({
        type: 'success',
        text: 'Academic details & GitHub profile saved successfully! Recalculating unified score...'
      });

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text: err.message || 'Failed to save student metrics.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl border border-slate-700/80 bg-[#0c1220] p-6 sm:p-8 shadow-2xl text-left max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-500 to-sky-400 flex items-center justify-center shadow-lg shadow-brand-500/20 text-white shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Enter / Update Academic & Profile Details</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Submit your real metrics to calculate your Student Success Score and unlock AI career forecasts.
            </p>
          </div>
        </div>

        {statusMsg && (
          <div
            className={`p-3.5 rounded-xl text-xs font-semibold mb-5 border ${
              statusMsg.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
            }`}
          >
            {statusMsg.text}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 border-b border-slate-800 pb-3 mb-6 overflow-x-auto no-scrollbar">
          {[
            { id: 'academics', label: '1. Academics', icon: BookOpen },
            { id: 'attendance', label: '2. Attendance', icon: Clock },
            { id: 'lms', label: '3. LMS & Engagement', icon: Layers },
            { id: 'placement', label: '4. Placement Readiness', icon: Briefcase },
            { id: 'skills', label: '5. Skills DNA', icon: Brain },
            { id: 'github', label: '6. GitHub & Projects', icon: Award }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tab 1: Academics */}
          {activeTab === 'academics' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-sm font-bold text-sky-400 flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Academic Metrics (Grades & Backlogs)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Cumulative GPA (0.0 - 10.0)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={cgpa}
                    onChange={(e) => setCgpa(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:border-brand-500 focus:outline-none"
                    placeholder="e.g. 8.5"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Overall Marks Percentage (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={marksPct}
                    onChange={(e) => setMarksPct(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:border-brand-500 focus:outline-none"
                    placeholder="e.g. 85"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Active Backlogs Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={activeBacklogs}
                    onChange={(e) => setActiveBacklogs(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:border-brand-500 focus:outline-none"
                    placeholder="0"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Zero backlogs qualify you for 100% of campus placement screening tests.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Completed Credits / Total
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="200"
                      value={completedCredits}
                      onChange={(e) => setCompletedCredits(parseInt(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:border-brand-500 focus:outline-none"
                      placeholder="Completed (e.g. 85)"
                    />
                    <span className="text-slate-500 font-bold">/</span>
                    <input
                      type="number"
                      min="1"
                      max="200"
                      value={totalCredits}
                      onChange={(e) => setTotalCredits(parseInt(e.target.value) || 160)}
                      className="w-24 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:border-brand-500 focus:outline-none"
                      placeholder="160"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Attendance */}
          {activeTab === 'attendance' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Attendance & Classroom Consistency
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Overall Attendance Percentage (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={attendancePct}
                    onChange={(e) => setAttendancePct(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:border-brand-500 focus:outline-none"
                    placeholder="e.g. 92"
                    required
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    University threshold is 75%. Below 75% triggers an immediate Debarment Risk flag.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Lectures Attended / Total Lectures
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={lecturesAttended}
                      onChange={(e) => setLecturesAttended(parseInt(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:border-brand-500 focus:outline-none"
                      placeholder="Attended (e.g. 165)"
                    />
                    <span className="text-slate-500 font-bold">/</span>
                    <input
                      type="number"
                      min="1"
                      value={totalLectures}
                      onChange={(e) => setTotalLectures(parseInt(e.target.value) || 180)}
                      className="w-24 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:border-brand-500 focus:outline-none"
                      placeholder="180"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: LMS & Engagement */}
          {activeTab === 'lms' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-sm font-bold text-purple-400 flex items-center gap-2">
                <Layers className="w-4 h-4" /> LMS Portal & Campus Engagement
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    LMS Assignment Submission Rate (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={assignmentCompletionPct}
                    onChange={(e) => setAssignmentCompletionPct(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:border-brand-500 focus:outline-none"
                    placeholder="e.g. 95"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Weekly Online Study Hours
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="80"
                    value={weeklyStudyHours}
                    onChange={(e) => setWeeklyStudyHours(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:border-brand-500 focus:outline-none"
                    placeholder="e.g. 20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Events Attended
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={eventsAttended}
                    onChange={(e) => setEventsAttended(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:border-brand-500 focus:outline-none"
                    placeholder="e.g. 4"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Hackathons & Certifications
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      min="0"
                      value={hackathonsCount}
                      onChange={(e) => setHackathonsCount(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:border-brand-500 focus:outline-none"
                      placeholder="Hackathons (1)"
                    />
                    <input
                      type="number"
                      min="0"
                      value={certificationsCount}
                      onChange={(e) => setCertificationsCount(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:border-brand-500 focus:outline-none"
                      placeholder="Certs (2)"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Placement Readiness */}
          {activeTab === 'placement' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Campus Placement Readiness (0 - 100)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Coding Challenge Score
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={codingChallengeScore}
                    onChange={(e) => setCodingChallengeScore(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:border-brand-500 focus:outline-none"
                    placeholder="e.g. 85"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    LeetCode / HackerRank / Campus coding test score.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    General Aptitude Score
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={aptitudeScore}
                    onChange={(e) => setAptitudeScore(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:border-brand-500 focus:outline-none"
                    placeholder="e.g. 82"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Quantitative, logical & verbal aptitude screening.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Mock Interview Score
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={mockInterviewScore}
                    onChange={(e) => setMockInterviewScore(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:border-brand-500 focus:outline-none"
                    placeholder="e.g. 80"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Technical articulation & behavioural interview rating.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Skills DNA */}
          {activeTab === 'skills' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
                <Brain className="w-4 h-4" /> Core Computer Science Assessments (0 - 100)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Data Structures & Algorithms
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={dsaScore}
                    onChange={(e) => setDsaScore(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:border-brand-500 focus:outline-none"
                    placeholder="e.g. 85"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    System Design & Architecture
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={systemDesignScore}
                    onChange={(e) => setSystemDesignScore(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:border-brand-500 focus:outline-none"
                    placeholder="e.g. 78"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Core CS (OS, DBMS, Networks)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={coreCsScore}
                    onChange={(e) => setCoreCsScore(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:border-brand-500 focus:outline-none"
                    placeholder="e.g. 82"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 6: GitHub & Projects (Requirement 5) */}
          {activeTab === 'github' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-sm font-bold text-sky-400 flex items-center gap-2">
                <GithubIcon className="w-4 h-4 text-white" /> GitHub Account & Built Projects (Defense Prep)
              </h3>
              <p className="text-xs text-slate-400">
                Provide your GitHub handle and project details. Our AI will inspect your architectural logic and ask spoken defense questions to verify genuine building knowledge.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    GitHub Username
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 text-xs">@</span>
                    <input
                      type="text"
                      value={githubUsername}
                      onChange={(e) => setGithubUsername(e.target.value)}
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:border-brand-500 focus:outline-none"
                      placeholder="e.g. rizawan-dev"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Target Job Role / Career Goal
                  </label>
                  <input
                    type="text"
                    value={targetJobRole}
                    onChange={(e) => setTargetJobRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:border-brand-500 focus:outline-none"
                    placeholder="e.g. Full-Stack Software Engineer"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-200 block">
                  Add Your Built Project to Verify:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Project Title
                    </label>
                    <input
                      type="text"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:border-brand-500 focus:outline-none"
                      placeholder="e.g. Autonomous Drone Telemetry Hub"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Tech Stack (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={projectTechStack}
                      onChange={(e) => setProjectTechStack(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:border-brand-500 focus:outline-none"
                      placeholder="e.g. React, TypeScript, WebSocket, Docker"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Project Architectural Summary
                  </label>
                  <textarea
                    rows={2}
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:border-brand-500 focus:outline-none resize-none"
                    placeholder="Describe key design choices, runtime caching, or database structure..."
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Sample Core Code Snippet (Optional - for AI code examination)
                  </label>
                  <textarea
                    rows={3}
                    value={sampleSnippet}
                    onChange={(e) => setSampleSnippet(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 font-mono text-[11px] focus:border-brand-500 focus:outline-none resize-none"
                    placeholder="export function processTelemetryPacket(buffer: ArrayBuffer) { ... }"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2">
              {activeTab !== 'academics' && (
                <button
                  type="button"
                  onClick={() => {
                    const tabs: any = ['academics', 'attendance', 'lms', 'placement', 'skills', 'github'];
                    const idx = tabs.indexOf(activeTab);
                    if (idx > 0) setActiveTab(tabs[idx - 1]);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
                >
                  ← Back
                </button>
              )}
              {activeTab !== 'github' && (
                <button
                  type="button"
                  onClick={() => {
                    const tabs: any = ['academics', 'attendance', 'lms', 'placement', 'skills', 'github'];
                    const idx = tabs.indexOf(activeTab);
                    if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1]);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
                >
                  Next Step →
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800/80 text-slate-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-brand-500 to-sky-500 hover:from-brand-400 hover:to-sky-400 text-white shadow-lg shadow-brand-500/25 transition disabled:opacity-50"
              >
                {submitting ? 'Saving to MongoDB Atlas...' : '💾 Save Metrics & Calculate Score'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
