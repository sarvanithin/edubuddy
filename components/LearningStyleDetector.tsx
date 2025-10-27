"use client";

import { useState, useEffect } from "react";

type LearningStyle = "visual" | "auditory" | "reading" | "kinesthetic" | "unknown";

interface LearningStyleScore {
  visual: number;
  auditory: number;
  reading: number;
  kinesthetic: number;
}

interface LearningStyleQuestion {
  id: string;
  question: string;
  answers: {
    text: string;
    style: keyof LearningStyleScore;
  }[];
}

const questions: LearningStyleQuestion[] = [
  {
    id: "1",
    question: "When learning something new, you prefer to:",
    answers: [
      { text: "See diagrams and charts", style: "visual" },
      { text: "Listen to explanations", style: "auditory" },
      { text: "Read detailed notes", style: "reading" },
      { text: "Try it out yourself", style: "kinesthetic" },
    ],
  },
  {
    id: "2",
    question: "You remember things best by:",
    answers: [
      { text: "Visual memory (pictures)", style: "visual" },
      { text: "Hearing it again", style: "auditory" },
      { text: "Writing it down", style: "reading" },
      { text: "Doing it repeatedly", style: "kinesthetic" },
    ],
  },
  {
    id: "3",
    question: "When giving directions, you tend to:",
    answers: [
      { text: "Draw a map", style: "visual" },
      { text: "Explain it verbally", style: "auditory" },
      { text: "Write step-by-step instructions", style: "reading" },
      { text: "Point and show the way", style: "kinesthetic" },
    ],
  },
  {
    id: "4",
    question: "During a presentation, you pay attention to:",
    answers: [
      { text: "Slides and visuals", style: "visual" },
      { text: "The speaker's words", style: "auditory" },
      { text: "Handouts and notes", style: "reading" },
      { text: "Live demonstrations", style: "kinesthetic" },
    ],
  },
  {
    id: "5",
    question: "When learning math, you prefer:",
    answers: [
      { text: "Visualizing the problem", style: "visual" },
      { text: "Hearing the explanation", style: "auditory" },
      { text: "Reading textbooks", style: "reading" },
      { text: "Working through problems", style: "kinesthetic" },
    ],
  },
];

const styleDescriptions = {
  visual:
    "You're a visual learner! You understand best through images, diagrams, charts, and color-coded information. We'll use more visual examples and structure.",
  auditory:
    "You're an auditory learner! You learn best by listening and discussing. We'll explain concepts verbally with clear, descriptive language.",
  reading:
    "You're a reading/writing learner! You prefer written information and detailed notes. We'll provide comprehensive text explanations.",
  kinesthetic:
    "You're a kinesthetic learner! You learn best by doing and practicing. We'll focus on hands-on examples and problem-solving.",
  unknown:
    "Let's discover your learning style! Each person learns differently. We'll adapt based on your feedback.",
};

