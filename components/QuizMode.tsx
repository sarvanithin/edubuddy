"use client";

import { useState, useEffect } from "react";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: "easy" | "medium" | "hard";
}

interface QuizProps {
  topic: string;
  difficulty?: "easy" | "medium" | "hard";
  onClose: () => void;
}

export default function QuizMode({ topic, difficulty = "medium", onClose }: QuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate quiz questions based on topic
    generateQuiz();
  }, [topic]);

  const generateQuiz = () => {
    setLoading(true);

    // Pre-built quiz questions database
    const quizDatabase: { [key: string]: QuizQuestion[] } = {
      photosynthesis: [
        {
          id: "1",
          question: "What is the primary function of photosynthesis?",
          options: [
            "To break down glucose",
            "To convert light energy into chemical energy",
            "To produce CO2",
            "To decrease oxygen in atmosphere",
          ],
          correctAnswer: 1,
          difficulty: "easy",
        },
        {
          id: "2",
          question: "Which organelle is responsible for photosynthesis?",
          options: ["Mitochondria", "Chloroplast", "Nucleus", "Ribosome"],
          correctAnswer: 1,
          difficulty: "easy",
        },
        {
          id: "3",
          question: "What are the two main stages of photosynthesis?",
          options: [
            "Glycolysis and Krebs cycle",
            "Light reactions and Calvin cycle",
            "Fermentation and oxidation",
            "Glycolysis and Fermentation",
          ],
          correctAnswer: 1,
          difficulty: "medium",
        },
        {
          id: "4",
          question: "In which part of the chloroplast do light reactions occur?",
          options: ["Stroma", "Thylakoid", "Grana", "Outer membrane"],
          correctAnswer: 1,
          difficulty: "medium",
        },
        {
          id: "5",
          question:
            "What is the overall balanced equation for photosynthesis?",
          options: [
            "C6H12O6 + 6O2 → 6CO2 + 6H2O + energy",
            "6CO2 + 6H2O + light → C6H12O6 + 6O2",
            "C6H12O6 → 2C2H5OH + 2CO2",
            "6O2 + glucose → water + CO2",
          ],
          correctAnswer: 1,
          difficulty: "hard",
        },
      ],
      math: [
        {
          id: "1",
          question: "Solve: 2x + 5 = 15",
          options: ["x = 5", "x = 10", "x = 3", "x = 7"],
          correctAnswer: 0,
          difficulty: "easy",
        },
        {
          id: "2",
          question: "What is the slope of y = 3x + 2?",
          options: ["3", "2", "0", "-3"],
          correctAnswer: 0,
          difficulty: "easy",
        },
        {
          id: "3",
          question: "Solve: 3x - 7 = 14",
          options: ["x = 7", "x = 2", "x = 21", "x = 3"],
          correctAnswer: 0,
          difficulty: "medium",
        },
        {
          id: "4",
          question: "What is the x-intercept of y = 2x - 4?",
          options: ["2", "-4", "4", "-2"],
          correctAnswer: 0,
          difficulty: "medium",
        },
        {
          id: "5",
          question: "Solve the system: x + y = 5, 2x - y = 4",
          options: ["x=3, y=2", "x=1, y=4", "x=2, y=3", "x=4, y=1"],
          correctAnswer: 0,
          difficulty: "hard",
        },
      ],
    };

    const topicKey = topic.toLowerCase();
    let topicQuestions = quizDatabase[topicKey] || quizDatabase.photosynthesis;

    // Filter by difficulty
    const filtered = topicQuestions.filter((q) => q.difficulty === difficulty);
    const selected =
      filtered.length > 0 ? filtered : topicQuestions.slice(0, 5);

    setTimeout(() => {
      setQuestions(selected);
      setLoading(false);
    }, 800);
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (optionIndex === questions[currentIndex].correctAnswer) {
      setScore(score + 1);
    }

    if (currentIndex < questions.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 500);
    } else {
      setTimeout(() => setShowResults(true), 500);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-gradient-to-br from-slate-900 to-black p-8 rounded-2xl border border-white/10 backdrop-blur-xl">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white font-semibold">Generating Quiz...</p>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-slate-900 to-black p-8 rounded-2xl border border-white/10 backdrop-blur-xl max-w-md w-full">
          <div className="text-center">
            <div className="text-6xl mb-4">
              {percentage >= 80 ? "🎉" : percentage >= 60 ? "👍" : "💪"}
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Quiz Complete!
            </h2>
            <p className="text-slate-400 mb-6">
              You got {score} out of {questions.length} correct
            </p>

            {/* Score Display */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-xl mb-6">
              <div className="text-5xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                {percentage}%
              </div>
              <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden mt-4">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>

            {/* Feedback */}
            <p className="text-slate-300 mb-6">
              {percentage >= 80
                ? "Outstanding! You've mastered this topic! 🏆"
                : percentage >= 60
                ? "Good job! Keep practicing to master this topic."
                : "Keep learning! You're making progress!"}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setScore(0);
                  setAnswers([]);
                  setShowResults(false);
                  generateQuiz();
                }}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Retry Quiz
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-white/10 text-white p-3 rounded-lg font-semibold hover:bg-white/20 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) return null;

  const current = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 to-black p-8 rounded-2xl border border-white/10 backdrop-blur-xl max-w-2xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Quiz Mode</h2>
          <button
            onClick={onClose}
            className="text-white text-2xl hover:bg-white/10 p-2 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-slate-400 text-sm">
              Question {currentIndex + 1} of {questions.length}
            </p>
            <p className="text-slate-400 text-sm font-semibold">
              Score: {score}
            </p>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-6">
            {current.question}
          </h3>

          {/* Options */}
          <div className="grid grid-cols-1 gap-3">
            {current.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white p-4 rounded-lg text-left font-medium transition-all hover:border-purple-500/50 transform hover:scale-105"
              >
                <span className="inline-block w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white text-xs flex items-center justify-center mr-3">
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Badge */}
        <div className="text-center">
          <span className="inline-block px-4 py-2 bg-white/10 border border-white/20 rounded-full text-xs font-semibold text-slate-300">
            Difficulty: {current.difficulty.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}
