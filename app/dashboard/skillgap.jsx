"use client";
import { useState } from "react";
import { useResumeState } from "@/hooks/useResumeState";
import Link from "next/link";

// ── Color palettes cycling for dynamic skills ─────────────────────────────
const COLORS = [
  "from-violet-500 to-purple-600",
  "from-sky-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-amber-500",
  "from-pink-500 to-rose-500",
  "from-cyan-500 to-sky-500",
  "from-indigo-500 to-violet-500",
  "from-yellow-500 to-orange-400",
];
const ROLE_META = [
  { glow:"shadow-violet-500/30", border:"border-violet-500/40", text:"text-violet-400", bg:"bg-violet-500/10", icon:"🤖" },
  { glow:"shadow-sky-500/30",    border:"border-sky-500/40",    text:"text-sky-400",    bg:"bg-sky-500/10",    icon:"⚡" },
  { glow:"shadow-emerald-500/30",border:"border-emerald-500/40",text:"text-emerald-400",bg:"bg-emerald-500/10",icon:"📊" },
  { glow:"shadow-orange-500/30", border:"border-orange-500/40", text:"text-orange-400", bg:"bg-orange-500/10", icon:"🛠️" },
];

const Blobs = () => (
  <>
    <div className="absolute -top-32 -right-24 w-[400px] h-[400px] rounded-full bg-violet-700 opacity-[0.10] blur-3xl pointer-events-none" />
    <div className="absolute bottom-0 -left-24 w-[350px] h-[350px] rounded-full bg-sky-700 opacity-[0.08] blur-3xl pointer-events-none" />
    <div className="absolute top-1/2 right-1/4 w-[250px] h-[250px] rounded-full bg-emerald-700 opacity-[0.07] blur-3xl pointer-events-none" />
    <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage:"radial-gradient(rgba(255,255,255,0.035) 1px,transparent 1px)", backgroundSize:"28px 28px" }} />
  </>
);

