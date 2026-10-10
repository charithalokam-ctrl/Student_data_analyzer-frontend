import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Dna,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Clock,
  TrendingUp,
  Brain,
  Zap,
  Target
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import confetti from 'canvas-confetti';
import { User, SkillDNAData, TopicRecommendation } from '../types';
import { api } from '../services/api';

interface SkillDNAMapProps {
  currentUser: User;
  onRefreshData: () => void;
  onNavigateToTab?: (tab: string) => void;
  onOpenMetricsModal?: () => void;
}

export const SkillDNAMap: React.FC<SkillDNAMapProps> = ({
  currentUser,
  onRefreshData,
  onNavigateToTab,
  onOpenMetricsModal
}) => {
  const [dna, setDna] = useState<SkillDNAData | null>(null);
  const [loading, setLoading] = useState(true);
  const [completingTopicId, setCompletingTopicId] = useState<string | null>(null);
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);

  useEffect(() => {
    loadDna();
  }, [currentUser]);

  const loadDna = async () => {
    try {
      setLoading(true);
      const data = await api.getSkillDNA(currentUser.id);
      setDna(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTopic = async (topic: TopicRecommendation) => {
    if (topic.completed) return;
    setCompletingTopicId(topic.id);
    setCompletionMessage(null);
    try {
      const res = await api.completeTopic(currentUser.id, topic.id);
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.6 }
      });
      setCompletionMessage(res.message);
      setDna(res.dna);
      onRefreshData();
    } catch (e: any) {
      console.error(e);
    } finally {
      setCompletingTopicId(null);
    }
  };

  if (loading || !dna) {
    return <div className="p-8 text-slate-400">Loading Skill DNA Matrix...</div>;
  }

  // Format data for Recharts Radar
  const radarData = dna.skills.map((s) => ({
    subject: s.name.split(' ')[0] + ' ' + (s.name.split(' ')[1] || ''),
    level: s.level,
    fullMark: s.maxLevel
  }));

  // Check if student profile is at pure 0-scale baseline
  const isZeroScale = dna.skills.every((s) => s.level === 0);

  // Find lowest skill (weak area)
  const sortedSkills = [...dna.skills].sort((a, b) => a.level - b.level);
  const weakestSkill = sortedSkills[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Dna className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-white">Skill DNA Map & Neural Growth</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Multi-dimensional capability footprint. Each node dynamically expands as you pass Voice Project Interviews, submit weekly tests, and complete verified learning modules.
          </p>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800">
          <Brain className="w-5 h-5 text-brand-400" />
          <div className="text-xs">
            <span className="text-slate-400 block text-[10px]">Identified Growth Dimension</span>
            <span className="font-bold text-amber-300">
              {isZeroScale ? 'Awaiting Assessment' : (weakestSkill?.name || 'Awaiting Assessment')}
            </span>
          </div>
        </div>
      </div>

      {isZeroScale && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-sky-950/40 via-indigo-950/30 to-purple-950/40 border border-sky-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-sky-500/20 text-sky-300 shrink-0">
              <Target className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                Real-Time Baseline (0.0 Scale)
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                No Duplicate or Mock Skill Data
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                All 6 capability nodes (Algorithms & DSA, System Design, Web Engineering, Database Engines, Core CS, and Campus Placement) start at 0.0 scale. Complete a Weekly Test or enter your verified metrics to map your Skill DNA in real time.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {onOpenMetricsModal && (
              <button
                onClick={onOpenMetricsModal}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              >
                ✏️ Enter Metrics
              </button>
            )}
            {onNavigateToTab && (
              <button
                onClick={() => onNavigateToTab('weekly-tests')}
                className="px-4 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-brand-500 to-sky-500 hover:from-brand-400 hover:to-sky-400 text-white shadow-lg shadow-brand-500/25 transition"
              >
                📝 Take Weekly Test
              </button>
            )}
          </div>
        </div>
      )}

      {completionMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs font-semibold text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{completionMessage}</span>
          </div>
          <button onClick={() => setCompletionMessage(null)} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Main Grid: Visual Radar Map & Skill Node Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Map Visualizer */}
        <div className="lg:col-span-5 p-6 rounded-2xl glass-card border border-slate-800 flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-brand-400" />
              <span>Skill DNA Topology</span>
            </h3>
            <span className="text-[10px] text-brand-400 font-bold uppercase tracking-wider">
              Level 1 to 10
            </span>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 10]} stroke="#475569" tick={{ fontSize: 9 }} />
                <Radar
                  name="Proficiency"
                  dataKey="level"
                  stroke="#38bdf8"
                  fill="#38bdf8"
                  fillOpacity={0.35}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '11px'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full text-center text-[11px] text-slate-400 pt-3 border-t border-slate-800">
            Current Overall DNA Mastery:{' '}
            <span className="font-extrabold text-brand-300">
              {(
                dna.skills.reduce((acc, s) => acc + s.level, 0) / dna.skills.length
              ).toFixed(1)} / 10.0
            </span>
          </div>
        </div>

        {/* Dynamic Skill Nodes List */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {dna.skills.map((skill) => {
            const pct = (skill.level / skill.maxLevel) * 100;

            return (
              <div
                key={skill.id}
                className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-bold text-white line-clamp-1"
                      title={skill.name}
                    >
                      {skill.name}
                    </span>
                    <span className="text-xs font-extrabold text-brand-400">
                      {skill.level} / {skill.maxLevel}
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: skill.color
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-4 pt-2 border-t border-slate-800/80">
                  <span>{skill.completedTopics} / {skill.totalTopics} modules</span>
                  <span className="text-emerald-400 font-semibold">{skill.growth}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Next Topic Recommendations Based on Weak Areas */}
      <div className="p-6 rounded-2xl glass-card border border-brand-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                AI Next Topic Recommendations
              </h3>
              <p className="text-xs text-slate-400">
                Personalized study units calculated to bolster your lowest capability dimensions
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
            Targeted AI Curricula
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {dna.aiRecommendations.map((topic) => (
            <div
              key={topic.id}
              className={`p-4 rounded-xl border flex flex-col justify-between transition ${
                topic.completed
                  ? 'bg-emerald-950/20 border-emerald-500/30 opacity-80'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-brand-300">
                    {topic.category}
                  </span>
                  <span className="text-[10px] font-bold text-amber-400">
                    +{topic.xpGain} XP
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white mt-2.5 leading-snug">
                  {topic.topic}
                </h4>

                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  {topic.reason}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {topic.estimatedMinutes} mins
                </span>

                <button
                  onClick={() => handleCompleteTopic(topic)}
                  disabled={topic.completed || completingTopicId === topic.id}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    topic.completed
                      ? 'bg-emerald-500/20 text-emerald-400 cursor-default'
                      : 'bg-brand-500 hover:bg-brand-400 text-slate-950 shadow-md shadow-brand-500/20'
                  }`}
                >
                  {topic.completed ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Completed</span>
                    </>
                  ) : completingTopicId === topic.id ? (
                    <span>Leveling Up...</span>
                  ) : (
                    <>
                      <span>Study & Level Up</span>
                      <ArrowRight className="w-3 h-3" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
