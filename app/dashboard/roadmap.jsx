"use client";
import { useState, useEffect } from "react";

const steps = [
  {
    phase: "01",
    title: "Foundation",
    duration: "0–3 months",
    color: "from-rose-500 to-pink-600",
    glow: "shadow-rose-500/40",
    border: "border-rose-500/40",
    bg: "bg-rose-500/10",
    dot: "bg-rose-400",
    textAccent: "text-rose-400",
    icon: "🌱",
    skills: ["HTML & CSS", "Git Basics", "JavaScript ES6+", "Terminal"],
    status: "completed",
  },
  {
    phase: "02",
    title: "Frontend Dev",
    duration: "3–6 months",
    color: "from-orange-500 to-amber-500",
    glow: "shadow-orange-500/40",
    border: "border-orange-500/40",
    bg: "bg-orange-500/10",
    dot: "bg-orange-400",
    textAccent: "text-orange-400",
    icon: "⚡",
    skills: ["React.js", "Tailwind CSS", "REST APIs", "TypeScript"],
    status: "active",
  },
  {
    phase: "03",
    title: "Backend Basics",
    duration: "6–9 months",
    color: "from-emerald-500 to-teal-500",
    glow: "shadow-emerald-500/40",
    border: "border-emerald-500/40",
    bg: "bg-emerald-500/10",
    dot: "bg-emerald-400",
    textAccent: "text-emerald-400",
    icon: "🛠️",
    skills: ["Node.js", "Express", "PostgreSQL", "Auth & JWT"],
    status: "upcoming",
  },
  {
    phase: "04",
    title: "Full Stack",
    duration: "9–12 months",
    color: "from-sky-500 to-blue-600",
    glow: "shadow-sky-500/40",
    border: "border-sky-500/40",
    bg: "bg-sky-500/10",
    dot: "bg-sky-400",
    textAccent: "text-sky-400",
    icon: "🚀",
    skills: ["Next.js", "Docker", "CI/CD", "Cloud Deploy"],
    status: "upcoming",
  },
  {
    phase: "05",
    title: "System Design",
    duration: "12–18 months",
    color: "from-violet-500 to-purple-600",
    glow: "shadow-violet-500/40",
    border: "border-violet-500/40",
    bg: "bg-violet-500/10",
    dot: "bg-violet-400",
    textAccent: "text-violet-400",
    icon: "🏗️",
    skills: ["Microservices", "Redis", "Kafka", "System Architecture"],
    status: "upcoming",
  },
];
 
const statusLabel = {
  completed: { text: "Completed", cls: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  active:    { text: "In Progress", cls: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  upcoming:  { text: "Upcoming", cls: "bg-white/5 text-white/30 border-white/10" },
};
 
export default function Roadmap() {
  const [hovered, setHovered] = useState(null);
 
  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden font-sans">
 
      {/* ── Colorful background orbs ── */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-600 rounded-full opacity-20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-sky-600 rounded-full opacity-20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-700 rounded-full opacity-20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-600 rounded-full opacity-18 blur-3xl pointer-events-none" />
 
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
 
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
 
        {/* ── Header ── */}
        <div className="mb-14 text-center">
          <h1 className="text-5xl font-black text-white tracking-tight leading-tight">
            Career{" "}
            <span className="bg-gradient-to-r from-rose-400 via-amber-400 to-violet-400 bg-clip-text text-transparent">
              Roadmap
            </span>
          </h1>
          <p className="mt-4 text-white/35 text-sm font-light max-w-md mx-auto">
            Your step-by-step path from beginner to full-stack engineer. Each phase builds on the last.
          </p>
 
          {/* Progress bar */}
          <div className="mt-8 flex items-center gap-3 max-w-xs mx-auto">
            <span className="text-[11px] text-white/30">Progress</span>
            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-500 via-amber-400 to-orange-500"
                style={{ width: "28%" }}
              />
            </div>
            <span className="text-[11px] text-amber-400 font-medium">28%</span>
          </div>
        </div>
 
        {/* ── Timeline ── */}
        <div className="relative">
 
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-rose-500/50 via-sky-500/30 to-violet-500/20" />
 
          <div className="space-y-5">
            {steps.map((s, i) => (
              <div
                key={i}
                className="relative pl-20 cursor-pointer"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Dot on timeline */}
                <div
                  className={`absolute left-5 top-6 w-6 h-6 rounded-full bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg ${s.glow} transition-transform duration-200 ${hovered === i ? "scale-125" : "scale-100"}`}
                >
                  <div className="w-2 h-2 rounded-full bg-white/80" />
                </div>
 
                {/* Connector line pulse for active */}
                {s.status === "active" && (
                  <div className="absolute left-5 top-6 w-6 h-6 rounded-full bg-amber-400 opacity-30 animate-ping" />
                )}
 
                {/* Card */}
                <div
                  className={`rounded-2xl border p-5 transition-all duration-300 ${
                    hovered === i
                      ? `${s.border} ${s.bg} shadow-xl ${s.glow}`
                      : "border-white/7 bg-white/3 shadow-none"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{s.icon}</span>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[10px] font-bold tracking-widest ${s.textAccent}`}>
                            PHASE {s.phase}
                          </span>
                        </div>
                        <h3 className="text-white font-bold text-lg leading-tight">{s.title}</h3>
                        <p className="text-white/30 text-[11px] mt-0.5">{s.duration}</p>
                      </div>
                    </div>
 
                    {/* Status badge */}
                    <span className={`shrink-0 text-[10px] px-2.5 py-1 rounded-full border font-medium tracking-wide ${statusLabel[s.status].cls}`}>
                      {statusLabel[s.status].text}
                    </span>
                  </div>
 
                  {/* Skills */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {s.skills.map((sk, j) => (
                      <span
                        key={j}
                        className={`text-[11px] px-3 py-1 rounded-full font-medium transition-all duration-200
                          ${hovered === i
                            ? `bg-gradient-to-r ${s.color} text-white shadow-sm`
                            : "bg-white/5 text-white/40 border border-white/8"
                          }`}
                        style={{ transitionDelay: `${j * 30}ms` }}
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
 
        {/* ── Bottom CTA ── */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/3 backdrop-blur-sm p-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-white font-semibold text-sm">Ready for Phase 02?</p>
            <p className="text-white/30 text-[11px] mt-0.5">Continue your Frontend Dev journey</p>
          </div>
          <button className="shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-900 bg-gradient-to-r from-orange-400 to-amber-400 hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150">
            Continue →
          </button>
        </div>
 
      </div>
    </div>
  );
}