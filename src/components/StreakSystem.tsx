import React, { useState } from 'react';
import {
  Flame,
  Shield,
  Zap,
  Award,
  Bell,
  CheckCircle,
  Clock,
  Sparkles,
  Info,
  Calendar,
  Lock,
  Unlock,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User, StreakData, UserPoints } from '../types';
import { api } from '../services/api';

interface StreakSystemProps {
  currentUser: User;
  streak: StreakData | null;
  points: UserPoints | null;
  onRefreshData: () => void;
  onOpenReminderModal: () => void;
}

export const StreakSystem: React.FC<StreakSystemProps> = ({
  currentUser,
  streak,
  points,
  onRefreshData,
  onOpenReminderModal
}) => {
  const [checkingIn, setCheckingIn] = useState(false);
  const [activatingFreeze, setActivatingFreeze] = useState(false);
  const [buyingFreeze, setBuyingFreeze] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!streak) {
    return <div className="p-8 text-slate-400">Loading streak data...</div>;
  }

  const handleCheckIn = async () => {
    if (streak.todayCheckedIn) return;
    setCheckingIn(true);
    setActionMessage(null);
    try {
      const res = await api.checkIn(currentUser.id);
      // Trigger celebratory confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
      setActionMessage({ text: res.message, type: 'success' });
      onRefreshData();
    } catch (e: any) {
      setActionMessage({ text: e.message || "Failed to check in", type: 'error' });
    } finally {
      setCheckingIn(false);
    }
  };

  const handleActivateFreeze = async () => {
    if (streak.freezeTokens <= 0) {
      setActionMessage({ text: "You don't have any freeze tokens. Redeem one below!", type: 'error' });
      return;
    }
    setActivatingFreeze(true);
    setActionMessage(null);
    try {
      const res = await api.activateFreeze(currentUser.id);
      setActionMessage({ text: res.message, type: 'success' });
      onRefreshData();
    } catch (e: any) {
      setActionMessage({ text: e.message || "Could not activate streak freeze", type: 'error' });
    } finally {
      setActivatingFreeze(false);
    }
  };

  const handleBuyFreeze = async () => {
    setBuyingFreeze(true);
    setActionMessage(null);
    try {
      const res = await api.buyFreeze(currentUser.id);
      setActionMessage({ text: res.message, type: 'success' });
      onRefreshData();
    } catch (e: any) {
      setActionMessage({ text: e.message || "Insufficient points for streak freeze", type: 'error' });
    } finally {
      setBuyingFreeze(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Notification Alert */}
      {actionMessage && (
        <div
          className={`p-4 rounded-xl border text-xs font-semibold flex items-center justify-between ${
            actionMessage.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
            <span>{actionMessage.text}</span>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            className="text-slate-400 hover:text-white text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Fire Streak Hero Card */}
      <div className="p-8 rounded-3xl glass-card border border-orange-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-500/20 via-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Giant Animated Flame & Count */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-amber-600 via-orange-500 to-rose-500 flex items-center justify-center shadow-2xl shadow-orange-500/40 animate-flame-flicker border border-orange-300/40">
                <Flame className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-full bg-slate-900 border border-orange-500/50 text-[10px] font-extrabold text-orange-400 tracking-wider">
                ACTIVE
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Daily Momentum Engine</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                {streak.currentStreak}{' '}
                <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
                  Day Streak
                </span>
              </h1>
              <p className="text-sm text-slate-300 mt-1 max-w-md">
                Personal record: <span className="font-bold text-orange-300">{streak.longestStreak} days</span>. Check in daily to unlock milestone rewards and climb cohort ranks!
              </p>

              {/* Weekly Check-in Days */}
              <div className="flex items-center gap-2 mt-4">
                {streak.weeklyCheckins.map((chk, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                        chk.active
                          ? 'bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30'
                          : i === 6 && !streak.todayCheckedIn
                          ? 'bg-slate-800 text-orange-400 border border-dashed border-orange-500/50 animate-pulse'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {chk.active ? '✓' : chk.day[0]}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{chk.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Quick Action Buttons & Freeze Status */}
          <div className="lg:col-span-5 flex flex-col gap-3 p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-400" />
                <span className="text-xs font-bold text-slate-200">Today's Check-in Status</span>
              </div>
              {streak.todayCheckedIn ? (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Checked In
                </span>
              ) : (
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Due Before Midnight
                </span>
              )}
            </div>

            <button
              onClick={handleCheckIn}
              disabled={streak.todayCheckedIn || checkingIn}
              className={`w-full py-3.5 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition shadow-xl ${
                streak.todayCheckedIn
                  ? 'bg-slate-800/80 text-slate-400 border border-slate-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 shadow-orange-500/25'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>
                {streak.todayCheckedIn
                  ? '✓ Streak Safe for Today (+25 PTS)'
                  : checkingIn
                  ? 'Checking In...'
                  : 'Check In Right Now (+25 PTS)'}
              </span>
            </button>

            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                onClick={onOpenReminderModal}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Bell className="w-3.5 h-3.5 text-brand-400" />
                <span>Daily Reminder</span>
              </button>

              <button
                onClick={handleActivateFreeze}
                disabled={streak.freezeTokens <= 0 || activatingFreeze}
                className="p-2.5 rounded-xl bg-sky-950/40 hover:bg-sky-900/60 text-sky-300 border border-sky-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-50"
              >
                <Shield className="w-3.5 h-3.5 text-sky-400" />
                <span>Use Freeze ({streak.freezeTokens})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Two Columns: Freeze Shield System & Milestone Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Streak Freeze Token Vault */}
        <div className="lg:col-span-6 p-6 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Streak Freeze Vault</h3>
                  <p className="text-xs text-slate-400">Never lose a streak due to exams or travel</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                {streak.freezeTokens} in Inventory
              </span>
            </div>

            <div className="mt-5 p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs text-slate-300 space-y-2">
              <div className="flex items-center justify-between">
                <span>Active Protection Status:</span>
                <span className="font-bold text-emerald-400">
                  {streak.streakProtectionActive ? 'Shield Active (24h Window)' : 'Standby'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tokens Used To Date:</span>
                <span className="font-bold text-slate-200">{streak.freezeTokensUsedTotal || 1} tokens</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Your Points Balance:</span>
                <span className="font-bold text-amber-400">{points?.currentBalance || 980} PTS</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-4 leading-relaxed">
              Streak Freezes automatically absorb one missed day without zeroing your {streak.currentStreak}-day record. You can buy extra freeze tokens using your reward points.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Cost: 150 Reward Points</span>
            <button
              onClick={handleBuyFreeze}
              disabled={buyingFreeze || (points?.currentBalance || 0) < 150}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{buyingFreeze ? 'Purchasing...' : 'Redeem Freeze Token (150 PTS)'}</span>
            </button>
          </div>
        </div>

        {/* Milestone Badges: 7, 30, 100 Days */}
        <div className="lg:col-span-6 p-6 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Streak Milestone Badges</h3>
                  <p className="text-xs text-slate-400">Exclusive achievements for consistency</p>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {streak.milestones.map((m) => {
                const isUnlocked = m.achieved || streak.currentStreak >= m.days;
                const progressPct = Math.min(100, (streak.currentStreak / m.days) * 100);

                return (
                  <div
                    key={m.days}
                    className={`p-4 rounded-xl border transition ${
                      isUnlocked
                        ? 'bg-amber-950/20 border-amber-500/30'
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black ${
                            isUnlocked
                              ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                              : 'bg-slate-800 text-slate-600'
                          }`}
                        >
                          {m.days}d
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-white">{m.title}</h4>
                            {isUnlocked ? (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400">
                                Unlocked
                              </span>
                            ) : (
                              <span className="text-[10px] font-medium text-slate-500 flex items-center gap-0.5">
                                <Lock className="w-2.5 h-2.5" /> Locked
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {isUnlocked
                              ? `Earned on ${m.date || 'Active'}`
                              : `${m.days - streak.currentStreak} more days to unlock`}
                          </p>
                        </div>
                      </div>

                      <span className="text-xs font-extrabold text-amber-400">
                        {isUnlocked ? '+100 XP' : '+250 XP'}
                      </span>
                    </div>

                    {!isUnlocked && (
                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div
                          className="bg-amber-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-brand-400" />
              Milestone badges appear on your public Skill Passport.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
