import React, { useState } from 'react';
import {
  Bell,
  Clock,
  Flame,
  CheckCircle,
  AlertTriangle,
  Smartphone,
  Shield,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User, StreakData } from '../types';
import { api } from '../services/api';

interface StreakNotificationModalProps {
  currentUser: User;
  streak: StreakData | null;
  onClose: () => void;
  onRefreshData: () => void;
}

export const StreakNotificationModal: React.FC<StreakNotificationModalProps> = ({
  currentUser,
  streak,
  onClose,
  onRefreshData
}) => {
  const [preferredHour, setPreferredHour] = useState(streak?.usualLoginTime || '09:30');
  const [permissionState, setPermissionState] = useState<string>(
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'default'
  );
  const [notificationDispatched, setNotificationDispatched] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      setPermissionState(perm);
      if (perm === 'granted') {
        triggerNativeNotification();
      }
    }
  };

  const triggerNativeNotification = () => {
    setNotificationDispatched(true);
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification("🔥 AURA Streak Alert: Don't Break Your Streak!", {
          body: `Alex, your 21-day momentum is set to expire! Check in before midnight to keep your flame alive.`,
          icon: '/favicon.svg'
        });
      } catch (e) {
        console.warn("Could not dispatch native notification:", e);
      }
    }
    setTimeout(() => setNotificationDispatched(false), 5000);
  };

  const handleInstantCheckIn = async () => {
    setCheckingIn(true);
    try {
      await api.checkIn(currentUser.id);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
      onRefreshData();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setCheckingIn(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-950 rounded-3xl border border-orange-500/30 p-6 shadow-2xl relative overflow-hidden animate-in zoom-in-95">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-500/15 text-orange-400 border border-orange-500/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Daily Streak Reminder Engine</h3>
              <p className="text-xs text-slate-400">Push notifications tuned to your habit cycle</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {/* Live Notification Preview Box */}
        <div className="my-5 p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-orange-950/30 border border-orange-500/30 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-orange-400" />
              Live Push Notification Simulation
            </span>
            <span className="text-[10px] text-slate-400">Scheduled: {preferredHour} AM</span>
          </div>

          <div className="flex items-start gap-3 pt-1">
            <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-orange-500/40">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">
                ⚠️ Your {streak?.currentStreak || 21}-Day Streak is About to Break!
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                Heads up, {currentUser.name.split(' ')[0]}! You usually log in around {preferredHour} AM. Check in now or your 21-day momentum will reset at midnight.
              </p>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-brand-400" />
                Habitual Daily Login Window
              </span>
              <input
                type="time"
                value={preferredHour}
                onChange={(e) => setPreferredHour(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs font-mono focus:outline-none focus:border-brand-500"
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Our AI detects that you consistently review code between 9:00 AM and 10:00 AM. We dispatch reminders 30 minutes prior to protect your momentum.
            </p>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs">
            <span className="text-slate-300">
              Browser Permission:{' '}
              <strong className="capitalize text-brand-300">{permissionState}</strong>
            </span>
            {permissionState !== 'granted' ? (
              <button
                onClick={requestNotificationPermission}
                className="px-3 py-1 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs transition"
              >
                Enable Push
              </button>
            ) : (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Allowed
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={triggerNativeNotification}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Smartphone className="w-3.5 h-3.5 text-orange-400" />
            <span>Test Push Trigger</span>
          </button>

          {!streak?.todayCheckedIn ? (
            <button
              onClick={handleInstantCheckIn}
              disabled={checkingIn}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 text-xs font-black transition flex items-center gap-1.5 shadow-lg shadow-orange-500/20"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{checkingIn ? 'Checking In...' : 'Check In Now'}</span>
            </button>
          ) : (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Already Safe Today
            </span>
          )}
        </div>

        {notificationDispatched && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs text-emerald-300 text-center animate-in fade-in">
            ✓ Push notification alert dispatched to your desktop/browser window!
          </div>
        )}
      </div>
    </div>
  );
};
