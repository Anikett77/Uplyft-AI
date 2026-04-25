"use client";
import { useState } from "react";
import Link from "next/link";
import { useResumeState } from "@/hooks/useResumeState";

// ── Static style palettes per phase index ────────────────────────────────
const PALETTES = [
  { color:"from-rose-500 to-pink-600",    glow:"shadow-rose-500/40",    border:"border-rose-500/40",    bg:"bg-rose-500/10",    dot:"bg-rose-400",    textAccent:"text-rose-400",    icon:"🌱" },
  { color:"from-orange-500 to-amber-500", glow:"shadow-orange-500/40",  border:"border-orange-500/40",  bg:"bg-orange-500/10",  dot:"bg-orange-400",  textAccent:"text-orange-400",  icon:"⚡" },
  { color:"from-emerald-500 to-teal-500", glow:"shadow-emerald-500/40", border:"border-emerald-500/40", bg:"bg-emerald-500/10", dot:"bg-emerald-400",  textAccent:"text-emerald-400", icon:"🛠️" },
  { color:"from-sky-500 to-blue-600",     glow:"shadow-sky-500/40",     border:"border-sky-500/40",     bg:"bg-sky-500/10",     dot:"bg-sky-400",     textAccent:"text-sky-400",     icon:"🚀" },
  { color:"from-violet-500 to-purple-600",glow:"shadow-violet-500/40",  border:"border-violet-500/40",  bg:"bg-violet-500/10",  dot:"bg-violet-400",  textAccent:"text-violet-400",  icon:"🏗️" },
  { color:"from-pink-500 to-fuchsia-600", glow:"shadow-pink-500/40",    border:"border-pink-500/40",    bg:"bg-pink-500/10",    dot:"bg-pink-400",    textAccent:"text-pink-400",    icon:"🎯" },
];

