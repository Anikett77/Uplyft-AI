import React from 'react';

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Resume Analyzer",
    desc: "Get AI-powered ATS score, keyword analysis, format review, and actionable improvement suggestions tailored to your target role.",
    badge: "ATS Score",
    badgeColor: "bg-sky-500/15 text-sky-400 border-sky-500/25",
    border: "hover:border-sky-500/30",
    glow: "hover:shadow-sky-500/10",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Skill Gap Analysis",
    desc: "Compare your current skills against top job requirements. See exactly what you're missing and what to learn next.",
    badge: "Role Match",
    badgeColor: "bg-violet-500/15 text-violet-400 border-violet-500/25",
    border: "hover:border-violet-500/30",
    glow: "hover:shadow-violet-500/10",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    title: "Career Roadmap",
    desc: "Get a personalised step-by-step learning path from your current skills to your dream role, with timeframes and milestones.",
    badge: "Personalised",
    badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    border: "hover:border-emerald-500/30",
    glow: "hover:shadow-emerald-500/10",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    title: "AI Mock Interview",
    desc: "Practice behavioral, technical, and case study interviews with an AI that gives real-time feedback, scores, and model answers.",
    badge: "GPT-4o",
    badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/25",
    border: "hover:border-amber-500/30",
    glow: "hover:shadow-amber-500/10",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: "Learning Tracker",
    desc: "Track your courses, set daily tasks, and monitor skill improvements — with a learning plan auto-generated from your skill gaps.",
    badge: "Daily Streak",
    badgeColor: "bg-orange-500/15 text-orange-400 border-orange-500/25",
    border: "hover:border-orange-500/30",
    glow: "hover:shadow-orange-500/10",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    title: "Portfolio Analyzer",
    desc: "Connect your GitHub and get a deep analysis of your repos, code quality signals, top languages, and contribution activity.",
    badge: "GitHub API",
    badgeColor: "bg-rose-500/15 text-rose-400 border-rose-500/25",
    border: "hover:border-rose-500/30",
    glow: "hover:shadow-rose-500/10",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Instant Feedback",
    desc: "Every answer you give in mock interviews is graded instantly with a score, strengths, improvements, and a model answer.",
    badge: "Real-time",
    badgeColor: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
    border: "hover:border-cyan-500/30",
    glow: "hover:shadow-cyan-500/10",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "ATS Optimisation",
    desc: "Understand exactly which keywords are missing from your resume and get specific suggestions to pass ATS filters confidently.",
    badge: "Keyword AI",
    badgeColor: "bg-indigo-500/15 text-indigo-400 border-indigo-500/25",
    border: "hover:border-indigo-500/30",
    glow: "hover:shadow-indigo-500/10",
  },
];

export default function Features() {
  return (
    <div id="features" className="relative py-24 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-blue-700 opacity-[0.06] blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] tracking-widest uppercase text-blue-400 font-medium mb-4">
            Features
          </span>
          <h2 className="text-4xl font-bold text-white mb-4 font-serif">
            Everything you need for career success
          </h2>
          <p className="text-lg text-gray-400 font-serif max-w-2xl mx-auto">
            Our AI-powered platform provides comprehensive tools to accelerate your career growth
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className={`group relative p-5 border border-white/10 rounded-2xl bg-white/[0.02] backdrop-blur-sm
                transition-all duration-300 hover:bg-white/[0.04] hover:shadow-xl hover:-translate-y-0.5 ${f.border} ${f.glow}`}
            >
              {/* Icon */}
              <div className="w-11 h-11 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-200">
                {f.icon}
              </div>

              {/* Badge */}
              <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full border mb-3 ${f.badgeColor}`}>
                {f.badge}
              </span>

              <h3 className="text-white font-bold text-[15px] mb-2 font-serif">{f.title}</h3>
              <p className="text-gray-400 text-[13px] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}