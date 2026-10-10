import React, { useState, useEffect } from 'react';
import { User, StudentProfile, StreakData, UserPoints } from './types';
import { api } from './services/api';
import { AuthPage } from './components/AuthPage';
import { Navbar } from './components/Navbar';
import { StudentDashboard } from './components/StudentDashboard';
import { StreakSystem } from './components/StreakSystem';
import { ProofOfBuildInterview } from './components/ProofOfBuildInterview';
import { RewardsLeaderboard } from './components/RewardsLeaderboard';
import { SkillDNAMap } from './components/SkillDNAMap';
import { FutureYouForecast } from './components/FutureYouForecast';
import { SkillPassport } from './components/SkillPassport';
import { EducatorDashboard } from './components/EducatorDashboard';
import { StreakNotificationModal } from './components/StreakNotificationModal';
import { WeeklyTests } from './components/WeeklyTests';
import { AiStudentBot } from './components/AiStudentBot';
import { StudentMetricsModal } from './components/StudentMetricsModal';
import { Bot, GraduationCap } from 'lucide-react';

export const App: React.FC = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedStudentForFaculty, setSelectedStudentForFaculty] = useState<User | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [points, setPoints] = useState<UserPoints | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [loading, setLoading] = useState<boolean>(true);

  // Modals
  const [showReminderModal, setShowReminderModal] = useState<boolean>(false);
  const [showPassportModal, setShowPassportModal] = useState<boolean>(false);
  const [showMetricsModal, setShowMetricsModal] = useState<boolean>(false);

  useEffect(() => {
    initApp();
  }, []);

  const getActiveStudent = (): User | null => {
    if (currentUser?.role === 'student') {
      return currentUser;
    }
    return selectedStudentForFaculty || allUsers.find((u) => u.role === 'student') || null;
  };

  const loadStudentDetails = async (userId: string) => {
    try {
      const data = await api.getStudent(userId);
      setProfile(data.profile || null);
      setStreak(data.streak || null);
      setPoints(data.points || null);
    } catch (err) {
      console.error('Failed to load student details:', err);
    }
  };

  // Automatically ensure student details are loaded when viewing student dashboard
  useEffect(() => {
    if (!currentUser) return;

    if (currentUser.role === 'student') {
      if (!profile || profile.studentId !== currentUser.id) {
        loadStudentDetails(currentUser.id);
      }
    } else if (currentUser.role === 'educator') {
      const targetStudent = selectedStudentForFaculty || allUsers.find((u) => u.role === 'student');
      if (targetStudent) {
        if (!selectedStudentForFaculty) {
          setSelectedStudentForFaculty(targetStudent);
        }
        if (!profile || profile.studentId !== targetStudent.id) {
          loadStudentDetails(targetStudent.id);
        }
      }
    }
  }, [currentUser, activeTab, allUsers, selectedStudentForFaculty, profile]);

  const initApp = async () => {
    try {
      setLoading(true);
      const users = await api.getUsers();
      setAllUsers(users);

      // Check persistent session in localStorage
      const savedUser = localStorage.getItem('aura_current_user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          const found = users.find((u) => u.id === parsed.id) || parsed;
          handleLoginSuccess(found);
          return;
        } catch (e) {
          localStorage.removeItem('aura_current_user');
        }
      }
    } catch (err) {
      console.error('Failed to initialize app:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = async (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('aura_current_user', JSON.stringify(user));

    if (user.role === 'educator') {
      setActiveTab('educator');
      const firstStudent = allUsers.find((u) => u.role === 'student');
      if (firstStudent) {
        setSelectedStudentForFaculty(firstStudent);
        loadStudentDetails(firstStudent.id);
      }
    } else {
      setActiveTab('dashboard');
      await loadStudentDetails(user.id);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('aura_current_user');
    setCurrentUser(null);
    setSelectedStudentForFaculty(null);
    setProfile(null);
    setStreak(null);
    setPoints(null);
    setActiveTab('dashboard');
  };

  const handleSelectUser = async (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('aura_current_user', JSON.stringify(user));

    if (user.role === 'educator') {
      setActiveTab('educator');
      const firstStudent = allUsers.find((u) => u.role === 'student');
      if (firstStudent) {
        setSelectedStudentForFaculty(firstStudent);
        await loadStudentDetails(firstStudent.id);
      }
    } else {
      await loadStudentDetails(user.id);
      setActiveTab('dashboard');
    }
  };

  const handleRefreshData = () => {
    const target = getActiveStudent();
    if (target) {
      loadStudentDetails(target.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center text-slate-400 gap-3">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">
          Loading AI-Powered Student Success Platform...
        </span>
      </div>
    );
  }

  // 1. FIRST SCREEN: Login / Signup Page
  if (!currentUser) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  // 2. DASHBOARD VIEW (Student Dashboard or Faculty/Admin Dashboard based on role)
  return (
    <div className="min-h-screen bg-[#080c15] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        allUsers={allUsers}
        onSelectUser={handleSelectUser}
        streak={streak}
        points={points}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReminderModal={() => setShowReminderModal(true)}
        onOpenPassportModal={() => setShowPassportModal(true)}
        onOpenMetricsModal={() => setShowMetricsModal(true)}
        onLogout={handleLogout}
      />

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-5">
            {currentUser.role === 'educator' && (
              <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>Faculty Student View Mode</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        Live Preview
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Previewing student dashboard for:{' '}
                      <strong className="text-white">
                        {getActiveStudent()?.name || 'Selected Student'}
                      </strong>{' '}
                      ({getActiveStudent()?.email})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Switch Student:</span>
                  <select
                    value={getActiveStudent()?.id || ''}
                    onChange={(e) => {
                      const found = allUsers.find((u) => u.id === e.target.value);
                      if (found) {
                        setSelectedStudentForFaculty(found);
                        loadStudentDetails(found.id);
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-medium focus:outline-none"
                  >
                    {allUsers
                      .filter((u) => u.role === 'student')
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.department || s.batch || 'CS'})
                        </option>
                      ))}
                  </select>
                  <button
                    onClick={() => setActiveTab('educator')}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                  >
                    ← Back to Risk Hub
                  </button>
                </div>
              </div>
            )}

            <StudentDashboard
              currentUser={getActiveStudent() || currentUser}
              profile={profile}
              streak={streak}
              onNavigateToTab={(tab) => setActiveTab(tab)}
              onRefreshData={handleRefreshData}
              onOpenMetricsModal={() => setShowMetricsModal(true)}
            />
          </div>
        )}

        {activeTab === 'streak' && (
          <StreakSystem
            currentUser={getActiveStudent() || currentUser}
            streak={streak}
            points={points}
            onRefreshData={handleRefreshData}
            onOpenReminderModal={() => setShowReminderModal(true)}
          />
        )}

        {activeTab === 'interview' && (
          <ProofOfBuildInterview
            currentUser={getActiveStudent() || currentUser}
            onRefreshData={handleRefreshData}
            onOpenPassport={() => setShowPassportModal(true)}
          />
        )}

        {activeTab === 'rewards' && (
          <RewardsLeaderboard
            currentUser={getActiveStudent() || currentUser}
            points={points}
            onRefreshData={handleRefreshData}
          />
        )}

        {activeTab === 'skill-dna' && (
          <SkillDNAMap
            currentUser={getActiveStudent() || currentUser}
            onRefreshData={handleRefreshData}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            onOpenMetricsModal={() => setShowMetricsModal(true)}
          />
        )}

        {activeTab === 'future-you' && (
          <FutureYouForecast currentUser={getActiveStudent() || currentUser} />
        )}

        {activeTab === 'weekly-tests' && (
          <WeeklyTests
            currentUser={getActiveStudent() || currentUser}
            profile={profile}
            onRefreshData={handleRefreshData}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'ai-bot' && (
          <AiStudentBot
            currentUser={getActiveStudent() || currentUser}
            profile={profile}
            streak={streak}
            onOpenMetricsModal={() => setShowMetricsModal(true)}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'educator' && (
          <EducatorDashboard
            onSelectStudent={(student) => {
              setSelectedStudentForFaculty(student);
              loadStudentDetails(student.id);
              setActiveTab('dashboard');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#060910] py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-slate-400">AURA AI Engine Active</span>
            <span>• Multi-Pillar Predictive Matrix</span>
          </div>
          <div>
            Built with React 19, TypeScript, Tailwind CSS, Express, Web Speech API & Proof-of-Build
          </div>
          <div>
            Student Success Analytics Platform © 2026
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showReminderModal && (
        <StreakNotificationModal
          currentUser={currentUser}
          streak={streak}
          onClose={() => setShowReminderModal(false)}
          onRefreshData={handleRefreshData}
        />
      )}

      {showPassportModal && (
        <SkillPassport
          currentUser={currentUser}
          isModal={true}
          onClose={() => setShowPassportModal(false)}
        />
      )}

      {showMetricsModal && (
        <StudentMetricsModal
          currentUser={currentUser}
          profile={profile}
          isOpen={showMetricsModal}
          onClose={() => setShowMetricsModal(false)}
          onSuccess={handleRefreshData}
        />
      )}

      {/* Floating AI Bot Quick-Access Button for Students */}
      {currentUser.role === 'student' && activeTab !== 'ai-bot' && (
        <button
          onClick={() => setActiveTab('ai-bot')}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-brand-600 via-sky-500 to-indigo-600 hover:from-brand-500 hover:to-sky-400 text-white font-bold text-xs shadow-2xl shadow-brand-500/30 border border-sky-300/40 transition-all hover:scale-105 group"
          title="Ask AI Success Advisor"
        >
          <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
          </div>
          <span className="hidden sm:inline">Ask AI Advisor</span>
        </button>
      )}
    </div>
  );
};

export default App;
