"use client";

import { useState, useRef, useEffect } from "react";
import UserProfile from "./UserProfile";
import QuizMode from "./QuizMode";
import Dashboard from "./Dashboard";
import LearningStyleDetector from "./LearningStyleDetector";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  topics: string[];
}

interface LearningTopic {
  name: string;
  count: number;
  lastLearned: Date;
}

export default function ChatInterface() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("General");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [learningTopics, setLearningTopics] = useState<LearningTopic[]>([]);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizTopic, setQuizTopic] = useState("General");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("edubuddy_conversations");
    if (saved) {
      const parsed = JSON.parse(saved).map((conv: any) => ({
        ...conv,
        createdAt: new Date(conv.createdAt),
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      }));
      setConversations(parsed);
      if (parsed.length > 0) {
        setCurrentConversation(parsed[0]);
      }
    } else {
      createNewConversation();
    }
  }, []);

  // Load learning topics from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("edubuddy_topics");
    if (saved) {
      const parsed = JSON.parse(saved).map((topic: any) => ({
        ...topic,
        lastLearned: new Date(topic.lastLearned),
      }));
      setLearningTopics(parsed);
    }
  }, []);

  // Save conversations to localStorage
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem("edubuddy_conversations", JSON.stringify(conversations));
    }
  }, [conversations]);

  // Save learning topics to localStorage
  useEffect(() => {
    if (learningTopics.length > 0) {
      localStorage.setItem("edubuddy_topics", JSON.stringify(learningTopics));
    }
  }, [learningTopics]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);

  const createNewConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: `Chat ${new Date().toLocaleDateString()}`,
      messages: [],
      createdAt: new Date(),
      topics: [],
    };
    setConversations((prev) => [newConv, ...prev]);
    setCurrentConversation(newConv);
  };

  const extractTopics = (message: string): string[] => {
    const topics: string[] = [];
    const keywords = {
      "Photosynthesis": ["photosynthesis", "plant", "sunlight"],
      "Algebra": ["2x + 5", "solve", "equation", "math"],
      "History": ["french", "revolution", "history"],
      "Python": ["python", "loop", "programming"],
    };

    for (const [topic, keywords_array] of Object.entries(keywords)) {
      if (keywords_array.some((k) => message.toLowerCase().includes(k))) {
        topics.push(topic);
      }
    }

    return topics;
  };

  const updateLearningTopics = (topics: string[]) => {
    setLearningTopics((prev) => {
      const updated = [...prev];
      topics.forEach((topic) => {
        const existing = updated.find((t) => t.name === topic);
        if (existing) {
          existing.count += 1;
          existing.lastLearned = new Date();
        } else {
          updated.push({ name: topic, count: 1, lastLearned: new Date() });
        }
      });
      return updated.sort((a, b) => b.count - a.count);
    });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentConversation) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    const topics = extractTopics(input);
    updateLearningTopics(topics);

    setCurrentConversation((prev) => {
      if (!prev) return prev;
      return { ...prev, messages: [...prev.messages, userMessage], topics: [...new Set([...prev.topics, ...topics])] };
    });

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === currentConversation.id
          ? {
              ...conv,
              messages: [...conv.messages, userMessage],
              topics: [...new Set([...conv.topics, ...topics])],
            }
          : conv
      )
    );

    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...currentConversation.messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setCurrentConversation((prev) => {
        if (!prev) return prev;
        return { ...prev, messages: [...prev.messages, assistantMessage] };
      });

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === currentConversation.id
            ? { ...conv, messages: [...conv.messages, assistantMessage] }
            : conv
        )
      );
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: "Sorry, something went wrong. Please try again.",
        timestamp: new Date(),
      };
      setCurrentConversation((prev) => {
        if (!prev) return prev;
        return { ...prev, messages: [...prev.messages, errorMessage] };
      });
    } finally {
      setLoading(false);
    }
  };

  const subjects = [
    { name: "General", icon: "💬", color: "from-purple-400 to-pink-400" },
    { name: "Math", icon: "📐", color: "from-orange-400 to-red-400" },
    { name: "Science", icon: "🔬", color: "from-green-400 to-emerald-400" },
    { name: "History", icon: "📚", color: "from-amber-400 to-yellow-400" },
    { name: "Literature", icon: "📖", color: "from-rose-400 to-pink-400" },
    { name: "Programming", icon: "💻", color: "from-blue-400 to-cyan-400" },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black overflow-hidden">
      {/* SIDEBAR */}
      <div
        className={`${
          sidebarOpen ? "w-80" : "w-0"
        } bg-gradient-to-b from-slate-900/95 to-black/95 backdrop-blur-2xl border-r border-white/10 overflow-hidden transition-all duration-300 flex flex-col shadow-2xl`}
      >
        {/* New Chat Button */}
        <div className="p-4 border-b border-white/10">
          <button
            onClick={createNewConversation}
            className="w-full px-5 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            ✨ New Chat
          </button>
        </div>

        {/* Learning Dashboard */}
        <div className="p-4 border-b border-white/10">
          <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-bold text-sm mb-4">📊 Your Learning Progress</h3>
          {learningTopics.length > 0 ? (
            <div className="space-y-3">
              {learningTopics.slice(0, 5).map((topic) => (
                <div key={topic.name} className="bg-white/5 backdrop-blur-xl p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-200 text-sm font-semibold">{topic.name}</span>
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {topic.count}x
                    </span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden backdrop-blur-sm">
                    <div
                      className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-full rounded-full shadow-lg shadow-purple-500/50"
                      style={{ width: `${Math.min(topic.count * 20, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-xl p-4 rounded-xl border border-white/10 text-center">
              <p className="text-slate-400 text-sm">Start learning to build your knowledge! 🚀</p>
            </div>
          )}
        </div>

        {/* Conversation History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-bold text-sm mb-3">💬 Chat History</h3>
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setCurrentConversation(conv)}
              className={`w-full text-left p-3 rounded-xl transition-all duration-200 backdrop-blur-xl border ${
                currentConversation?.id === conv.id
                  ? "bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-blue-400/50 shadow-lg shadow-blue-500/20"
                  : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
              }`}
            >
              <p className="text-slate-200 text-sm font-semibold truncate">{conv.title}</p>
              <p className="text-slate-500 text-xs mt-1">{conv.messages.length} messages</p>
              {conv.topics.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {conv.topics.slice(0, 2).map((topic) => (
                    <span
                      key={topic}
                      className="bg-white/10 text-blue-300 text-xs px-2 py-1 rounded-full border border-white/10"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CHAT */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-slate-900/50 via-slate-900/30 to-transparent backdrop-blur-2xl border-b border-white/10 px-8 py-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-3 hover:bg-white/10 rounded-lg transition-all duration-200 text-white"
              >
                {sidebarOpen ? "◀" : "▶"}
              </button>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  🎓 EduBuddy
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  {currentConversation?.topics.join(" • ") || "Ready to learn something new! 🚀"}
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              {currentConversation && currentConversation.messages.length > 0 && (
                <button
                  onClick={() => {
                    setQuizTopic(currentConversation.topics.length > 0 ? currentConversation.topics[0] : "General");
                    setIsQuizOpen(true);
                  }}
                  className="px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  🎯 Take Quiz
                </button>
              )}
              <div className="bg-white/5 backdrop-blur-xl p-4 rounded-xl border border-white/10">
                <p className="text-slate-200 text-sm font-semibold">{learningTopics.length} Topics</p>
                <p className="text-slate-400 text-xs mt-1">{currentConversation?.messages.length || 0} messages</p>
              </div>
            </div>
          </div>
        </div>

        {/* SUBJECT SELECTOR */}
        <div className="bg-gradient-to-b from-slate-900/30 to-transparent backdrop-blur-xl border-b border-white/10 px-8 py-6">
          <label className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-bold text-sm mb-4 block">
            📌 Choose Your Subject
          </label>
          <div className="grid grid-cols-6 gap-3">
            {subjects.map((subj) => (
              <button
                key={subj.name}
                onClick={() => setSubject(subj.name)}
                className={`group relative px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform ${
                  subject === subj.name
                    ? `bg-gradient-to-br ${subj.color} text-white shadow-2xl scale-105 border border-white/20`
                    : "bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                <span className="text-lg">{subj.icon}</span>
                <p className="text-xs mt-1">{subj.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* MESSAGES AREA */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {currentConversation && currentConversation.messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-3xl">
                <div className="text-9xl mb-8 animate-bounce">🤖</div>
                <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                  Begin Your Learning Adventure
                </h2>
                <p className="text-2xl text-slate-300 mb-12">
                  Ask me anything about{" "}
                  <span className="font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {subject}
                  </span>
                </p>
                <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {[
                    { emoji: "📚", text: "Explain photosynthesis" },
                    { emoji: "📐", text: "Solve 2x + 5 = 15" },
                    { emoji: "📖", text: "French Revolution" },
                    { emoji: "💻", text: "Python loops" },
                  ].map((q, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(q.text)}
                      className="group bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 border border-white/20 p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 backdrop-blur-xl"
                    >
                      <p className="text-3xl mb-3">{q.emoji}</p>
                      <p className="text-slate-200 font-semibold group-hover:text-white transition-colors">
                        {q.text}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {currentConversation?.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
                >
                  <div
                    className={`max-w-2xl px-6 py-4 rounded-2xl backdrop-blur-xl transition-all ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-blue-500/40 to-purple-500/40 text-white border border-blue-400/50 shadow-lg shadow-blue-500/20 rounded-br-none"
                        : "bg-white/10 text-slate-100 border border-white/20 rounded-bl-none shadow-lg"
                    }`}
                  >
                    <p className="text-base whitespace-pre-wrap break-words leading-relaxed">
                      {message.content}
                    </p>
                    <p
                      className={`text-xs mt-3 font-medium ${
                        message.role === "user" ? "text-blue-100/70" : "text-slate-500"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start animate-fadeIn">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 text-slate-100 px-6 py-4 rounded-2xl shadow-lg rounded-bl-none">
                    <div className="flex gap-3 items-center">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.15s" }}
                      ></div>
                      <div
                        className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.3s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* INPUT AREA */}
        <div className="bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent backdrop-blur-2xl border-t border-white/10 px-8 py-6">
          <form onSubmit={handleSendMessage} className="flex gap-4 items-end">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask me about ${subject}...`}
                disabled={loading || !currentConversation}
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-white placeholder-slate-500 disabled:opacity-50 transition-all hover:bg-white/15 focus:bg-white/20"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !input.trim() || !currentConversation}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-2xl font-bold hover:shadow-2xl hover:shadow-purple-500/50 disabled:opacity-50 transition-all duration-300 transform hover:scale-110 active:scale-95"
            >
              {loading ? "⏳" : "✉️ Send"}
            </button>
          </form>
        </div>
      </div>

      {/* User Profile Panel */}
      <UserProfile />

      {/* Dashboard Analytics */}
      <Dashboard />

      {/* Learning Style Detector */}
      <LearningStyleDetector />

      {/* Quiz Mode */}
      {isQuizOpen && (
        <QuizMode
          topic={quizTopic}
          difficulty="medium"
          onClose={() => setIsQuizOpen(false)}
        />
      )}
    </div>
  );
}
