import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User as UserIcon,
  HelpCircle,
  TrendingUp,
  Briefcase,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import { User, StudentProfile, StreakData, AiChatMessage } from '../types';
import { api } from '../services/api';

interface AiStudentBotProps {
  currentUser: User;
  profile: StudentProfile | null;
  streak: StreakData | null;
  onOpenMetricsModal?: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const AiStudentBot: React.FC<AiStudentBotProps> = ({
  currentUser,
  profile,
  streak,
  onOpenMetricsModal,
  onNavigateToTab
}) => {
  const isZeroScale = !profile || profile.hasProvidedData === false || profile.successScore === 0;

  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: isZeroScale
        ? `Hello **${currentUser.name}**! 👋 I'm your **AURA AI Success Copilot**.\n\nYour profile is currently at **0 Scale** because you haven't entered your academic and placement data yet. Click **"✏️ Enter My Details"** to configure your grades, attendance, and GitHub project so I can predict your placement trajectory and build your personalized learning plan!`
        : `Hello **${currentUser.name}**! 👋 I'm your **AURA AI Success Copilot**.\n\nI have loaded your live academic records from MongoDB Atlas:\n- **Success Score**: **${profile.successScore}/100**\n- **CGPA**: **${profile.academics.cgpa}/10** (${profile.academics.activeBacklogs} backlogs)\n- **Attendance**: **${profile.attendance.attendancePct}%**\n- **Coding Assessment**: **${profile.placement.codingChallengeScore}/100**\n- **Target Career Goal**: **${currentUser.targetJobRole || 'Software Engineer'}**\n\nAsk me anything about your placement screening odds, attendance warnings, weekly study strategy, or project defense!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const quickQuestions = [
    {
      label: '🎯 Placement Readiness Odds',
      prompt: 'What are my campus placement screening odds for my target role based on my CGPA and coding score?'
    },
    {
      label: '⚠️ Attendance & Debarment Check',
      prompt: 'Check my current attendance: am I at risk of university debarment?'
    },
    {
      label: '📈 Predict 3-Month Trajectory',
      prompt: 'Predict my score trajectory over the next 3 months and tell me when I will be job-ready.'
    },
    {
      label: '🗓️ 7-Day Study Focus Plan',
      prompt: 'What should be my high-priority focus area and 7-day study schedule this week?'
    },
    {
      label: '💻 GitHub Project Defense',
      prompt: 'How do I take the Proof of Build AI Voice Defense on my GitHub projects?'
    }
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    const userMsg: AiChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await api.chatWithAi({
        studentId: currentUser.id,
        message: text,
        conversationHistory: historyPayload
      });

      const aiMsg: AiChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: AiChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ Sorry, I could not connect to the analytics engine: ${err.message || 'Server error'}. Please try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        role: 'assistant',
        content: `Chat session refreshed. How can I help you today, **${currentUser.name}**?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Format markdown helper (bolding, lists, headers)
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Header 3
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-bold text-white text-sm mt-2 mb-1 text-sky-300">
            {line.replace('### ', '')}
          </h4>
        );
      }
      // Bullet point
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const text = line.trim().replace(/^[-*]\s+/, '');
        return (
          <li key={idx} className="ml-4 text-xs list-disc leading-relaxed text-slate-200">
            {renderInlineMarkdown(text)}
          </li>
        );
      }
      // Numbered list
      if (/^\d+\.\s+/.test(line.trim())) {
        const text = line.trim().replace(/^\d+\.\s+/, '');
        return (
          <li key={idx} className="ml-4 text-xs list-decimal leading-relaxed text-slate-200">
            {renderInlineMarkdown(text)}
          </li>
        );
      }
      // Empty line
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      // Regular paragraph
      return (
        <p key={idx} className="text-xs leading-relaxed text-slate-200">
          {renderInlineMarkdown(line)}
        </p>
      );
    });
  };

  const renderInlineMarkdown = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Live Context */}
      <div className="p-6 rounded-3xl glass-card border border-brand-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-500 via-sky-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-500/25 border border-sky-300/30 text-white shrink-0">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">AI Student Success Copilot</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                🟢 Live Data Fed
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Ask questions about your career readiness, attendance debarment checks, and personalized study roadmaps. Predictions are calculated using your live platform data.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {isZeroScale && onOpenMetricsModal && (
            <button
              onClick={onOpenMetricsModal}
              className="px-3.5 py-2 rounded-xl text-xs font-black bg-brand-500 hover:bg-brand-600 text-white transition shadow-md shadow-brand-500/20"
            >
              ✏️ Enter My Details
            </button>
          )}
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Clear Chat History"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Live Profile Metrics Chips */}
      {profile && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-left">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Success Score</span>
            <span className="text-lg font-black text-brand-400 mt-0.5 block">
              {profile.successScore}/100
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-left">
            <span className="text-[10px] font-bold text-sky-400 block uppercase">Academic CGPA</span>
            <span className="text-lg font-black text-white mt-0.5 block">
              {profile.academics.cgpa} / 10
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-left">
            <span className="text-[10px] font-bold text-emerald-400 block uppercase">Attendance</span>
            <span className="text-lg font-black text-white mt-0.5 block">
              {profile.attendance.attendancePct}%
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-left">
            <span className="text-[10px] font-bold text-rose-400 block uppercase">Coding Score</span>
            <span className="text-lg font-black text-white mt-0.5 block">
              {profile.placement.codingChallengeScore}/100
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-left">
            <span className="text-[10px] font-bold text-amber-400 block uppercase">Active Backlogs</span>
            <span className={`text-lg font-black mt-0.5 block ${profile.academics.activeBacklogs > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {profile.academics.activeBacklogs}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-left">
            <span className="text-[10px] font-bold text-purple-400 block uppercase">Target Goal</span>
            <span className="text-xs font-bold text-purple-200 truncate mt-1 block">
              {currentUser.targetJobRole || 'Software Engineer'}
            </span>
          </div>
        </div>
      )}

      {/* Main Chat Interface */}
      <div className="rounded-3xl glass-card border border-slate-800 flex flex-col h-[560px] overflow-hidden shadow-2xl">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((m) => {
            const isBot = m.role === 'assistant';
            return (
              <div
                key={m.id}
                className={`flex items-start gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-500 to-sky-400 flex items-center justify-center text-white shrink-0 shadow-md shadow-brand-500/20 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-left shadow-lg ${
                    isBot
                      ? 'bg-slate-900/90 border border-slate-800 text-slate-100 rounded-tl-sm'
                      : 'bg-gradient-to-r from-brand-600 to-sky-600 text-white rounded-tr-sm shadow-brand-500/10'
                  }`}
                >
                  <div className="space-y-1">{renderFormattedContent(m.content)}</div>
                  <div className="mt-2 text-[10px] text-slate-400 text-right opacity-70">
                    {m.timestamp}
                  </div>
                </div>

                {!isBot && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-500 to-sky-400 flex items-center justify-center text-white shrink-0 shadow-md shadow-brand-500/20">
                <Bot className="w-4 h-4" />
              </div>
              <div className="rounded-2xl p-4 bg-slate-900/90 border border-slate-800 text-slate-400 text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce delay-200" />
                <span className="ml-1 text-slate-300 font-medium">Analyzing student metrics & generating guidance...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompt Chips */}
        <div className="px-5 py-2.5 border-t border-slate-800/80 bg-slate-950/60 overflow-x-auto no-scrollbar flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-brand-400" /> Prompt:
          </span>
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(q.prompt)}
              disabled={loading}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition whitespace-nowrap shrink-0 disabled:opacity-50"
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-[#090d16]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Ask your AI Copilot about placements, score predictions, or study plans...`}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs font-medium focus:border-brand-500 focus:outline-none placeholder-slate-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || loading}
              className="p-3 rounded-2xl bg-gradient-to-r from-brand-500 to-sky-500 hover:from-brand-400 hover:to-sky-400 text-white font-bold transition shadow-lg shadow-brand-500/25 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              title="Send Query"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
