import {
  User,
  StudentProfile,
  StreakData,
  RewardCatalogItem,
  UserPoints,
  LeaderboardStudent,
  SkillDNAData,
  GithubProject,
  VoiceQuestion,
  WeeklyTest,
  WeeklyTestResult,
} from '../types';



const API_BASE = 'https://server-1-b8mh.onrender.com';

export const api = {
  // Authentication
  async getUsers(): Promise<User[]> {
    try {
      const res = await fetch(`${API_BASE}/auth/users`);
      if (!res.ok) {
        console.warn(`[API] /auth/users returned ${res.status}`);
        return [];
      }
      const data = await res.json();
      return data.users || [];
    } catch (err: any) {
      console.warn('[API] Could not fetch users:', err.message);
      return [];
    }
  },

  async login(credentials: { email?: string; password?: string; userId?: string }): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) {
      let errMsg = 'Login failed';
      try {
        const err = await res.json();
        errMsg = err.error || errMsg;
      } catch {
        errMsg = `Server error (${res.status}): Backend service is starting up or unreachable.`;
      }
      throw new Error(errMsg);
    }
    return res.json();
  },

  async signup(data: {
    name: string;
    email: string;
    password: string;
    role: 'student' | 'educator';
    batch?: string;
    department?: string;
    targetJobRole?: string;
  }): Promise<{ user: User; token: string; message: string }> {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      let errMsg = 'Signup failed';
      try {
        const err = await res.json();
        errMsg = err.error || errMsg;
      } catch {
        errMsg = `Server error (${res.status}): Backend service is starting up or unreachable.`;
      }
      throw new Error(errMsg);
    }
    return res.json();
  },

  // Student Profiles & Analytics
  async getStudent(id: string): Promise<{
    user: User;
    profile: StudentProfile;
    streak: StreakData;
    points: UserPoints;
    verifiedProjectsCount: number;
  }> {
    const res = await fetch(`${API_BASE}/students/${id}`);
    if (!res.ok) throw new Error('Student profile not found');
    return res.json();
  },

  async getAllStudents(): Promise<{
    students: Array<User & { profile: StudentProfile; streak: number; verifiedProjectsCount: number }>;
    summary: {
      totalStudents: number;
      criticalRiskCount: number;
      watchlistCount: number;
      avgSuccessScore: number;
      avgAttendance: number;
      avgPlacementReadiness: number;
    };
  }> {
    const res = await fetch(`${API_BASE}/students/all`);
    return res.json();
  },

  async simulateMetrics(id: string, params: {
    cgpa: number;
    activeBacklogs: number;
    attendancePct: number;
    assignmentCompletionPct: number;
    weeklyStudyHours: number;
    codingChallengeScore: number;
  }) {
    const res = await fetch(`${API_BASE}/students/${id}/simulate-metrics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return res.json();
  },

  async logIntervention(data: {
    studentId: string;
    interventionType: string;
    notes?: string;
    facultyName?: string;
  }) {
    const res = await fetch(`${API_BASE}/faculty/intervention`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateStudentMetrics(id: string, metrics: Record<string, any>): Promise<{
    message: string;
    profile: StudentProfile;
    user: User;
    successScore: number;
  }> {
    const res = await fetch(`${API_BASE}/students/${id}/metrics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metrics),
    });
    if (!res.ok) throw new Error('Failed to update student metrics');
    return res.json();
  },

  // Streaks
  async getStreak(studentId: string): Promise<StreakData> {
    const res = await fetch(`${API_BASE}/streaks/${studentId}`);
    const data = await res.json();
    return data.streak;
  },

  async checkIn(studentId: string) {
    const res = await fetch(`${API_BASE}/streaks/${studentId}/checkin`, {
      method: 'POST',
    });
    return res.json();
  },

  async activateFreeze(studentId: string) {
    const res = await fetch(`${API_BASE}/streaks/${studentId}/freeze`, {
      method: 'POST',
    });
    return res.json();
  },

  async buyFreeze(studentId: string) {
    const res = await fetch(`${API_BASE}/rewards/redeem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, rewardId: 'rew-1' }),
    });
    return res.json();
  },

  // Proof of Build Voice Interview
  async getRepos(studentId: string): Promise<GithubProject[]> {
    const res = await fetch(`${API_BASE}/interview/repos/${studentId}`);
    const data = await res.json();
    return data.repos;
  },

  async addGithubRepo(payload: {
    studentId: string;
    repoName?: string;
    title: string;
    description?: string;
    techStack?: string[] | string;
    sampleSnippet?: string;
  }): Promise<{ message: string; repo: GithubProject }> {
    const res = await fetch(`${API_BASE}/interview/repos/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to add GitHub repository');
    return res.json();
  },

  async startInterview(repoId: string): Promise<{
    repo: GithubProject;
    questions: VoiceQuestion[];
    sessionId: string;
  }> {
    const res = await fetch(`${API_BASE}/interview/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repoId }),
    });
    return res.json();
  },

  async evaluateInterview(payload: {
    repoId: string;
    studentId: string;
    answers: Array<{ questionId: string; transcript: string; durationSec: number }>;
  }) {
    const res = await fetch(`${API_BASE}/interview/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Rewards & Leaderboard
  async getRewardCatalog(): Promise<RewardCatalogItem[]> {
    const res = await fetch(`${API_BASE}/rewards/catalog`);
    const data = await res.json();
    return data.catalog;
  },

  async getUserPoints(studentId: string): Promise<UserPoints> {
    const res = await fetch(`${API_BASE}/rewards/user/${studentId}`);
    const data = await res.json();
    return data.userPoints;
  },

  async redeemReward(studentId: string, rewardId: string) {
    const res = await fetch(`${API_BASE}/rewards/redeem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, rewardId }),
    });
    return res.json();
  },

  async getLeaderboard(): Promise<{
    batches: string[];
    students: LeaderboardStudent[];
    teamStreaks: any[];
  }> {
    const res = await fetch(`${API_BASE}/leaderboard`);
    const data = await res.json();
    return {
      batches: ["Class of 2026 - CS-A", "Class of 2026 - CS-B", "Class of 2026 - AI Honors"],
      students: data.students || [],
      teamStreaks: [
        {
          id: "t1",
          teamName: "ByteSquad Alpha",
          batch: "Class of 2026 - CS-A",
          combinedStreak: 42,
          membersCount: 4,
          members: ["Alex Mercer", "Elena Rostova", "Kavita Shah", "David K."],
          status: "Active Glow",
          totalPoints: 6850
        },
        {
          id: "t2",
          teamName: "KernelPanic AI",
          batch: "Class of 2026 - AI Honors",
          combinedStreak: 29,
          membersCount: 3,
          members: ["Dev Kulkarni", "Sophie T.", "Zack L."],
          status: "Active",
          totalPoints: 4920
        }
      ]
    };
  },

  // Skill DNA
  async getSkillDNA(studentId: string): Promise<SkillDNAData> {
    const res = await fetch(`${API_BASE}/skills/dna/${studentId}`);
    const data = await res.json();
    return data.dna;
  },

  async completeTopic(studentId: string, topicId: string) {
    const res = await fetch(`${API_BASE}/skills/complete-topic`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, topicId }),
    });
    return res.json();
  },

  // Future You Forecast
  async getFutureYou(studentId: string) {
    const res = await fetch(`${API_BASE}/future-you/${studentId}`);
    const data = await res.json();
    return data.futureYou;
  },

  async simulateFuture(params: {
    weeklyHours: number;
    assignmentsRate: number;
    codingScore?: number;
    verifiedProjects?: number;
  }) {
    const res = await fetch(`${API_BASE}/future-you/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return res.json();
  },

  // Passport
  async getPassport(studentId: string) {
    const res = await fetch(`${API_BASE}/passport/${studentId}`);
    const data = await res.json();
    return data.passport;
  },

  // MongoDB Atlas Database Diagnostics
  async getDbStatus(): Promise<{
    connected: boolean;
    urlConfigured: boolean;
    mode: 'atlas' | 'local_fallback';
    host: string | null;
    database: string | null;
    message: string;
    readyState: number;
    timestamp: string;
  }> {
    try {
      const res = await fetch(`${API_BASE}/db/status`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch {
      return {
        connected: false,
        urlConfigured: true,
        mode: 'local_fallback',
        host: null,
        database: null,
        message: 'Backend server is connecting...',
        readyState: 0,
        timestamp: new Date().toISOString(),
      };
    }
  },

  // AI Student Copilot Bot
  async chatWithAi(payload: {
    studentId: string;
    message: string;
    conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  }): Promise<{ reply: string; timestamp: string }> {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('AI Copilot request failed');
    return res.json();
  },

  // Weekly Assessment Tests
  async getWeeklyTests(studentId: string): Promise<{ tests: WeeklyTest[]; totalAttempts: number }> {
    const res = await fetch(`${API_BASE}/tests/catalog/${studentId}`);
    if (!res.ok) throw new Error('Failed to fetch weekly tests');
    return res.json();
  },

  async getWeeklyTestDetails(testId: string): Promise<{ test: WeeklyTest }> {
    const res = await fetch(`${API_BASE}/tests/${testId}`);
    if (!res.ok) throw new Error('Failed to fetch test details');
    return res.json();
  },

  async submitWeeklyTest(payload: {
    studentId: string;
    testId: string;
    answers: Record<string, number>;
  }): Promise<WeeklyTestResult> {
    const res = await fetch(`${API_BASE}/tests/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to submit weekly test');
    return res.json();
  },
};

