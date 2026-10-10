export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'educator';
  batch?: string;
  department?: string;
  avatar: string;
  joinedAt?: string;
  githubUsername?: string;
  githubConnected?: boolean;
  bio?: string;
  targetJobRole?: string;
  title?: string;
  segmentation?: 'all-round-leader' | 'high-academics-low-placement' | 'high-placement-low-attendance' | 'critical-academic-risk';
}

export interface AcademicMetrics {
  cgpa: number;
  marksPct: number;
  activeBacklogs: number;
  completedCredits: number;
  totalCredits: number;
}

export interface AttendanceMetrics {
  attendancePct: number;
  lecturesAttended: number;
  totalLectures: number;
  status: 'safe' | 'warning' | 'critical';
}

export interface LmsMetrics {
  assignmentCompletionPct: number;
  weeklyLogins: number;
  weeklyStudyHours: number;
  forumDiscussionsScore: number;
}

export interface EngagementMetrics {
  eventsAttended: number;
  hackathonsCount: number;
  certificationsCount: number;
  extracurricularScore: number;
}

export interface PlacementMetrics {
  aptitudeScore: number;
  codingChallengeScore: number;
  mockInterviewScore: number;
  readinessLevel: 'ready' | 'needs-prep' | 'not-ready';
}

export interface SkillsAssessmentsMetrics {
  dsaScore: number;
  systemDesignScore: number;
  coreCsScore: number;
}

export interface ExplainableFactor {
  indicator: string;
  contribution: string;
  type: 'positive' | 'negative';
  note: string;
}

export interface FutureForecast {
  currentPaceMonths: number;
  targetRole: string;
  readinessScore: number;
  breakdown: {
    systemDesign: number;
    codingProficiency: number;
    verifiedBuildProof: number;
    dailyConsistency: number;
    interviewReadiness: number;
  };
  projections: Array<{
    month: string;
    readiness: number;
    marketPercentile: number;
  }>;
  aiAdvice: string;
}

export interface FutureYouData {
  currentScore: number;
  projected3MonthScore: number;
  statement: string;
  targetMilestone: string;
  projections: Array<{
    month: string;
    score: number;
  }>;
}

export interface StudentProfile {
  studentId: string;
  hasProvidedData?: boolean;
  academics: AcademicMetrics;
  attendance: AttendanceMetrics;
  lms: LmsMetrics;
  engagement: EngagementMetrics;
  placement: PlacementMetrics;
  skillsAssessments: SkillsAssessmentsMetrics;
  successScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  riskFlags: string[];
  explainableFactors: ExplainableFactor[];
  futureYou: FutureYouData;
  history: Array<{
    month: string;
    score: number;
    academics: number;
    attendance: number;
    placement: number;
  }>;
  facultyFeedback?: string;
}

export interface Milestone {
  days: number;
  title: string;
  achieved: boolean;
  date?: string | null;
  icon: string;
}

export interface WeeklyCheckin {
  day: string;
  active: boolean;
}

export interface StreakData {
  studentId: string;
  currentStreak: number;
  longestStreak: number;
  freezeTokens: number;
  freezeTokensUsedTotal?: number;
  todayCheckedIn: boolean;
  lastCheckinDate?: string;
  usualLoginTime?: string;
  streakProtectionActive?: boolean;
  milestones: Milestone[];
  weeklyCheckins: WeeklyCheckin[];
}

export interface RewardCatalogItem {
  id: string;
  title: string;
  category: string;
  points: number;
  description: string;
  icon: string;
  badge: string;
}

export interface UserPoints {
  totalEarned: number;
  currentBalance: number;
  redeemedHistory: Array<{
    id: string;
    rewardId: string;
    title: string;
    points: number;
    date: string;
  }>;
}

export interface LeaderboardStudent {
  id: string;
  name: string;
  points: number;
  streak: number;
  verifiedProjects: number;
  batch: string;
  rank: number;
  avatar: string;
  progressVsLastMonth?: number;
}

export interface TeamStreak {
  id: string;
  teamName: string;
  batch: string;
  combinedStreak: number;
  membersCount: number;
  members: string[];
  status: string;
  totalPoints: number;
}

export interface SkillNode {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  growth: string;
  color: string;
  completedTopics: number;
  totalTopics: number;
}

export interface TopicRecommendation {
  id: string;
  topic: string;
  category: string;
  reason: string;
  estimatedMinutes: number;
  xpGain: number;
  difficulty: string;
  completed: boolean;
}

export interface SkillDNAData {
  skills: SkillNode[];
  aiRecommendations: TopicRecommendation[];
}

export interface RepoFile {
  path: string;
  summary: string;
  snippet: string;
}

export interface InterviewAudit {
  completedAt: string;
  overallScore: number;
  aiVerdict: string;
  reasoning: string;
  breakdown?: {
    architectureRationale: number;
    codeInternalsMastery: number;
    failureHandlingDepth: number;
    aiHallucinationRisk: string;
  };
  questionsAnswered: number;
}

export interface GithubProject {
  id: string;
  studentId: string;
  repoName: string;
  title: string;
  description: string;
  techStack: string[];
  stars: number;
  forks: number;
  commitsCount: number;
  lastPushed: string;
  verified: boolean;
  verifiedDate?: string | null;
  verificationBadge?: string | null;
  authenticityScore?: number | null;
  certificateHash?: string | null;
  files: RepoFile[];
  interviewAudit?: InterviewAudit | null;
}

export interface VoiceQuestion {
  id: string;
  questionNumber: number;
  category: string;
  questionText: string;
  hint: string;
  sampleFile?: RepoFile;
}

export interface WeeklyQuestion {
  id: string;
  question: string;
  options: string[];
}

export interface WeeklyTest {
  id: string;
  weekNumber: number;
  title: string;
  category: string;
  durationMinutes: number;
  questionsCount: number;
  completed: boolean;
  score?: number | null;
  passed?: boolean;
  completedAt?: string | null;
  questions?: WeeklyQuestion[];
}

export interface WeeklyTestResult {
  message: string;
  score: number;
  correctCount: number;
  totalCount: number;
  passed: boolean;
  pointsAwarded: number;
  newSuccessScore: number;
  profile: StudentProfile;
  attempt: {
    testId: string;
    weekNumber: number;
    title: string;
    score: number;
    passed: boolean;
    correctCount: number;
    totalCount: number;
    completedAt: string;
  };
}

export interface AiChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
