export interface SkillMetric {
  topic: string;
  masteryLevel: number; // 0-100
  questionsAsked: number;
  questionsCorrect: number;
  lastPracticed: Date;
  streakDays: number;
  timeSpent: number; // in minutes
  difficultyLevel: "beginner" | "intermediate" | "advanced";
  validationsPassed: number;
  validationsFailed: number;
}

export interface LearningGoal {
  id: string;
  title: string;
  topic: string;
  targetMastery: number; // 0-100
  deadline: Date;
  status: "active" | "completed" | "abandoned";
  createdAt: Date;
  completedAt?: Date;
}

export interface UserProfile {
  userId: string;
  name: string;
  email?: string;
  joinedDate: Date;
  totalLearningMinutes: number;
  currentStreak: number;
  longestStreak: number;
  learningStyle: "visual" | "auditory" | "kinesthetic" | "reading" | "unknown";
  preferredPace: "slow" | "normal" | "fast";
  skills: SkillMetric[];
  goals: LearningGoal[];
  totalTopicsLearned: number;
  averageMastery: number; // Average of all skills
}

export interface QuizQuestion {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: "easy" | "medium" | "hard";
  explanation: string;
}

export interface Quiz {
  id: string;
  topic: string;
  title: string;
  questions: QuizQuestion[];
  createdAt: Date;
}

export interface QuizResult {
  quizId: string;
  userId: string;
  topic: string;
  score: number; // 0-100
  questionsCorrect: number;
  totalQuestions: number;
  completedAt: Date;
  timeSpent: number; // in minutes
  answers: number[]; // indices of selected answers
}

export interface LearningSession {
  id: string;
  userId: string;
  topic: string;
  startTime: Date;
  endTime?: Date;
  durationMinutes: number;
  messagesCount: number;
  questionsAsked: number;
  questionsCorrect: number;
  skillBefore: number;
  skillAfter: number;
  notes?: string;
}