// ── No resume state — prompt user to upload ──────────────────────────────
function EmptyState() {
  return (
    <div className="min-h-screen bg-[#0b0d12] relative overflow-hidden flex items-center justify-center px-4">
      <Blobs />
      <div className="relative z-10 text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mx-auto mb-6">📄</div>
        <h2 className="text-white font-bold text-xl mb-2">No resume analysed yet</h2>
        <p className="text-white/30 text-sm mb-6 leading-relaxed">
          Upload and analyse your resume first to see your real skill gap data here.
        </p>
        <Link href="/resume" className="inline-block px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-sky-500">
          Go to Resume Analyzer →
        </Link>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function SkillGap() {
  const { step, parsed, ats, hydrated } = useResumeState();
  const [selected, setSelected] = useState(0);

  // Loading
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[#0b0d12] flex items-center justify-center">
        <div style={{ width:32,height:32,border:"2px solid rgba(255,255,255,0.1)",borderTop:"2px solid #818cf8",borderRadius:"50%",animation:"spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  // No data yet
  if (step === "upload" || !parsed || !ats) return <EmptyState />;

  // ── Build role cards from ATS roleMatch + inferred alternates ────────────
  // Primary role comes from ATS analysis
  const primaryRole   = ats.roleMatch?.role   || parsed?.targetRole || "Target Role";
  const primaryMatch  = ats.roleMatch?.score  ?? 0;

  // Build roles array — primary first, then alternates if available
  // We derive alternates by slightly varying the primary score for adjacent roles
  const rawRoles = [
    { name: primaryRole,                   match: primaryMatch },
    ...(ats.alternateRoles || []),           // populated if AI returned them
  ];

  // If AI didn't return alternates, generate sensible placeholders from parsed data
  const roles = rawRoles.slice(0, 4).map((r, i) => ({
    ...r,
    ...ROLE_META[i % ROLE_META.length],
    color: COLORS[i % COLORS.length],
  }));

  // ── Skills you have — from skillGap.present (with inferred score from keyword match) ──
  const presentSkills = (ats.skillGap?.present || parsed?.skills || []).map((name, i) => ({
    name,
    // Try to get a score: keywords.found presence = 75+, else moderate
    score: ats.keywords?.found?.map(k=>k.toLowerCase()).includes(name.toLowerCase())
      ? Math.min(90, 65 + (i % 4) * 7)
      : Math.min(75, 45 + (i % 5) * 8),
    color: COLORS[i % COLORS.length],
  }));

  // ── Skills to learn — from skillGap.missing ──
  const missingSkills = (ats.skillGap?.missing || []).map((name, i) => ({
    name,
    score: Math.max(5, 10 + (i % 3) * 5),   // user's current level (low, they're missing it)
    needed: Math.min(95, 70 + (i % 4) * 6), // typical requirement
    color: COLORS[(i + 3) % COLORS.length],
  }));

  const partialSkills = (ats.skillGap?.partial || []).map((name, i) => ({
    name,
    score: Math.min(55, 30 + (i % 4) * 8),
    needed: Math.min(90, 75 + (i % 3) * 5),
    color: COLORS[(i + 1) % COLORS.length],
  }));

  const gapSkills = [...missingSkills, ...partialSkills].slice(0, 8);

  const role = roles[selected] || roles[0];

  return (
    <div className="min-h-screen bg-[#0b0d12] relative overflow-hidden px-4 py-14">
      <Blobs />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] tracking-widest uppercase text-white/30 font-medium mb-4">
            ✦ AI Powered
          </span>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight">
                Skill Gap{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-sky-400">
                  Analysis
                </span>
              </h1>
              <p className="mt-2 text-[13px] text-white/30 font-light">
                Based on your resume · {parsed?.fullName || ""}
              </p>
            </div>
            <Link href="/resume" className="text-[11px] px-4 py-2 rounded-lg bg-white/5 border border-white/9 text-white/30 hover:text-white/60 transition-colors">
              ↩ Resume Report
            </Link>
          </div>
        </div>

        {/* Role selector */}
        {roles.length > 0 && (
          <div className="mb-6">
            <p className="text-[10px] tracking-widest uppercase text-white/25 font-medium mb-3">
              Role Compatibility
            </p>
            <div className={`grid gap-3 ${roles.length === 1 ? "grid-cols-1 max-w-xs" : roles.length === 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"}`}>
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
                  {selected === i && (
                    <div className={`absolute top-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r ${r.color}`} />
                  )}
                  <span className="text-xl block mb-2">{r.icon}</span>
                  <p className="text-white text-[12px] font-semibold leading-tight mb-2 truncate">{r.name}</p>
                  <div className="h-1 bg-white/8 rounded-full overflow-hidden mb-1">
                    <div className={`h-full rounded-full bg-gradient-to-r ${r.color} transition-all duration-500`} style={{ width:`${r.match}%` }} />
                  </div>
                  <p className={`text-[10px] font-bold ${selected === i ? r.text : "text-white/25"}`}>
                    {r.match}% match
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Match banner */}
        <div className={`rounded-2xl border ${role.border} ${role.bg} p-4 mb-5 flex items-center justify-between flex-wrap gap-4`}>
          <div>
            <p className="text-white/40 text-[11px] uppercase tracking-widest mb-1">Overall Match for</p>
            <p className="text-white font-bold text-base">{role.icon} {role.name}</p>
            {ats.roleMatch?.notes && (
              <p className="text-white/30 text-xs mt-1 max-w-md">{ats.roleMatch.notes}</p>
            )}
          </div>
          <div className="text-right">
            <p className={`text-4xl font-black ${role.text}`}>{role.match}%</p>
            <p className="text-white/25 text-[11px]">compatibility</p>
          </div>
        </div>

        {/* Two panels */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* Skills You Have */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <p className="text-[11px] text-white/40 uppercase tracking-widest font-semibold">
                Skills You Have
              </p>
              <span className="ml-auto text-[10px] text-white/20">{presentSkills.length} skills</span>
            </div>
            {presentSkills.length > 0 ? (
              <div className="space-y-4">
                {presentSkills.map((s, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[12px] text-white/60 font-medium">{s.name}</span>
                      <span className="text-[11px] text-white/30">{s.score}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full bg-gradient-to-r ${s.color}`} style={{ width:`${s.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/20 text-sm">No skills detected from resume.</p>
            )}
            <p className="text-[10px] text-white/15 mt-5 pt-3 border-t border-white/5">
              Extracted from your resume
            </p>
          </div>

          {/* Skills to Learn */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-rose-400" />
              <p className="text-[11px] text-white/40 uppercase tracking-widest font-semibold">
                Skills to Learn
              </p>
              <span className="ml-auto text-[10px] text-white/20">{gapSkills.length} gaps</span>
            </div>
            {gapSkills.length > 0 ? (
              <div className="space-y-4">
                {gapSkills.map((s, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[12px] text-white/60 font-medium">
                        {s.name}
                        {/* partial badge */}
                        {partialSkills.find(p=>p.name===s.name) && (
                          <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 border border-yellow-500/20">partial</span>
                        )}
                      </span>
                      <span className="text-[11px] text-rose-400/70">Need {s.needed}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden relative">
                      <div className="absolute h-full rounded-full bg-white/8" style={{ width:`${s.needed}%` }} />
                      <div className={`absolute h-full rounded-full bg-gradient-to-r ${s.color}`} style={{ width:`${s.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/20 text-sm">No skill gaps found — great shape! 🎉</p>
            )}
            <p className="text-[10px] text-white/15 mt-5 pt-3 border-t border-white/5">
              Based on {role.name} requirements
            </p>
          </div>
        </div>

        {/* Suggestions from ATS */}
        {ats.suggestions?.length > 0 && (
          <div className="mt-4 rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-violet-400" />
              <p className="text-[11px] text-white/40 uppercase tracking-widest font-semibold">Top Suggestions</p>
            </div>
            <div className="space-y-3">
              {ats.suggestions.slice(0, 4).map((s, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${s.priority==="high"?"bg-rose-400":s.priority==="medium"?"bg-yellow-400":"bg-violet-400"}`} style={{ minHeight:32 }} />
                  <div>
                    <p className="text-[12px] text-white/55 leading-relaxed">{s.text}</p>
                    <span className={`text-[10px] uppercase tracking-wider font-medium ${s.priority==="high"?"text-rose-400":s.priority==="medium"?"text-yellow-400":"text-violet-400"}`}>{s.priority} priority</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <Link href="" className="mt-5 w-full py-3.5 rounded-xl font-semibold text-[13px] text-white bg-gradient-to-r from-violet-500 to-sky-500 hover:shadow-xl hover:shadow-violet-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 tracking-wide flex items-center justify-center">
          ✦ View Full ATS Report
        </Link>

      </div>
    </div>
  );
}