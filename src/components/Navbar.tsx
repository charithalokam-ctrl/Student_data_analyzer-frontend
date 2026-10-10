import React, { useState } from 'react';
import {
  Flame,
  Shield,
  Zap,
  Bell,
  CheckCircle,
  AlertTriangle,
  GraduationCap,
  Sparkles,
  ExternalLink,
  ChevronDown,
  LogOut,
  X
} from 'lucide-react';
import { User, StreakData, UserPoints } from '../types';

interface NavbarProps {
  currentUser: User;
  allUsers: User[];
  onSelectUser: (user: User) => void;
  streak: StreakData | null;
  points: UserPoints | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenReminderModal: () => void;
  onOpenPassportModal: () => void;
  onOpenMetricsModal?: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  allUsers,
  onSelectUser,
  streak,
  points,
  activeTab,
  setActiveTab,
  onOpenReminderModal,
  onOpenPassportModal,
  onOpenMetricsModal,
  onLogout
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Streak Warning: Don\'t Lose Your Momentum!',
      time: 'Habitual login window: 09:30 AM',
      type: 'warning',
      action: onOpenReminderModal,
      read: false
    },
    {
      id: 2,
      title: 'Proof of Build Verified',
      time: 'Neural Vision Dashboard approved',
      type: 'success',
      action: () => setActiveTab('interview'),
      read: true
    },
    {
      id: 3,
      title: 'AI Future-You Forecast Ready',
      time: 'Updated 3-month projection available',
      type: 'info',
      action: () => setActiveTab('future-you'),
      read: true
    }
  ];

  // Navigation items based on role
  const navItems =
    currentUser.role === 'educator'
      ? [
          { id: 'educator', label: 'Faculty Risk Hub' },
          { id: 'dashboard', label: 'Student View' },
          { id: 'rewards', label: 'Rewards & Leaderboard' }
        ]
      : [
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'weekly-tests', label: 'Weekly Tests' },
          { id: 'ai-bot', label: 'AI Advisor' },
          { id: 'interview', label: 'Proof of Build' },
          { id: 'future-you', label: 'Future You' },
          { id: 'skill-dna', label: 'Skill DNA' },
          { id: 'streak', label: 'Daily Streak' },
          { id: 'rewards', label: 'Rewards & Ranks' }
        ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080c15]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 via-sky-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-500/25 border border-sky-300/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-sky-400 bg-clip-text text-transparent">
                  AURA
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  v2.4 AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                {currentUser.role === 'educator' ? 'Faculty Academic & Placement Surveillance' : 'Student Success & Proof-of-Build Platform'}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-500/20 to-sky-500/10 text-brand-400 border border-brand-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Metrics & Profile */}
          <div className="flex items-center gap-2.5">

            {/* Streak Counter Pill */}
            {streak && currentUser.role === 'student' && (
              <button
                onClick={() => setActiveTab('streak')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 transition-all text-xs font-bold"
                title="View Streak Details"
              >
                <Flame className="w-4 h-4 text-orange-400 animate-flame-flicker" />
                <span>{streak.currentStreak}d</span>
                {streak.freezeTokens > 0 && (
                  <span className="flex items-center gap-0.5 text-[10px] text-sky-400 bg-sky-950/80 px-1.5 py-0.2 rounded-full border border-sky-400/30">
                    <Shield className="w-2.5 h-2.5" />
                    {streak.freezeTokens}
                  </span>
                )}
              </button>
            )}

            {/* Points Balance Pill */}
            {points && currentUser.role === 'student' && (
              <button
                onClick={() => setActiveTab('rewards')}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-all text-xs font-bold"
                title="Your Reward Points"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{points.currentBalance} PTS</span>
              </button>
            )}

            {/* Public Passport Share Button */}
            {currentUser.role === 'student' && (
              <button
                onClick={onOpenPassportModal}
                className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                title="Share Public Skill Passport"
              >
                <span>Passport</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </button>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationMenu(!showNotificationMenu)}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700 relative transition"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500" />
              </button>

              {showNotificationMenu && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-slate-200">System Notifications</span>
                    <span className="text-[10px] text-brand-400 cursor-pointer">Mark all read</span>
                  </div>
                  <div className="space-y-1.5 py-2 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          n.action();
                          setShowNotificationMenu(false);
                        }}
                        className="p-2.5 rounded-lg hover:bg-slate-800/70 cursor-pointer transition flex items-start gap-2.5"
                      >
                        {n.type === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                        ) : n.type === 'success' ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
                        )}
                        <div>
                          <p className="text-xs font-medium text-slate-200 leading-tight">{n.title}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      onOpenReminderModal();
                      setShowNotificationMenu(false);
                    }}
                    className="w-full text-center py-2 text-xs font-medium text-brand-400 hover:bg-slate-800 rounded-lg transition"
                  >
                    Configure Daily Push Reminder 🔔
                  </button>
                </div>
              )}
            </div>

            {/* User Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-brand-500/40 transition group"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-700"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-slate-200 leading-none group-hover:text-brand-400">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-400 capitalize mt-0.5">
                    {currentUser.role === 'educator' ? 'Faculty Admin' : currentUser.batch?.split('-')[1]?.trim() || 'Student'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50">
                  {currentUser.role === 'educator' ? (
                    <>
                      <div className="px-3 py-2 border-b border-slate-800 text-[11px] font-semibold text-slate-400">
                        Switch Test Persona / Role
                      </div>
                      <div className="space-y-1 py-1">
                        {allUsers.map((u) => (
                          <button
                            key={u.id}
                            onClick={() => {
                              onSelectUser(u);
                              setShowUserMenu(false);
                              if (u.role === 'educator') setActiveTab('educator');
                            }}
                            className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-left transition ${
                              currentUser.id === u.id ? 'bg-brand-500/15 border border-brand-500/30 text-white' : 'hover:bg-slate-800/80 text-slate-300'
                            }`}
                          >
                            <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-lg object-cover" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold truncate">{u.name}</p>
                              <p className="text-[11px] text-slate-400 truncate">
                                {u.role === 'educator' ? 'Faculty Dean / Admin' : u.batch}
                              </p>
                            </div>
                            {u.role === 'educator' ? (
                              <GraduationCap className="w-4 h-4 text-purple-400 shrink-0" />
                            ) : (
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-semibold">
                                Active
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="p-3">
                      <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                        <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-xl object-cover ring-1 ring-brand-500/30" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                          <span className="inline-block mt-1 text-[10px] bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full font-medium">
                            {currentUser.batch || 'Class of 2026'}
                          </span>
                        </div>
                      </div>
                      <div className="py-2.5 text-xs text-slate-300 space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Goal:</span>
                          <span className="font-semibold text-slate-200">{currentUser.targetJobRole || 'Software Engineer'}</span>
                        </div>
                        {currentUser.githubUsername && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">GitHub:</span>
                            <span className="font-mono text-sky-400">@{currentUser.githubUsername}</span>
                          </div>
                        )}
                      </div>
                      {onOpenMetricsModal && (
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            onOpenMetricsModal();
                          }}
                          className="w-full mt-1 mb-2 px-3 py-2 rounded-lg text-xs font-semibold bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 border border-brand-500/30 transition text-center"
                        >
                          ✏️ Enter / Update My Metrics
                        </button>
                      )}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-800 mt-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-lg text-left text-xs font-semibold text-rose-400 hover:bg-rose-950/40 transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out to Login Screen</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Logout Icon Button */}
            <button
              onClick={onLogout}
              className="p-2 rounded-lg bg-slate-900 hover:bg-rose-950/50 hover:text-rose-400 text-slate-400 border border-slate-800 transition"
              title="Log Out to First Screen"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="md:hidden flex items-center gap-2 overflow-x-auto py-2 border-t border-slate-800/50 no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
                activeTab === item.id
                  ? 'bg-brand-500 text-white'
                  : 'bg-slate-800/60 text-slate-400'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
