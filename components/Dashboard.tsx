"use client";

import { useState, useEffect } from "react";

interface SkillMetric {
  topic: string;
  masteryLevel: number;
  questionsCorrect: number;
  totalQuestions: number;
  streakDays: number;
  timeSpent: number;
}

interface LearningGoal {
  id: string;
  title: string;
  topic: string;
  targetMastery: number;
  progress: number;
  status: "active" | "completed" | "abandoned";
}

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [skills, setSkills] = useState<SkillMetric[]>([]);
  const [userProfile, setUserProfile] = useState({
    name: "Student",
    totalLearningMinutes: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalTopicsLearned: 0,
    averageMastery: 0,
  });
  const [goals, setGoals] = useState<LearningGoal[]>([]);
  const [chartData, setChartData] = useState<{ day: string; hours: number }[]>([]);

  useEffect(() => {
    // Load user profile from localStorage
    const saved = localStorage.getItem("edubuddy_user_profile");
    if (saved) {
      setUserProfile(JSON.parse(saved));
    }

    // Load skills from localStorage
    const savedSkills = localStorage.getItem("edubuddy_skills");
    if (savedSkills) {
      setSkills(JSON.parse(savedSkills));
    }

    // Load or generate goals
    const savedGoals = localStorage.getItem("edubuddy_goals");
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    } else {
      // Generate sample goals
      const sampleGoals: LearningGoal[] = [
        {
          id: "1",
          title: "Master Photosynthesis",
          topic: "Photosynthesis",
          targetMastery: 90,
          progress: 65,
          status: "active",
        },
        {
          id: "2",
          title: "Excel at Algebra",
          topic: "Algebra",
          targetMastery: 85,
          progress: 70,
          status: "active",
        },
        {
          id: "3",
          title: "Learn Python Fundamentals",
          topic: "Python",
          targetMastery: 80,
          progress: 50,
          status: "active",
        },
      ];
      setGoals(sampleGoals);
      localStorage.setItem("edubuddy_goals", JSON.stringify(sampleGoals));
    }

    // Generate learning activity data
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const activityData = days.map((day) => ({
      day,
      hours: Math.floor(Math.random() * 5) + 0.5,
    }));
    setChartData(activityData);
  }, []);

  const getMasteryColor = (level: number) => {
    if (level >= 80) return "from-green-400 to-emerald-400";
    if (level >= 60) return "from-yellow-400 to-amber-400";
    if (level >= 40) return "from-orange-400 to-red-400";
    return "from-red-500 to-pink-500";
  };

  const getMasteryText = (level: number) => {
    if (level >= 80) return "Expert";
    if (level >= 60) return "Advanced";
    if (level >= 40) return "Intermediate";
    return "Beginner";
  };

  const getGoalProgress = (progress: number, target: number) => {
    return Math.min(Math.round((progress / target) * 100), 100);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-32 right-6 w-14 h-14 bg-gradient-to-br from-teal-500 to-blue-500 text-white rounded-full flex items-center justify-center text-2xl hover:shadow-2xl transition-all hover:scale-110 z-40"
      >
        📊
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-slate-900/95 to-black/95 backdrop-blur-2xl border border-white/10 max-h-[95vh] w-full max-w-6xl overflow-y-auto rounded-3xl shadow-2xl">
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="fixed top-8 right-8 text-white text-3xl hover:bg-white/10 p-2 rounded-lg z-50"
        >
          ✕
        </button>

        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📊</div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Learning Analytics Dashboard
            </h1>
            <p className="text-slate-400 text-lg">Track your progress and insights</p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-400/30 p-4 rounded-xl text-center">
              <p className="text-slate-400 text-sm mb-2">Average Mastery</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {userProfile.averageMastery}%
              </p>
              <p className="text-xs text-slate-500 mt-2">
                {getMasteryText(userProfile.averageMastery)}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-400/30 p-4 rounded-xl text-center">
              <p className="text-slate-400 text-sm mb-2">Topics Learned</p>
              <p className="text-3xl font-bold text-purple-400">
                {userProfile.totalTopicsLearned}
              </p>
              <p className="text-xs text-slate-500 mt-2">areas of knowledge</p>
            </div>

            <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 border border-pink-400/30 p-4 rounded-xl text-center">
              <p className="text-slate-400 text-sm mb-2">Current Streak</p>
              <p className="text-3xl font-bold text-pink-400">
                {userProfile.currentStreak}
                <span className="text-lg ml-1">🔥</span>
              </p>
              <p className="text-xs text-slate-500 mt-2">days in a row</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-400/30 p-4 rounded-xl text-center">
              <p className="text-slate-400 text-sm mb-2">Longest Streak</p>
              <p className="text-3xl font-bold text-orange-400">
                {userProfile.longestStreak}
              </p>
              <p className="text-xs text-slate-500 mt-2">days best record</p>
            </div>

            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-400/30 p-4 rounded-xl text-center">
              <p className="text-slate-400 text-sm mb-2">Total Learning</p>
              <p className="text-3xl font-bold text-green-400">
                {Math.round(userProfile.totalLearningMinutes / 60)}h
              </p>
              <p className="text-xs text-slate-500 mt-2">
                {userProfile.totalLearningMinutes}m total
              </p>
            </div>
          </div>

          {/* Learning Activity Chart */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              📈 Weekly Learning Activity
            </h2>
            <div className="flex items-end justify-between h-48 gap-2">
              {chartData.map((data, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1">
                  <div className="w-full bg-white/10 border border-white/20 rounded-lg relative overflow-hidden group cursor-pointer transition-all hover:border-teal-400/50">
                    <div
                      className="bg-gradient-to-t from-teal-500 to-blue-500 w-full rounded-lg transition-all group-hover:shadow-lg group-hover:shadow-teal-500/50"
                      style={{
                        height: `${(data.hours / 5) * 100}%`,
                        minHeight: "4px",
                      }}
                    ></div>
                  </div>
                  <p className="text-slate-400 text-xs mt-3 font-semibold">{data.day}</p>
                  <p className="text-slate-500 text-xs">{data.hours.toFixed(1)}h</p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Breakdown */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              📚 Skills Breakdown
            </h2>
            {skills.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.map((skill) => (
                  <div
                    key={skill.topic}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-xl hover:bg-white/10 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg">
                          {skill.topic}
                        </h3>
                        <p className="text-slate-400 text-sm">
                          {skill.questionsCorrect}/{skill.totalQuestions} questions
                          correct • {skill.streakDays} day streak 🔥
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                          {skill.masteryLevel}%
                        </p>
                        <p className="text-xs text-slate-400">
                          {getMasteryText(skill.masteryLevel)}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden mb-3">
                      <div
                        className={`bg-gradient-to-r ${getMasteryColor(
                          skill.masteryLevel
                        )} h-full rounded-full shadow-lg transition-all group-hover:shadow-2xl`}
                        style={{ width: `${skill.masteryLevel}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-xs text-slate-500">
                      <p>⏱️ {Math.round(skill.timeSpent / 60)}h spent</p>
                      <p>Accuracy: {Math.round((skill.questionsCorrect / skill.totalQuestions) * 100)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-xl text-center">
                <p className="text-slate-400">
                  No skills tracked yet. Start learning to build your profile! 🚀
                </p>
              </div>
            )}
          </div>

          {/* Learning Goals */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              🎯 Learning Goals
            </h2>
            <div className="space-y-4">
              {goals.map((goal) => {
                const progressPercent = getGoalProgress(goal.progress, goal.targetMastery);
                return (
                  <div
                    key={goal.id}
                    className={`bg-white/5 backdrop-blur-xl border p-5 rounded-xl transition-all ${
                      goal.status === "completed"
                        ? "border-green-400/30 bg-green-500/10"
                        : "border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-semibold text-lg">
                            {goal.title}
                          </h3>
                          {goal.status === "completed" && (
                            <span className="text-green-400">✓</span>
                          )}
                        </div>
                        <p className="text-slate-400 text-sm">
                          {goal.topic} • Target: {goal.targetMastery}% mastery
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-teal-400">
                          {progressPercent}%
                        </p>
                        <p className="text-xs text-slate-400">
                          {goal.progress}/{goal.targetMastery}
                        </p>
                      </div>
                    </div>

                    {/* Goal Progress Bar */}
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                      <div
                        className={`bg-gradient-to-r ${
                          goal.status === "completed"
                            ? "from-green-400 to-emerald-400"
                            : "from-teal-400 to-blue-400"
                        } h-full rounded-full transition-all`}
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Learning Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 border border-indigo-400/30 p-5 rounded-xl">
              <p className="text-indigo-400 font-bold text-sm mb-3">📝 Top Insight</p>
              <p className="text-white text-sm leading-relaxed">
                You learn best in the {skills.length > 0 ? skills[0].topic : "Science"} domain. Keep practicing to maintain your streak!
              </p>
            </div>

            <div className="bg-gradient-to-br from-violet-500/20 to-violet-600/20 border border-violet-400/30 p-5 rounded-xl">
              <p className="text-violet-400 font-bold text-sm mb-3">⏰ Best Time</p>
              <p className="text-white text-sm leading-relaxed">
                You're most productive {Math.random() > 0.5 ? "in the morning" : "in the evening"}. Schedule important learning sessions then!
              </p>
            </div>

            <div className="bg-gradient-to-br from-fuchsia-500/20 to-fuchsia-600/20 border border-fuchsia-400/30 p-5 rounded-xl">
              <p className="text-fuchsia-400 font-bold text-sm mb-3">🚀 Recommendation</p>
              <p className="text-white text-sm leading-relaxed">
                Focus on reaching 80%+ mastery in {skills.length > 0 ? skills[0].topic : "your current topic"}.
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
            <div className="text-center">
              <p className="text-3xl font-bold text-cyan-400">
                {skills.reduce((sum, s) => sum + s.questionsCorrect, 0)}
              </p>
              <p className="text-slate-400 text-sm">Questions Correct</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-400">
                {skills.reduce((sum, s) => sum + s.totalQuestions, 0)}
              </p>
              <p className="text-slate-400 text-sm">Total Questions</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-400">
                {skills.length}
              </p>
              <p className="text-slate-400 text-sm">Tracked Skills</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-pink-400">
                {goals.filter((g) => g.status === "completed").length}/{goals.length}
              </p>
              <p className="text-slate-400 text-sm">Goals Completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
