"use client";
import { useState, useEffect } from "react";

const roles = [
  { name: "AI Engineer", match: 72, icon: "🤖", color: "from-violet-500 to-purple-600", glow: "shadow-violet-500/30", border: "border-violet-500/40", text: "text-violet-400", bg: "bg-violet-500/10" },
  { name: "Full Stack Dev", match: 85, icon: "⚡", color: "from-sky-500 to-blue-600", glow: "shadow-sky-500/30", border: "border-sky-500/40", text: "text-sky-400", bg: "bg-sky-500/10" },
  { name: "Data Scientist", match: 58, icon: "📊", color: "from-emerald-500 to-teal-600", glow: "shadow-emerald-500/30", border: "border-emerald-500/40", text: "text-emerald-400", bg: "bg-emerald-500/10" },
  { name: "DevOps Eng", match: 44, icon: "🛠️", color: "from-orange-500 to-amber-500", glow: "shadow-orange-500/30", border: "border-orange-500/40", text: "text-orange-400", bg: "bg-orange-500/10" },
];

const mySkills = [
  { name: "React.js", score: 82, color: "from-sky-400 to-blue-500" },
  { name: "Python", score: 65, color: "from-yellow-400 to-orange-400" },
  { name: "Node.js", score: 70, color: "from-emerald-400 to-teal-500" },
  { name: "TypeScript", score: 55, color: "from-blue-400 to-indigo-500" },
  { name: "SQL", score: 48, color: "from-pink-400 to-rose-500" },
  { name: "Docker", score: 30, color: "from-cyan-400 to-sky-500" },
];

const gapSkills = [
  { name: "LangChain", score: 10, needed: 80, color: "from-violet-400 to-purple-500" },
  { name: "PyTorch", score: 20, needed: 85, color: "from-orange-400 to-red-500" },
  { name: "MLOps", score: 5, needed: 70, color: "from-pink-400 to-rose-500" },
  { name: "Vector DBs", score: 0, needed: 75, color: "from-teal-400 to-emerald-500" },
  { name: "Fine-tuning", score: 15, needed: 65, color: "from-amber-400 to-yellow-500" },
  { name: "Kubernetes", score: 25, needed: 60, color: "from-sky-400 to-blue-500" },
];

export default function SkillGap() {
  const [selected, setSelected] = useState(0);

  const role = roles[selected];

  return (
    <div className="min-h-screen bg-[#0b0d12] relative overflow-hidden px-4 py-14">

      {/* Background orbs */}
      <div className="absolute -top-32 -right-24 w-[400px] h-[400px] rounded-full bg-violet-700 opacity-[0.10] blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-24 w-[350px] h-[350px] rounded-full bg-sky-700 opacity-[0.08] blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[250px] h-[250px] rounded-full bg-emerald-700 opacity-[0.07] blur-3xl pointer-events-none" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] tracking-widest uppercase text-white/30 font-medium mb-4">
            ✦ AI Powered
          </span>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Skill Gap{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-sky-400">
              Analysis
            </span>
          </h1>
          <p className="mt-2 text-[13px] text-white/30 font-light">
            Compare your current skills with target job roles and find what to learn next.
          </p>
        </div>

        {/* ── Role Selector ── */}
        <div className="mb-6">
          <p className="text-[10px] tracking-widest uppercase text-white/25 font-medium mb-3">
            Select Target Role
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {roles.map((r, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`relative text-left rounded-2xl p-4 border transition-all duration-200
                  ${selected === i
                    ? `${r.border} ${r.bg} shadow-lg ${r.glow}`
                    : "border-white/8 bg-white/3 hover:border-white/15 hover:bg-white/5"
                  }`}
              >
                {/* Active top bar */}
                {selected === i && (
                  <div className={`absolute top-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r ${r.color}`} />
                )}
                <span className="text-xl block mb-2">{r.icon}</span>
                <p className="text-white text-[12px] font-semibold leading-tight mb-2">{r.name}</p>

                {/* Match bar */}
                <div className="h-1 bg-white/8 rounded-full overflow-hidden mb-1">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${r.color} transition-all duration-500`}
                    style={{ width: `${r.match}%` }}
                  />
                </div>
                <p className={`text-[10px] font-bold ${selected === i ? r.text : "text-white/25"}`}>
                  {r.match}% match
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* ── Overall match banner ── */}
        <div className={`rounded-2xl border ${role.border} ${role.bg} p-4 mb-5 flex items-center justify-between`}>
          <div>
            <p className="text-white/40 text-[11px] uppercase tracking-widest mb-1">Overall Match for</p>
            <p className="text-white font-bold text-base">{role.icon} {role.name}</p>
          </div>
          <div className="text-right">
            <p className={`text-4xl font-black ${role.text}`}>{role.match}%</p>
            <p className="text-white/25 text-[11px]">compatibility</p>
          </div>
        </div>

        {/* ── Two panels ── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* Skills You Have */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <p className="text-[11px] text-white/40 uppercase tracking-widest font-semibold">
                Skills You Have
              </p>
            </div>
            <div className="space-y-4">
              {mySkills.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[12px] text-white/60 font-medium">{s.name}</span>
                    <span className="text-[11px] text-white/30">{s.score}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${s.color}`}
                      style={{ width: `${s.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-white/15 mt-5 pt-3 border-t border-white/5">
              Scores update after analysis
            </p>
          </div>

          {/* Skills to Learn */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-rose-400" />
              <p className="text-[11px] text-white/40 uppercase tracking-widest font-semibold">
                Skills to Learn
              </p>
            </div>
            <div className="space-y-4">
              {gapSkills.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[12px] text-white/60 font-medium">{s.name}</span>
                    <span className="text-[11px] text-rose-400/70">Need {s.needed}%</span>
                  </div>
                  {/* Stacked bar: current vs needed */}
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden relative">
                    {/* Needed ghost */}
                    <div
                      className="absolute h-full rounded-full bg-white/8"
                      style={{ width: `${s.needed}%` }}
                    />
                    {/* Current */}
                    <div
                      className={`absolute h-full rounded-full bg-gradient-to-r ${s.color}`}
                      style={{ width: `${s.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-white/15 mt-5 pt-3 border-t border-white/5">
              Based on {role.name} requirements
            </p>
          </div>
        </div>

        {/* ── CTA ── */}
        <button className="mt-5 w-full py-3.5 rounded-xl font-semibold text-[13px] text-white bg-gradient-to-r from-violet-500 to-sky-500 hover:shadow-xl hover:shadow-violet-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 tracking-wide">
          ✦ Generate Full Analysis
        </button>

      </div>
    </div>
  );
}