import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  ArrowRight,
  HelpCircle,
  AlertCircle,
  X,
  Play,
  RotateCcw,
  Check,
  Brain
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User, StudentProfile, WeeklyTest, WeeklyQuestion, WeeklyTestResult } from '../types';
import { api } from '../services/api';

interface WeeklyTestsProps {
  currentUser: User;
  profile: StudentProfile | null;
  onRefreshData: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const WeeklyTests: React.FC<WeeklyTestsProps> = ({
  currentUser,
  profile,
  onRefreshData,
  onNavigateToTab
}) => {
  const [tests, setTests] = useState<WeeklyTest[]>([]);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [loading, setLoading] = useState(true);

  // Active Test State
  const [activeTest, setActiveTest] = useState<WeeklyTest | null>(null);
  const [testQuestions, setTestQuestions] = useState<WeeklyQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(600);
  const [submitting, setSubmitting] = useState(false);
  const [testResult, setTestResult] = useState<WeeklyTestResult | null>(null);

  useEffect(() => {
    loadTestsCatalog();
  }, [currentUser]);

  // Timer Countdown
  useEffect(() => {
    let timer: any;
    if (activeTest && secondsRemaining > 0 && !testResult) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeTest, secondsRemaining, testResult]);

  const loadTestsCatalog = async () => {
    try {
      setLoading(true);
      const data = await api.getWeeklyTests(currentUser.id);
      setTests(data.tests);
      setTotalAttempts(data.totalAttempts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = async (testId: string) => {
    try {
      setLoading(true);
      const res = await api.getWeeklyTestDetails(testId);
      setActiveTest(res.test);
      setTestQuestions(res.test.questions || []);
      setUserAnswers({});
      setSecondsRemaining((res.test.durationMinutes || 10) * 60);
      setTestResult(null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmitTest = async () => {
    if (!activeTest || submitting) return;
    setSubmitting(true);

    try {
      const result = await api.submitWeeklyTest({
        studentId: currentUser.id,
        testId: activeTest.id,
        answers: userAnswers
      });

      setTestResult(result);
      if (result.passed) {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      onRefreshData();
      loadTestsCatalog();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseTestModal = () => {
    setActiveTest(null);
    setTestQuestions([]);
    setUserAnswers({});
    setTestResult(null);
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSecs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl glass-card border border-brand-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-500/25 border border-indigo-400/30 text-white shrink-0">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">Weekly Assessment & Progress Benchmarks</h1>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/30">
                +100 PTS Each
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Take weekly assessments across Data Structures, Web Engineering, System Design, and Placement Aptitude to validate mastery, update your Skill DNA, and boost your unified Success Score.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-left">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Assessments Taken</span>
            <span className="text-base font-black text-white block mt-0.5">{totalAttempts} / 4 Completed</span>
          </div>
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {tests.map((test) => (
          <div
            key={test.id}
            className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
              test.completed
                ? 'bg-slate-900/80 border-emerald-500/30 shadow-lg shadow-emerald-500/5'
                : 'glass-card border-slate-800 hover:border-brand-500/40'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/30">
                  Week {test.weekNumber} Assessment
                </span>
                {test.completed ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Passed ({test.score}%)
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                    <Clock className="w-3.5 h-3.5" />
                    {test.durationMinutes} Mins
                  </span>
                )}
              </div>

              <h3 className="text-base font-black text-white">{test.title}</h3>
              <p className="text-xs text-slate-400 mt-1">Category: <span className="text-slate-300 font-semibold">{test.category}</span></p>

              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800 text-center">
                <div className="p-2 rounded-xl bg-slate-950/60">
                  <span className="text-[10px] text-slate-500 block uppercase">Questions</span>
                  <span className="text-xs font-bold text-slate-200 mt-0.5 block">{test.questionsCount} MCQs</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/60">
                  <span className="text-[10px] text-slate-500 block uppercase">Reward</span>
                  <span className="text-xs font-bold text-amber-400 mt-0.5 block">+100 PTS</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/60">
                  <span className="text-[10px] text-slate-500 block uppercase">Skill Boost</span>
                  <span className="text-xs font-bold text-brand-300 mt-0.5 block">+Score DNA</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
              {test.completed ? (
                <div className="text-xs text-slate-400">
                  Completed on <span className="text-slate-300 font-semibold">{test.completedAt?.split('T')[0] || 'Recently'}</span>
                </div>
              ) : (
                <div className="text-xs text-slate-400">Ready to begin</div>
              )}

              <button
                onClick={() => handleStartTest(test.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  test.completed
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    : 'bg-gradient-to-r from-brand-500 to-sky-500 hover:from-brand-400 hover:to-sky-400 text-white shadow-md shadow-brand-500/20'
                }`}
              >
                {test.completed ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Test</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Start Test</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Active Assessment Runner Modal */}
      {activeTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-700/80 bg-[#0c1220] p-6 sm:p-8 shadow-2xl text-left max-h-[92vh] overflow-y-auto">
            <button
              onClick={handleCloseTestModal}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Test Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 uppercase">
                  Week {activeTest.weekNumber} Timed Assessment
                </span>
                <h2 className="text-lg font-black text-white mt-1">{activeTest.title}</h2>
              </div>

              {!testResult && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-amber-400">
                  <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>{formatTimer(secondsRemaining)}</span>
                </div>
              )}
            </div>

            {/* Results Screen */}
            {testResult ? (
              <div className="space-y-6 animate-in fade-in">
                <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-sky-950/30 border border-emerald-500/40 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-white">Assessment Completed!</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    You scored <strong className="text-emerald-400 text-sm">{testResult.score}%</strong> ({testResult.correctCount}/{testResult.totalCount} correct)
                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800 max-w-sm mx-auto">
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase">Reward</span>
                      <span className="text-sm font-black text-amber-400 mt-0.5 block">+{testResult.pointsAwarded} PTS</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase">New Success Score</span>
                      <span className="text-sm font-black text-brand-300 mt-0.5 block">{testResult.newSuccessScore}/100</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={handleCloseTestModal}
                    className="px-5 py-2.5 rounded-xl text-xs font-black bg-brand-500 hover:bg-brand-600 text-white transition shadow-lg shadow-brand-500/20"
                  >
                    View Updated Dashboard
                  </button>
                </div>
              </div>
            ) : (
              /* Questions Runner */
              <div className="space-y-6">
                <div className="space-y-6">
                  {testQuestions.map((q, qIndex) => {
                    const selected = userAnswers[q.id];
                    return (
                      <div key={q.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-left">
                        <div className="flex items-start gap-2.5 mb-3">
                          <span className="w-6 h-6 rounded-lg bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center justify-center text-xs font-bold shrink-0">
                            {qIndex + 1}
                          </span>
                          <h4 className="text-xs font-bold text-white leading-relaxed">
                            {q.question}
                          </h4>
                        </div>

                        <div className="space-y-2 pl-8">
                          {q.options.map((opt, optIndex) => {
                            const isChosen = selected === optIndex;
                            return (
                              <button
                                key={optIndex}
                                type="button"
                                onClick={() => handleSelectOption(q.id, optIndex)}
                                className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition flex items-center gap-2.5 border ${
                                  isChosen
                                    ? 'bg-brand-500/20 border-brand-500/50 text-white'
                                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                                }`}
                              >
                                <span
                                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                    isChosen
                                      ? 'border-brand-400 bg-brand-500'
                                      : 'border-slate-600 bg-transparent'
                                  }`}
                                >
                                  {isChosen && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </span>
                                <span>{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <div className="text-xs text-slate-400">
                    Answered <strong className="text-white">{Object.keys(userAnswers).length}</strong> of{' '}
                    <strong className="text-white">{testQuestions.length}</strong> questions
                  </div>

                  <button
                    onClick={handleSubmitTest}
                    disabled={submitting || Object.keys(userAnswers).length === 0}
                    className="px-6 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-brand-500 to-sky-500 hover:from-brand-400 hover:to-sky-400 text-white transition shadow-lg shadow-brand-500/25 disabled:opacity-50"
                  >
                    {submitting ? 'Submitting & Grading...' : 'Submit Assessment'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
