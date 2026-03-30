"use client";
import { useState, useEffect } from "react";



const stats = [
  { value: "42", label: "Repositories", icon: "📁", color: "from-sky-500 to-blue-600", text: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20" },
  { value: "1.2k", label: "Total Stars", icon: "⭐", color: "from-amber-400 to-yellow-500", text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  { value: "87%", label: "Code Quality", icon: "✅", color: "from-emerald-500 to-teal-500", text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { value: "340", label: "Contributions", icon: "🔥", color: "from-rose-500 to-pink-500", text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
];

const qualityMetrics = [
  { name: "Code Readability", score: 78, color: "from-sky-400 to-blue-500" },
  { name: "Documentation", score: 52, color: "from-violet-400 to-purple-500" },
  { name: "Test Coverage", score: 41, color: "from-emerald-400 to-teal-500" },
  { name: "Performance", score: 85, color: "from-amber-400 to-orange-500" },
  { name: "Security", score: 67, color: "from-rose-400 to-pink-500" },
  { name: "Maintainability", score: 73, color: "from-cyan-400 to-sky-500" },
];

const languages = [
  { name: "TypeScript", score: 68, color: "from-blue-400 to-blue-600", dot: "bg-blue-400" },
  { name: "JavaScript", score: 55, color: "from-yellow-400 to-amber-500", dot: "bg-yellow-400" },
  { name: "Python", score: 42, color: "from-green-400 to-emerald-500", dot: "bg-green-400" },
  { name: "CSS", score: 30, color: "from-pink-400 to-rose-500", dot: "bg-pink-400" },
  { name: "Go", score: 18, color: "from-cyan-400 to-teal-500", dot: "bg-cyan-400" },
  { name: "Rust", score: 10, color: "from-orange-400 to-red-500", dot: "bg-orange-400" },
];

const projects = [
  { name: "react-dashboard", lang: "TypeScript", stars: 124, color: "from-sky-500 to-blue-600", icon: "⚡" },
  { name: "ml-pipeline", lang: "Python", stars: 89, color: "from-emerald-500 to-teal-600", icon: "🧠" },
  { name: "auth-service", lang: "Go", stars: 56, color: "from-cyan-500 to-sky-600", icon: "🔐" },
  { name: "ui-components", lang: "JavaScript", stars: 210, color: "from-amber-500 to-orange-500", icon: "🎨" },
];

export default function Portfolio() {
  const [hoveredProject, setHoveredProject] = useState(null);

  return (
    <div className="min-h-screen bg-[#0b0d12] relative overflow-hidden px-4 py-14">

      {/* Background orbs */}
      <div className="absolute -top-28 -left-20 w-[380px] h-[380px] rounded-full bg-sky-700 opacity-[0.09] blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-[320px] h-[320px] rounded-full bg-violet-700 opacity-[0.09] blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-1/3 w-[300px] h-[300px] rounded-full bg-emerald-700 opacity-[0.08] blur-3xl pointer-events-none" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] tracking-widest uppercase text-white/30 font-medium mb-4">
            🖼️ GitHub Connected
          </span>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Portfolio{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-violet-400">
              Analyzer
            </span>
          </h1>
          <p className="mt-2 text-[13px] text-white/30 font-light">
            Deep analysis of your GitHub profile, code quality, and project impact.
          </p>
        </div>

        {/* ── Stats grid ── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-5">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`rounded-2xl border ${s.border} ${s.bg} p-4 flex flex-col gap-1 transition-all duration-200 hover:-translate-y-0.5`}
            >
              <span className="text-xl">{s.icon}</span>
              <p className={`text-2xl font-black ${s.text} leading-none mt-1`}>{s.value}</p>
              <p className="text-[11px] text-white/30 font-light">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Two panels ── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">

          {/* Quality Metrics */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-sky-400" />
              <p className="text-[11px] text-white/40 uppercase tracking-widest font-semibold">
                Quality Metrics
              </p>
            </div>
            <div className="space-y-4">
              {qualityMetrics.map((m, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[12px] text-white/60 font-medium">{m.name}</span>
                    <span className={`text-[11px] font-semibold ${m.score >= 70 ? "text-emerald-400" : m.score >= 50 ? "text-amber-400" : "text-rose-400"}`}>
                      {m.score}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${m.color} transition-all duration-700`}
                      style={{ width: `${m.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-white/15 mt-5 pt-3 border-t border-white/5">
              Based on static analysis
            </p>
          </div>

          {/* Top Languages */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-violet-400" />
              <p className="text-[11px] text-white/40 uppercase tracking-widest font-semibold">
                Top Languages
              </p>
            </div>
            <div className="space-y-4">
              {languages.map((l, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${l.dot}`} />
                      <span className="text-[12px] text-white/60 font-medium">{l.name}</span>
                    </div>
                    <span className="text-[11px] text-white/30">{l.score}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${l.color}`}
                      style={{ width: `${l.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-white/15 mt-5 pt-3 border-t border-white/5">
              Across all repositories
            </p>
          </div>
        </div>

        {/* ── Top Projects ── */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 mb-4">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <p className="text-[11px] text-white/40 uppercase tracking-widest font-semibold">
              Top Projects
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {projects.map((p, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredProject(i)}
                onMouseLeave={() => setHoveredProject(null)}
                className={`rounded-xl border p-4 transition-all duration-200 cursor-pointer
                  ${hoveredProject === i
                    ? "border-white/15 bg-white/5 -translate-y-0.5"
                    : "border-white/6 bg-white/[0.015]"
                  }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-lg">{p.icon}</span>
                  <div className="flex items-center gap-1 text-[10px] text-amber-400/70">
                    ⭐ {p.stars}
                  </div>
                </div>
                <p className="text-white text-[12px] font-semibold mb-1 truncate">{p.name}</p>
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${p.color}`} />
                  <span className="text-[11px] text-white/30">{p.lang}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <button className="w-full py-3.5 rounded-xl font-semibold text-[13px] text-white bg-gradient-to-r from-sky-500 to-violet-500 hover:shadow-xl hover:shadow-sky-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 tracking-wide">
          ✦ Run Full Portfolio Analysis
        </button>

      </div>
    </div>
  );
}