const statusLabel = {
  completed: { text:"Completed",   cls:"bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  active:    { text:"In Progress", cls:"bg-amber-500/20   text-amber-400   border-amber-500/30"   },
  upcoming:  { text:"Upcoming",    cls:"bg-white/5        text-white/30    border-white/10"        },
};

// ── Build roadmap phases from real resume data ────────────────────────────
function buildRoadmap(parsed, ats) {
  const presentSkills = ats?.skillGap?.present || parsed?.skills || [];
  const missingSkills = ats?.skillGap?.missing || [];
  const partialSkills = ats?.skillGap?.partial || [];
  const targetRole    = ats?.roleMatch?.role || parsed?.targetRole || "Target Role";
  const experience    = (parsed?.experience || "").toLowerCase();
  const isFresher     = experience.includes("fresher") || experience.includes("0") || experience === "";

  // ── Phase 1: Strengthen what you already have ──
  const phase1Skills = presentSkills.slice(0, 5);

  // ── Phase 2: Fix partials (skills with depth needed) ──
  const phase2Skills = [
    ...partialSkills.slice(0, 3),
    ...missingSkills.slice(0, 2),
  ].slice(0, 5);

  // ── Phase 3: Core missing skills ──
  const phase3Skills = missingSkills.slice(2, 7).slice(0, 5);

  // ── Phase 4: Advanced / leftover missing ──
  const phase4Skills = [
    ...missingSkills.slice(7, 10),
    "System Design",
    "Mock Interviews",
    "Portfolio Projects",
  ].slice(0, 5);

  // ── Phase 5: Job-ready ──
  const phase5Skills = [
    "Resume Polish",
    "LinkedIn Optimization",
    "Open Source Contributions",
    "Networking",
    `Land ${targetRole} role`,
  ];

  const phases = [
    { title:"Strengthen Foundation",  duration:"0–4 weeks",   skills: phase1Skills.length  ? phase1Skills  : ["Core concepts", "Best practices", "Version control", "Clean code"], statusKey: "completed" },
    { title:"Bridge the Skill Gaps",  duration:"1–3 months",  skills: phase2Skills.length  ? phase2Skills  : ["Advanced patterns", "Testing", "Documentation", "Code review"],    statusKey: "active"    },
    { title:`Core ${targetRole} Skills`, duration:"3–6 months", skills: phase3Skills.length ? phase3Skills  : ["Architecture", "Performance", "Security", "Scalability"],          statusKey: "upcoming"  },
    { title:"Advanced & Projects",    duration:"6–9 months",  skills: phase4Skills,                                                                                               statusKey: "upcoming"  },
    { title:"Job Ready",              duration:"9–12 months", skills: phase5Skills,                                                                                               statusKey: "upcoming"  },
  ].filter(p => p.skills.length > 0);

  // Compute progress: completed = 20%, active phase in progress = ~20% more = 28% etc.
  const completedCount = phases.filter(p => p.statusKey === "completed").length;
  const activeExists   = phases.some(p => p.statusKey === "active");
  const progressPct    = Math.round((completedCount / phases.length) * 100 + (activeExists ? (1 / phases.length) * 40 : 0));

  return {
    phases: phases.map((p, i) => ({ ...p, ...PALETTES[i % PALETTES.length], phase: String(i + 1).padStart(2, "0") })),
    progressPct,
    targetRole,
    nextPhase: phases.find(p => p.statusKey === "active") || phases.find(p => p.statusKey === "upcoming"),
  };
}

// ── Empty state ────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden flex items-center justify-center px-4">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-600 rounded-full opacity-20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-violet-700 rounded-full opacity-20 blur-3xl pointer-events-none" />
      <div className="relative z-10 text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mx-auto mb-6">🗺️</div>
        <h2 className="text-white font-bold text-xl mb-2">No roadmap yet</h2>
        <p className="text-white/30 text-sm mb-6 leading-relaxed">
          Analyse your resume first so we can build a personalised career roadmap based on your real skill gaps.
        </p>
        <Link href="/resume" className="inline-block px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-violet-500">
          Go to Resume Analyzer →
        </Link>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function Roadmap() {
  const { step, parsed, ats, hydrated } = useResumeState();
  const [hovered, setHovered] = useState(null);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div style={{ width:32,height:32,border:"2px solid rgba(255,255,255,0.1)",borderTop:"2px solid #f43f5e",borderRadius:"50%",animation:"spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (step === "upload" || !parsed || !ats) return <EmptyState />;

  const { phases, progressPct, targetRole, nextPhase } = buildRoadmap(parsed, ats);
  const activePhase = phases.find(p => p.statusKey === "active");

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden font-sans">

      {/* Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-600 rounded-full opacity-20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-sky-600 rounded-full opacity-20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-700 rounded-full opacity-20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-600 rounded-full opacity-[0.18] blur-3xl pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none opacity-30" style={{ backgroundImage:"linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)", backgroundSize:"40px 40px" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-14 text-center">
          <div className="flex items-center justify-end mb-4">
            <Link href="/resume" className="text-[11px] px-4 py-2 rounded-lg bg-white/5 border border-white/9 text-white/30 hover:text-white/60 transition-colors">
              ↩ Resume Report
            </Link>
          </div>

          <h1 className="text-5xl font-black text-white tracking-tight leading-tight">
            Career{" "}
            <span className="bg-gradient-to-r from-rose-400 via-amber-400 to-violet-400 bg-clip-text text-transparent">
              Roadmap
            </span>
          </h1>
          <p className="mt-3 text-white/35 text-sm font-light max-w-md mx-auto">
            Personalised path to <span className="text-white/55 font-medium">{targetRole}</span> based on your resume · {parsed?.fullName || ""}
          </p>

          {/* ATS score pill */}
          {ats?.atsScore && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
              <span className="text-[11px] text-white/35">ATS Score</span>
              <span className={`text-[13px] font-bold ${ats.atsScore >= 75 ? "text-emerald-400" : ats.atsScore >= 50 ? "text-amber-400" : "text-rose-400"}`}>
                {ats.atsScore}/100
              </span>
            </div>
          )}

          {/* Progress bar */}
          <div className="mt-6 flex items-center gap-3 max-w-xs mx-auto">
            <span className="text-[11px] text-white/30">Progress</span>
            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-rose-500 via-amber-400 to-orange-500 transition-all duration-1000"
                style={{ width:`${progressPct}%` }} />
            </div>
            <span className="text-[11px] text-amber-400 font-medium">{progressPct}%</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-rose-500/50 via-sky-500/30 to-violet-500/20" />

          <div className="space-y-5">
            {phases.map((s, i) => (
              <div
                key={i}
                className="relative pl-20 cursor-pointer"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Timeline dot */}
                <div className={`absolute left-5 top-6 w-6 h-6 rounded-full bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg ${s.glow} transition-transform duration-200 ${hovered === i ? "scale-125" : "scale-100"}`}>
                  <div className="w-2 h-2 rounded-full bg-white/80" />
                </div>

                {/* Active ping */}
                {s.statusKey === "active" && (
                  <div className="absolute left-5 top-6 w-6 h-6 rounded-full bg-amber-400 opacity-30 animate-ping" />
                )}

                {/* Card */}
                <div className={`rounded-2xl border p-5 transition-all duration-300 ${hovered === i ? `${s.border} ${s.bg} shadow-xl ${s.glow}` : "border-white/7 bg-white/3 shadow-none"}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{s.icon}</span>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[10px] font-bold tracking-widest ${s.textAccent}`}>PHASE {s.phase}</span>
                        </div>
                        <h3 className="text-white font-bold text-lg leading-tight">{s.title}</h3>
                        <p className="text-white/30 text-[11px] mt-0.5">{s.duration}</p>
                      </div>
                    </div>
                    <span className={`shrink-0 text-[10px] px-2.5 py-1 rounded-full border font-medium tracking-wide ${statusLabel[s.statusKey].cls}`}>
                      {statusLabel[s.statusKey].text}
                    </span>
                  </div>

                  {/* Skills */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {s.skills.map((sk, j) => (
                      <span key={j}
                        className={`text-[11px] px-3 py-1 rounded-full font-medium transition-all duration-200
                          ${hovered === i ? `bg-gradient-to-r ${s.color} text-white shadow-sm` : "bg-white/5 text-white/40 border border-white/8"}`}
                        style={{ transitionDelay:`${j * 30}ms` }}>
                        {sk}
                      </span>
                    ))}
                  </div>

                  {/* Show ATS suggestion if this is the active phase */}
                  {s.statusKey === "active" && ats?.suggestions?.[0] && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <p className="text-[11px] text-white/30 leading-relaxed">
                        💡 {ats.suggestions[0].text}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        {nextPhase && (
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/3 backdrop-blur-sm p-6 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-white font-semibold text-sm">
                {activePhase ? `Continue: ${activePhase.title}` : `Start: ${nextPhase.title}`}
              </p>
              <p className="text-white/30 text-[11px] mt-0.5">
                {ats?.skillGap?.missing?.length > 0
                  ? `${ats.skillGap.missing.length} skills to close the gap for ${targetRole}`
                  : `You're on track for ${targetRole}`}
              </p>
            </div>
            <Link href="" className="shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-900 bg-gradient-to-r from-orange-400 to-amber-400 hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150">
              View Skill Gap →
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}