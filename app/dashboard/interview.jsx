"use client";
import { useState, useEffect } from "react";


const types = [
  { icon: "🧠", name: "Behavioral", desc: "Leadership, teamwork & conflict resolution" },
  { icon: "💻", name: "Technical", desc: "Coding, systems design & problem solving" },
  { icon: "🎯", name: "Case Study", desc: "Business strategy & analytical thinking" },
];
 
export default function Interview() {
  const [selected, setSelected] = useState(0);
  const [started, setStarted] = useState(false);
 
  return (
    <div className="min-h-screen flex justify-center relative overflow-hidden">
 
      {/* Orb 1 - amber */}
      <div className="absolute -top-40 -right-32 w-96 h-96 bg-amber-500 rounded-full opacity-20 blur-3xl pointer-events-none" />
      {/* Orb 2 - blue */}
      <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-blue-600 rounded-full opacity-20 blur-3xl pointer-events-none" />
      {/* Orb 3 - purple */}
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-violet-600 rounded-full opacity-10 blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
 
      {/* Card */}
      <div className="relative z-10 w-full m-10  border border-white/10 backdrop-blur-[1px] rounded-3xl p-10 shadow-2xl">
 
 
        {/* Title */}
        <h1 className="text-4xl font-bold text-white leading-tight tracking-tight">
          Master Your{" "}
          <span className="italic bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Interview
          </span>
        </h1>
        <p className="mt-3 text-sm text-white/35 font-light">
          Practice with our AI interviewer and get instant, detailed feedback on every answer.
        </p>
 
        {/* Section label */}
        <p className="mt-8 text-xs tracking-widest uppercase text-white/25 font-medium mb-3">
          Select Interview Type
        </p>
 
        {/* Type cards */}
        <div className="grid grid-cols-3 gap-3">
          {types.map((t, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`relative text-left rounded-2xl p-4 border transition-all duration-200
                ${selected === i
                  ? "border-amber-400 bg-amber-400/10 shadow-lg shadow-amber-500/10"
                  : "border-white/10 bg-white/5 hover:border-amber-400/30 hover:bg-amber-400/5"
                }`}
            >
              {/* Active top bar */}
              {selected === i && (
                <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" />
              )}
 
              {/* Check dot */}
              <div className={`absolute top-3 right-3 w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black text-xs font-bold transition-all duration-200
                ${selected === i ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}>
                ✓
              </div>
 
              <span className="text-xl mb-2 block">{t.icon}</span>
              <p className="text-sm font-semibold text-white mb-1">{t.name}</p>
              <p className="text-xs text-white/30 font-light leading-snug">{t.desc}</p>
            </button>
          ))}
        </div>
 
        {/* Divider */}
        <div className="my-7 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
 
        {/* Start Button */}
        <button
          onClick={() => setStarted(!started)}
          className="w-full py-4 rounded-2xl font-medium text-sm tracking-wide text-gray-900 bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
        >
          {started ? "⏹ End Session" : "▶ Start Interview"}
        </button>
 
        {/* Footer note */}
        <p className="text-center text-xs text-white/50 mt-4">
          Starting a <span className="text-white/70">{types[selected].name}</span> session · ~20 min
        </p>
      </div>
    </div>
  );
}