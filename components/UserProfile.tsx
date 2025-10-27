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

export default function UserProfile() {
  const [userProfile, setUserProfile] = useState({
    name: "Student",
    joinedDate: new Date(),
    totalLearningMinutes: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalTopicsLearned: 0,
    averageMastery: 0,
  });

  const [skills, setSkills] = useState<SkillMetric[]>([]);
  const [isOpen, setIsOpen] = useState(false);

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
  }, []);

  useEffect(() => {
    // Save user profile
    localStorage.setItem("edubuddy_user_profile", JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    // Save skills
    if (skills.length > 0) {
      localStorage.setItem("edubuddy_skills", JSON.stringify(skills));
    }
  }, [skills]);

  // Calculate average mastery
  useEffect(() => {
    if (skills.length > 0) {
      const avgMastery = Math.round(
        skills.reduce((sum, skill) => sum + skill.masteryLevel, 0) / skills.length
      );
      setUserProfile((prev) => ({
        ...prev,
        averageMastery: avgMastery,
        totalTopicsLearned: skills.length,
      }));
    }
  }, [skills]);

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

  return (
    <>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-2xl hover:shadow-2xl transition-all hover:scale-110 z-40"
      >
        👤
      </button>

      {/* Profile Panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
          <div className="w-full bg-gradient-to-b from-slate-900/95 to-black/95 backdrop-blur-2xl border-t border-white/10 max-h-[90vh] overflow-y-auto rounded-t-3xl shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-white text-2xl hover:bg-white/10 p-2 rounded-lg"
            >
              ✕
            </button>

            <div className="p-8 space-y-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🎓</div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  Learning Profile
                </h1>
                <p className="text-slate-400">Track your progress and mastery</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-xl">
                  <p className="text-slate-400 text-sm mb-2">Average Mastery</p>
                  <p className="text-3xl font-bold text-blue-400">
                    {userProfile.averageMastery}%
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-xl">
                  <p className="text-slate-400 text-sm mb-2">Topics Learned</p>
                  <p className="text-3xl font-bold text-purple-400">
                    {userProfile.totalTopicsLearned}
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-xl">
                  <p className="text-slate-400 text-sm mb-2">Current Streak</p>
                  <p className="text-3xl font-bold text-pink-400">
                    {userProfile.currentStreak}
                    <span className="text-lg">🔥</span>
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-xl">
                  <p className="text-slate-400 text-sm mb-2">Learning Time</p>
                  <p className="text-3xl font-bold text-cyan-400">
                    {Math.round(userProfile.totalLearningMinutes / 60)}h
                  </p>
                </div>
              </div>

              {/* Skills Mastery */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  📊 Skill Mastery
                </h2>

                {skills.length > 0 ? (
                  <div className="space-y-4">
                    {skills.map((skill) => (
                      <div
                        key={skill.topic}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-xl hover:bg-white/10 transition-all"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-white font-semibold text-lg">
                              {skill.topic}
                            </h3>
                            <p className="text-slate-400 text-sm">
                              {skill.questionsCorrect}/{skill.totalQuestions} correct • 🔥
                              {skill.streakDays} day streak
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                              {skill.masteryLevel}%
                            </p>
                            <p className="text-xs text-slate-400">
                              {getMasteryText(skill.masteryLevel)}
                            </p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                          <div
                            className={`bg-gradient-to-r ${getMasteryColor(
                              skill.masteryLevel
                            )} h-full rounded-full shadow-lg transition-all`}
                            style={{ width: `${skill.masteryLevel}%` }}
                          ></div>
                        </div>

                        <p className="text-xs text-slate-500 mt-2">
                          ⏱️ {Math.round(skill.timeSpent / 60)}h spent
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-xl text-center">
                    <p className="text-slate-400">
                      Start learning to build your skills! 🚀
                    </p>
                  </div>
                )}
              </div>

              {/* Achievements */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  🏆 Achievements
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-yellow-400/10 to-amber-400/10 border border-yellow-400/30 p-4 rounded-xl text-center">
                    <p className="text-3xl mb-2">⭐</p>
                    <p className="text-white font-semibold text-sm">First Steps</p>
                    <p className="text-slate-400 text-xs">1 topic learned</p>
                  </div>

                  {userProfile.totalTopicsLearned >= 5 && (
                    <div className="bg-gradient-to-br from-blue-400/10 to-cyan-400/10 border border-blue-400/30 p-4 rounded-xl text-center">
                      <p className="text-3xl mb-2">🎯</p>
                      <p className="text-white font-semibold text-sm">
                        Knowledge Seeker
                      </p>
                      <p className="text-slate-400 text-xs">5 topics learned</p>
                    </div>
                  )}

                  {userProfile.currentStreak >= 3 && (
                    <div className="bg-gradient-to-br from-red-400/10 to-pink-400/10 border border-red-400/30 p-4 rounded-xl text-center">
                      <p className="text-3xl mb-2">🔥</p>
                      <p className="text-white font-semibold text-sm">
                        On Fire
                      </p>
                      <p className="text-slate-400 text-xs">3 day streak</p>
                    </div>
                  )}

                  {userProfile.averageMastery >= 80 && (
                    <div className="bg-gradient-to-br from-green-400/10 to-emerald-400/10 border border-green-400/30 p-4 rounded-xl text-center">
                      <p className="text-3xl mb-2">👑</p>
                      <p className="text-white font-semibold text-sm">Master</p>
                      <p className="text-slate-400 text-xs">
                        80%+ mastery
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-3 gap-3">
                <button className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all transform hover:scale-105">
                  📈 Analytics
                </button>
                <button className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105">
                  🎯 Goals
                </button>
                <button className="bg-gradient-to-br from-orange-500 to-red-500 text-white p-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all transform hover:scale-105">
                  ⚙️ Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