export default function LearningStyleDetector() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<LearningStyleScore>({
    visual: 0,
    auditory: 0,
    reading: 0,
    kinesthetic: 0,
  });
  const [showResults, setShowResults] = useState(false);
  const [savedStyle, setSavedStyle] = useState<LearningStyle>("unknown");
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    // Check if user has already completed the assessment
    const saved = localStorage.getItem("edubuddy_learning_style");
    if (saved) {
      setSavedStyle(saved as LearningStyle);
    }
  }, []);

  const handleAnswer = (style: keyof LearningStyleScore) => {
    setScores((prev) => ({
      ...prev,
      [style]: prev[style] + 1,
    }));

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      determineLearningStyle();
    }
  };

  const determineLearningStyle = () => {
    const newScores = {
      ...scores,
      [questions[currentQuestion].answers[0].style]: scores[questions[currentQuestion].answers[0].style] + 1,
    };

    const maxScore = Math.max(
      newScores.visual,
      newScores.auditory,
      newScores.reading,
      newScores.kinesthetic
    );

    let style: LearningStyle = "unknown";
    if (newScores.visual === maxScore) style = "visual";
    else if (newScores.auditory === maxScore) style = "auditory";
    else if (newScores.reading === maxScore) style = "reading";
    else if (newScores.kinesthetic === maxScore) style = "kinesthetic";

    setSavedStyle(style);
    localStorage.setItem("edubuddy_learning_style", style);
  };

  const getDominantStyle = (): LearningStyle => {
    const maxScore = Math.max(scores.visual, scores.auditory, scores.reading, scores.kinesthetic);
    if (scores.visual === maxScore) return "visual";
    if (scores.auditory === maxScore) return "auditory";
    if (scores.reading === maxScore) return "reading";
    if (scores.kinesthetic === maxScore) return "kinesthetic";
    return "unknown";
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setScores({ visual: 0, auditory: 0, reading: 0, kinesthetic: 0 });
    setShowResults(false);
    setAnswered(false);
  };

  if (savedStyle !== "unknown" && !isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 left-6 w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-500 text-white rounded-full flex items-center justify-center text-2xl hover:shadow-2xl transition-all hover:scale-110 z-40 group"
        title={`Learning Style: ${savedStyle}`}
      >
        <span className="group-hover:scale-125 transition-transform">🧠</span>
      </button>
    );
  }

  if (!isOpen && savedStyle === "unknown") {
    return null; // Hide if not opened and style unknown
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-slate-900/95 to-black/95 backdrop-blur-2xl border border-white/10 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 text-white text-2xl hover:bg-white/10 p-2 rounded-lg z-50"
        >
          ✕
        </button>

        <div className="p-8 space-y-6">
          {!showResults ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">🧠</div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent mb-2">
                  Discover Your Learning Style
                </h1>
                <p className="text-slate-400">
                  Quick assessment to personalize your learning experience
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all"
                  style={{
                    width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                  }}
                ></div>
              </div>

              {/* Question Counter */}
              <p className="text-center text-slate-400 text-sm">
                Question {currentQuestion + 1} of {questions.length}
              </p>

              {/* Question */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
                <h2 className="text-xl font-semibold text-white mb-6">
                  {questions[currentQuestion].question}
                </h2>

                {/* Answers */}
                <div className="space-y-3">
                  {questions[currentQuestion].answers.map((answer, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        handleAnswer(answer.style);
                        setAnswered(true);
                      }}
                      className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-indigo-400/50 text-white rounded-xl text-left font-medium transition-all transform hover:scale-102 active:scale-95"
                    >
                      <span className="inline-block w-6 h-6 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full text-white text-xs flex items-center justify-center mr-3 font-bold">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {answer.text}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Results */}
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4">
                  {getDominantStyle() === "visual"
                    ? "🎨"
                    : getDominantStyle() === "auditory"
                    ? "🎵"
                    : getDominantStyle() === "reading"
                    ? "📖"
                    : "✋"}
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent mb-4">
                  {getDominantStyle().charAt(0).toUpperCase() +
                    getDominantStyle().slice(1)}{" "}
                  Learner
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed">
                  {styleDescriptions[getDominantStyle()]}
                </p>
              </div>

              {/* Style Breakdown */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl space-y-4">
                <h3 className="text-white font-semibold mb-4">Your Style Scores:</h3>

                {Object.entries(scores).map(([style, score]) => {
                  const maxScore = Math.max(
                    scores.visual,
                    scores.auditory,
                    scores.reading,
                    scores.kinesthetic
                  );
                  const percentage = (score / maxScore) * 100;
                  const styleIcons = {
                    visual: "🎨",
                    auditory: "🎵",
                    reading: "📖",
                    kinesthetic: "✋",
                  };
                  const styleColors = {
                    visual: "from-blue-500 to-cyan-500",
                    auditory: "from-purple-500 to-pink-500",
                    reading: "from-green-500 to-emerald-500",
                    kinesthetic: "from-orange-500 to-red-500",
                  };

                  return (
                    <div key={style}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-300 font-medium">
                          {styleIcons[style as keyof typeof styleIcons]}{" "}
                          {style.charAt(0).toUpperCase() + style.slice(1)}
                        </span>
                        <span className="text-slate-400">{score} points</span>
                      </div>
                      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                        <div
                          className={`bg-gradient-to-r ${
                            styleColors[style as keyof typeof styleColors]
                          } h-full rounded-full transition-all`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tips Section */}
              <div className="bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-400/30 p-6 rounded-2xl space-y-3">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  💡 Personalization Tips
                </h3>
                {getDominantStyle() === "visual" && (
                  <>
                    <p className="text-slate-300 text-sm">
                      ✓ Look for responses with diagrams and visual examples
                    </p>
                    <p className="text-slate-300 text-sm">
                      ✓ Take screenshots of important concepts
                    </p>
                    <p className="text-slate-300 text-sm">
                      ✓ Create mind maps and visual summaries
                    </p>
                  </>
                )}
                {getDominantStyle() === "auditory" && (
                  <>
                    <p className="text-slate-300 text-sm">
                      ✓ Read explanations aloud to yourself
                    </p>
                    <p className="text-slate-300 text-sm">
                      ✓ Discuss concepts with others
                    </p>
                    <p className="text-slate-300 text-sm">
                      ✓ Record yourself explaining topics
                    </p>
                  </>
                )}
                {getDominantStyle() === "reading" && (
                  <>
                    <p className="text-slate-300 text-sm">
                      ✓ Take detailed written notes
                    </p>
                    <p className="text-slate-300 text-sm">
                      ✓ Create outlines and summaries
                    </p>
                    <p className="text-slate-300 text-sm">
                      ✓ Review written materials frequently
                    </p>
                  </>
                )}
                {getDominantStyle() === "kinesthetic" && (
                  <>
                    <p className="text-slate-300 text-sm">
                      ✓ Solve practice problems actively
                    </p>
                    <p className="text-slate-300 text-sm">
                      ✓ Try real-world applications
                    </p>
                    <p className="text-slate-300 text-sm">
                      ✓ Use hands-on experiments and simulations
                    </p>
                  </>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={resetAssessment}
                  className="flex-1 px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
                >
                  Retake Assessment
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl font-semibold hover:shadow-2xl transition-all"
                >
                  Got It!
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
