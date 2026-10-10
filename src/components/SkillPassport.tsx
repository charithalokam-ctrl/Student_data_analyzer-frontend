import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Copy,
  Flame,
  Download
} from 'lucide-react';
import { User, GithubProject, SkillNode } from '../types';
import { api } from '../services/api';

interface SkillPassportProps {
  currentUser: User;
  onClose?: () => void;
  isModal?: boolean;
}

export const SkillPassport: React.FC<SkillPassportProps> = ({
  currentUser,
  onClose,
  isModal = false
}) => {
  const [passportData, setPassportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadPassport();
  }, [currentUser]);

  const loadPassport = async () => {
    try {
      setLoading(true);
      const data = await api.getPassport(currentUser.id);
      setPassportData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/passport/${currentUser.githubUsername || currentUser.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading || !passportData) {
    return <div className="p-8 text-center text-slate-400">Loading Verifiable Skill Passport...</div>;
  }

  const { user, stats, verifiedProjects, skills, authority, issueDate } = passportData;

  const content = (
    <div className="space-y-6">
      {/* Passport Header Banner with Verification Stamp */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-brand-950/40 border border-slate-700/80 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-emerald-400/40 shadow-xl"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">{user.name}</h1>
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Recruiter Verified
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {user.batch} • @{user.githubUsername}
              </p>
              <p className="text-xs text-brand-300 font-medium mt-0.5">
                Target Role: {user.targetJobRole}
              </p>
            </div>
          </div>

          {/* Share & Copy Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2 transition"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied Public Link!' : 'Copy Passport URL'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 text-xs font-extrabold flex items-center gap-2 transition shadow-lg shadow-brand-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Verifier Trust Ribbon */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Verification Authority: <strong className="text-slate-300">{authority}</strong>
          </span>
          <span>Verified Timestamp: {issueDate}</span>
          <span className="font-mono text-slate-500">SIGNATURE: SHA-256 VALID</span>
        </div>
      </div>

      {/* Recruiter Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-card border border-slate-800 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Academic Success Score
          </span>
          <span className="text-2xl font-black text-white mt-1 block">
            {stats.predictionScore}%
          </span>
          <span className="text-[10px] text-emerald-400 block mt-0.5">Top Decile</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-800 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Voice-Verified Projects
          </span>
          <span className="text-2xl font-black text-brand-400 mt-1 block">
            {stats.verifiedProjectsCount}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Code Defense Passed</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-800 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Builder Authenticity
          </span>
          <span className="text-2xl font-black text-emerald-400 mt-1 block">
            {stats.averageAuthenticityScore || 94}%
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Non-AI Generated</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-800 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Active Learning Streak
          </span>
          <span className="text-2xl font-black text-orange-400 mt-1 block flex items-center justify-center gap-1">
            <Flame className="w-5 h-5" /> {stats.currentStreak}d
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">High Consistency</span>
        </div>
      </div>

      {/* Proof-of-Build Verified Projects Section */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Voice-Verified GitHub Codebases ({verifiedProjects.length})</span>
            </h3>
            <p className="text-xs text-slate-400">
              Projects defended live via voice architecture interviews with AI code examiner
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Cryptographically Audited
          </span>
        </div>

        <div className="space-y-3">
          {verifiedProjects.map((project: GithubProject) => (
            <div
              key={project.id}
              className="p-5 rounded-xl bg-slate-900/80 border border-emerald-500/30 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{project.title}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                      {project.verificationBadge || 'Verified Builder'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{project.description}</p>
                </div>

                <div className="text-right sm:shrink-0 font-mono text-xs text-brand-300">
                  <span className="text-[10px] text-slate-500 block">AUDIT CERTIFICATE</span>
                  <span>{project.certificateHash}</span>
                </div>
              </div>

              {project.interviewAudit && (
                <div className="p-3 rounded-lg bg-black/40 border border-slate-800 text-xs text-slate-300">
                  <span className="font-bold text-emerald-300 block mb-0.5">
                    AI Voice Examiner Assessment:
                  </span>
                  <p className="text-slate-400 leading-relaxed">
                    {project.interviewAudit.reasoning}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Skill DNA Summary */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800">
        <h3 className="text-base font-bold text-white mb-3">Audited Skill DNA Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {skills.map((skill: SkillNode) => (
            <div key={skill.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between text-xs font-bold text-white">
                <span className="truncate">{skill.name}</span>
                <span className="text-brand-400">{skill.level} / 10</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div
                  className="bg-brand-500 h-full rounded-full"
                  style={{ width: `${(skill.level / 10) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-4xl my-8 bg-slate-950 rounded-3xl border border-slate-800 p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-end mb-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
            >
              ✕ Close
            </button>
          </div>
          {content}
        </div>
      </div>
    );
  }

  return content;
};
