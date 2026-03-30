"use client";
import { useState, useEffect } from "react";
import { useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import axios from "axios";

const states = [
  { value: "12", label: "Courses Completed", icon: "🎓", color: "from-violet-500 to-purple-600", text: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  { value: "48h", label: "Hours Learned", icon: "⏱️", color: "from-sky-500 to-blue-600", text: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20" },
  { value: "7", label: "Day Streak", icon: "🔥", color: "from-orange-500 to-amber-500", text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  { value: "3", label: "In Progress", icon: "📖", color: "from-emerald-500 to-teal-500", text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
];

const courses = [
  { title: "System Design Interview", platform: "Educative", modules: "16/24", pct: 65, last: "Today", color: "from-pink-500 to-rose-500", tag: "text-pink-400", tagBg: "bg-pink-500/10 border-pink-500/20" },
  { title: "Advanced TypeScript", platform: "Frontend Masters", modules: "8/15", pct: 53, last: "Yesterday", color: "from-sky-500 to-blue-500", tag: "text-sky-400", tagBg: "bg-sky-500/10 border-sky-500/20" },
  { title: "ML Fundamentals", platform: "Coursera", modules: "4/20", pct: 20, last: "3 days ago", color: "from-emerald-500 to-teal-500", tag: "text-emerald-400", tagBg: "bg-emerald-500/10 border-emerald-500/20" },
];

const tasks = [
  { text: "Complete Module 17 — Caching", done: true, color: "bg-emerald-400" },
  { text: "Watch TS generics video", done: true, color: "bg-emerald-400" },
  { text: "Practice LeetCode DP", done: false, color: "bg-white/20" },
  { text: "Read ML chapter 5", done: false, color: "bg-white/20" },
  { text: "Review system design notes", done: false, color: "bg-white/20" },
];

const skills = [
  { name: "System Design", pct: 72, imp: "+27%", color: "#a78bfa", track: "#2e1065" },
  { name: "TypeScript", pct: 58, imp: "+14%", color: "#38bdf8", track: "#0c2340" },
  { name: "Machine Learning", pct: 34, imp: "+8%", color: "#34d399", track: "#052e16" },
  { name: "DSA", pct: 81, imp: "+33%", color: "#fb923c", track: "#431407" },
];

const completed = [
  { title: "TypeScript Fundamentals", platform: "Udemy", date: "Jan 2025", icon: "📘", color: "border-blue-500/20 bg-blue-500/5" },
  { title: "React Advanced Patterns", platform: "Egghead", date: "Dec 2024", icon: "⚛️", color: "border-sky-500/20 bg-sky-500/5" },
  { title: "Node.js Masterclass", platform: "Udemy", date: "Nov 2024", icon: "🟢", color: "border-emerald-500/20 bg-emerald-500/5" },
];

function CircleProgress({ pct, color, track, size = 88 }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox="0 0 88 88" className="-rotate-90">
      <circle cx="44" cy="44" r={r} fill="none" stroke={track} strokeWidth="7" />
      <circle
        cx="44" cy="44" r={r} fill="none"
        stroke={color} strokeWidth="7"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
      />
    </svg>
  );
}



export default function Learning() {
  const [taskDone, setTaskDone] = useState(tasks.map(t => t.done));

  return (
    <div className="min-h-screen bg-[#0b0d12] relative overflow-hidden px-4 py-14">

      {/* Orbs */}
      <div className="absolute -top-24 -right-16 w-[360px] h-[360px] rounded-full bg-violet-700 opacity-[0.09] blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-20 w-[320px] h-[320px] rounded-full bg-sky-700 opacity-[0.08] blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-[260px] h-[260px] rounded-full bg-emerald-700 opacity-[0.07] blur-3xl pointer-events-none" />

      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] tracking-widest uppercase text-white/30 font-medium mb-4">
            📚 Learning Hub
          </span>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Learning{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-emerald-400">
              Tracker
            </span>
          </h1>
          <p className="mt-2 text-[13px] text-white/30 font-light">
            Track your courses, daily tasks, and skill improvements all in one place.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-5">
          {states.map((s, i) => (
            <div key={i} className={`rounded-2xl border ${s.border} ${s.bg} p-4 hover:-translate-y-0.5 transition-all duration-200`}>
              <span className="text-xl">{s.icon}</span>
              <p className={`text-2xl font-black ${s.text} leading-none mt-2`}>{s.value}</p>
              <p className="text-[11px] text-white/30 font-light mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Active Courses + Today's Tasks */}
        <div className="flex gap-4 mb-4">

          {/* Active Courses */}
          <div className="flex-[2] rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-pink-400" />
                <p className="text-[11px] text-white/40 uppercase tracking-widest font-semibold">Active Courses</p>
              </div>
              <button className="text-[11px] text-white/30 border border-white/10 px-2.5 py-1 rounded-lg hover:border-white/20 hover:text-white/50 transition-all">
                + Add
              </button>
            </div>

            <div className="space-y-3">
              {courses.map((c, i) => (
                <div key={i} className="rounded-xl border border-white/6 bg-white/[0.015] p-4 hover:bg-white/[0.03] transition-all duration-200">
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-[13px] text-white font-semibold leading-tight">{c.title}</p>
                    <button className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border ${c.tagBg} ${c.tag} shrink-0 ml-2`}>
                      Continue
                    </button>
                  </div>
                  <p className="text-[11px] text-white/30 mb-3">{c.platform}</p>
                  <div className="flex justify-between text-[10px] text-white/30 mb-1.5">
                    <span>{c.modules} modules</span>
                    <span className={c.tag}>{c.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${c.color}`} style={{ width: `${c.pct}%` }} />
                  </div>
                  <p className="text-[10px] text-white/20 mt-2">Last accessed: {c.last}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Tasks */}
          <div className="flex-1 rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <p className="text-[11px] text-white/40 uppercase tracking-widest font-semibold">Today's Tasks</p>
            </div>
            <div className="space-y-2.5">
              {tasks.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setTaskDone(d => d.map((v, j) => j === i ? !v : v))}
                  className="w-full flex items-start gap-2.5 text-left group"
                >
                  <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all duration-200
                    ${taskDone[i] ? "bg-emerald-400 border-emerald-400" : "border-white/20 group-hover:border-white/40"}`}>
                    {taskDone[i] && <span className="text-[8px] font-black text-black">✓</span>}
                  </div>
                  <span className={`text-[12px] leading-snug transition-all ${taskDone[i] ? "text-white/25 line-through" : "text-white/60"}`}>
                    {t.text}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-5 pt-3 border-t border-white/5">
              <p className="text-[10px] text-white/20">
                {taskDone.filter(Boolean).length}/{tasks.length} completed
              </p>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden mt-1.5">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${(taskDone.filter(Boolean).length / tasks.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Skill Improvements */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 mb-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-violet-400" />
            <p className="text-[11px] text-white/40 uppercase tracking-widest font-semibold">Skill Improvements</p>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {skills.map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="relative">
                  <CircleProgress pct={s.pct} color={s.color} track={s.track} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-black text-white">{s.pct}%</span>
                  </div>
                </div>
                <p className="text-[12px] text-white/70 font-semibold mt-2">{s.name}</p>
                <p className="text-[10px] text-emerald-400 mt-0.5">{s.imp}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Completed */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 mb-4">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-2 h-2 rounded-full bg-teal-400" />
            <p className="text-[11px] text-white/40 uppercase tracking-widest font-semibold">Recently Completed</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {completed.map((c, i) => (
              <div key={i} className={`rounded-xl border ${c.color} p-4 hover:-translate-y-0.5 transition-all duration-200`}>
                <span className="text-xl block mb-2">{c.icon}</span>
                <p className="text-[12px] text-white font-semibold leading-snug mb-1">{c.title}</p>
                <p className="text-[10px] text-white/25">{c.platform} · {c.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button className="w-full py-3.5 rounded-xl font-semibold text-[13px] text-white bg-gradient-to-r from-violet-500 to-emerald-500 hover:shadow-xl hover:shadow-violet-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 tracking-wide">
          ✦ Generate Learning Plan
        </button>

      </div>
    </div>
  );
}