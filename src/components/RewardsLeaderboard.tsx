import React, { useState, useEffect } from 'react';
import {
  Award,
  Zap,
  TrendingUp,
  Users,
  Trophy,
  Shield,
  Palette,
  Sparkles,
  Ticket,
  CheckCircle,
  AlertCircle,
  Filter,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User, RewardCatalogItem, UserPoints, LeaderboardStudent, TeamStreak } from '../types';
import { api } from '../services/api';

interface RewardsLeaderboardProps {
  currentUser: User;
  points: UserPoints | null;
  onRefreshData: () => void;
}

export const RewardsLeaderboard: React.FC<RewardsLeaderboardProps> = ({
  currentUser,
  points,
  onRefreshData
}) => {
  const [catalog, setCatalog] = useState<RewardCatalogItem[]>([]);
  const [leaderboard, setLeaderboard] = useState<{
    batches: string[];
    students: LeaderboardStudent[];
    teamStreaks: TeamStreak[];
  } | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const [redeemMessage, setRedeemMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const loadData = async () => {
    try {
      const [catData, leadData] = await Promise.all([
        api.getRewardCatalog(),
        api.getLeaderboard()
      ]);
      setCatalog(catData);
      setLeaderboard(leadData);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRedeem = async (reward: RewardCatalogItem) => {
    if (!points || points.currentBalance < reward.points) {
      setRedeemMessage({ text: `Not enough points to redeem ${reward.title}`, type: 'error' });
      return;
    }

    setRedeemingId(reward.id);
    setRedeemMessage(null);
    try {
      const res = await api.redeemReward(currentUser.id, reward.id);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setRedeemMessage({ text: res.message, type: 'success' });
      onRefreshData();
      loadData();
    } catch (e: any) {
      setRedeemMessage({ text: e.message || 'Redemption failed', type: 'error' });
    } finally {
      setRedeemingId(null);
    }
  };

  const getRewardIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldAlert':
        return <Shield className="w-5 h-5 text-sky-400" />;
      case 'Award':
        return <Award className="w-5 h-5 text-emerald-400" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-purple-400" />;
      case 'Palette':
        return <Palette className="w-5 h-5 text-pink-400" />;
      case 'Ticket':
        return <Ticket className="w-5 h-5 text-amber-400" />;
      default:
        return <Zap className="w-5 h-5 text-brand-400" />;
    }
  };

  const filteredStudents = leaderboard?.students.filter((s) => {
    if (selectedBatch === 'all') return true;
    return s.batch.toLowerCase().includes(selectedBatch.toLowerCase());
  }) || [];

  return (
    <div className="space-y-6">
      {/* Alert Notification */}
      {redeemMessage && (
        <div
          className={`p-4 rounded-xl border text-xs font-semibold flex items-center justify-between ${
            redeemMessage.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {redeemMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
            <span>{redeemMessage.text}</span>
          </div>
          <button onClick={() => setRedeemMessage(null)} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Hero Points & Progress Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Points Balance Card */}
        <div className="md:col-span-7 p-6 rounded-2xl glass-card border border-amber-500/30 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Zap className="w-4 h-4 fill-amber-400" />
              <span>Rewards Balance</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-black text-white">
                {points?.currentBalance ?? 0}
              </span>
              <span className="text-sm font-bold text-amber-300">PTS</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Earned from daily check-ins (+30), weekly tests (+100) & verified project defenses (+250). Total earned:{' '}
              <span className="text-slate-200 font-semibold">{points?.totalEarned ?? 0} PTS</span>
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center shrink-0">
            <Trophy className="w-8 h-8 text-amber-400 mx-auto" />
            <span className="text-[11px] font-bold text-amber-300 block mt-1">
              {(points?.totalEarned ?? 0) >= 1000
                ? 'Tier 1 Pioneer'
                : (points?.totalEarned ?? 0) >= 300
                ? 'Tier 2 Scholar'
                : 'Active Scholar'}
            </span>
          </div>
        </div>

        {/* Month-over-Month Improvement Widget */}
        <div className="md:col-span-5 p-6 rounded-2xl glass-card border border-emerald-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              Progress Comparison
            </span>
            <span className="text-[11px] text-slate-400">Live Index</span>
          </div>

          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">
                {(points?.totalEarned ?? 0) > 0 ? `+${Math.min(25, Math.round(((points?.totalEarned ?? 0) / 50) * 10) / 10)}%` : '0.0%'}
              </span>
              <span className="text-xs font-bold text-emerald-400 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> Live Momentum
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {(points?.totalEarned ?? 0) > 0
                ? 'Progress powered by real daily check-ins, verified builds, and completed skills assessments.'
                : 'Complete daily login check-ins, weekly tests, and project defense to increase your momentum index.'}
            </p>
          </div>

          <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800">
            Ranked live against all registered university cohort students
          </div>
        </div>
      </div>

      {/* Rewards Catalog Store */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Rewards Store & Perks</h3>
            <p className="text-xs text-slate-400">Exchange your points for practical perks & certificates</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {catalog.map((item) => {
            const canAfford = (points?.currentBalance || 0) >= item.points;

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      {getRewardIcon(item.icon)}
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {item.badge}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mt-3">{item.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-black text-amber-400">{item.points}</span>
                    <span className="text-[10px] text-slate-400 font-bold">PTS</span>
                  </div>

                  <button
                    onClick={() => handleRedeem(item)}
                    disabled={!canAfford || redeemingId === item.id}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      canAfford
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <span>
                      {redeemingId === item.id
                        ? 'Redeeming...'
                        : canAfford
                        ? 'Redeem Perk'
                        : 'Need More Pts'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard & Team Streaks Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Cohort Leaderboard */}
        <div className="lg:col-span-7 p-6 rounded-2xl glass-card border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Weekly Cohort Leaderboard</span>
              </h3>
              <p className="text-xs text-slate-400">Ranked by points & proof-of-build verifications</p>
            </div>

            {/* Batch Filter Buttons */}
            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setSelectedBatch('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  selectedBatch === 'all' ? 'bg-brand-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedBatch('CS-A')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  selectedBatch === 'CS-A' ? 'bg-brand-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                CS-A
              </button>
              <button
                onClick={() => setSelectedBatch('CS-B')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  selectedBatch === 'CS-B' ? 'bg-brand-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                CS-B
              </button>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            {filteredStudents.length === 0 ? (
              <div className="p-8 rounded-xl bg-slate-900/40 border border-slate-800 text-center">
                <Trophy className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-white">No Registered Students in this Cohort</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Students will appear on the live leaderboard as they earn points through daily check-ins and tests.
                </p>
              </div>
            ) : (
              filteredStudents.map((st, idx) => {
                const isCurrentUser = st.id === currentUser.id;

                return (
                  <div
                    key={st.id}
                    className={`p-3 rounded-xl border flex items-center justify-between transition ${
                      isCurrentUser
                        ? 'bg-brand-950/30 border-brand-500/40 shadow-sm'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 text-center text-xs font-black ${
                          idx === 0
                            ? 'text-amber-400'
                            : idx === 1
                            ? 'text-slate-300'
                            : idx === 2
                            ? 'text-amber-600'
                            : 'text-slate-600'
                        }`}
                      >
                        #{idx + 1}
                      </span>

                      <img
                        src={st.avatar}
                        alt={st.name}
                        className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-700"
                      />

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">
                            {st.name} {isCurrentUser && <span className="text-[10px] text-brand-400 font-bold">(You)</span>}
                          </span>
                          {st.verifiedProjects > 0 && (
                            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/30">
                              {st.verifiedProjects} Verified
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">{st.batch}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div className="text-xs font-bold text-orange-400 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5" />
                        <span>{st.streak}d</span>
                      </div>
                      <div className="text-xs font-extrabold text-amber-300">
                        {st.points} PTS
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Team Streaks Collaborative Squads */}
        <div className="lg:col-span-5 p-6 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-400" />
                  <span>Team Streaks (Squads)</span>
                </h3>
                <p className="text-xs text-slate-400">Collaborative streaks kept alive together</p>
              </div>
            </div>

            <div className="space-y-3">
              {(!leaderboard?.teamStreaks || leaderboard.teamStreaks.length === 0) ? (
                <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 text-center">
                  <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs font-bold text-white">No Active Squads Yet</p>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                    Form a squad with registered classmates to link your daily streaks together and climb the live cohort board!
                  </p>
                </div>
              ) : (
                leaderboard.teamStreaks.map((team) => (
                  <div
                    key={team.id}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white">{team.teamName}</h4>
                        <p className="text-[10px] text-slate-400">{team.batch} • {team.membersCount} Builders</p>
                      </div>

                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-bold">
                        <Flame className="w-3.5 h-3.5" />
                        <span>{team.combinedStreak} Days</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span className="truncate max-w-[200px]">
                        {team.members.join(', ')}
                      </span>
                      <span className="font-bold text-amber-300 shrink-0">{team.totalPoints} PTS</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Invite classmates to form a team streak for +20% bonus XP.</span>
            <button className="px-2.5 py-1 rounded-lg bg-brand-500/20 text-brand-400 text-xs font-bold hover:bg-brand-500/30 transition">
              Create Squad
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
