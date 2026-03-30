"use client";
import { useState, useEffect } from "react";


export default function Jobs() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");

  const jobs = [
    {
      id: 0,
      title: "Frontend Developer",
      company: "Stripe",
      location: "Remote · Full-time",
      salary: "$120k – $160k",
      match: 92,
      tags: ["React", "TypeScript", "CSS"],
      icon: "💳",
      border: "border-sky-500/20",
      bg: "bg-sky-500/5",
      bar: "from-sky-400 to-cyan-400",
      text: "text-sky-400",
      glow: "shadow-sky-500/20",
      type: "remote",
    },
    {
      id: 1,
      title: "Full Stack Engineer",
      company: "Vercel",
      location: "Hybrid · San Francisco",
      salary: "$130k – $170k",
      match: 85,
      tags: ["Next.js", "Node.js", "PostgreSQL"],
      icon: "▲",
      border: "border-violet-500/20",
      bg: "bg-violet-500/5",
      bar: "from-violet-400 to-purple-400",
      text: "text-violet-400",
      glow: "shadow-violet-500/20",
      type: "hybrid",
    },
    {
      id: 2,
      title: "React Native Developer",
      company: "Notion",
      location: "Remote · Full-time",
      salary: "$110k – $145k",
      match: 78,
      tags: ["React Native", "Expo", "Redux"],
      icon: "📝",
      border: "border-emerald-500/20",
      bg: "bg-emerald-500/5",
      bar: "from-emerald-400 to-teal-400",
      text: "text-emerald-400",
      glow: "shadow-emerald-500/20",
      type: "remote",
    },
    {
      id: 3,
      title: "UI Engineer",
      company: "Linear",
      location: "On-site · New York",
      salary: "$125k – $155k",
      match: 74,
      tags: ["Figma", "React", "Design Systems"],
      icon: "🔷",
      border: "border-rose-500/20",
      bg: "bg-rose-500/5",
      bar: "from-rose-400 to-pink-400",
      text: "text-rose-400",
      glow: "shadow-rose-500/20",
      type: "onsite",
    },
    {
      id: 4,
      title: "Software Engineer II",
      company: "Airbnb",
      location: "Hybrid · Remote",
      salary: "$140k – $180k",
      match: 69,
      tags: ["Python", "React", "AWS"],
      icon: "🏠",
      border: "border-amber-500/20",
      bg: "bg-amber-500/5",
      bar: "from-amber-400 to-orange-400",
      text: "text-amber-400",
      glow: "shadow-amber-500/20",
      type: "hybrid",
    },
    {
      id: 5,
      title: "DevOps Engineer",
      company: "HashiCorp",
      location: "Remote · Full-time",
      salary: "$135k – $165k",
      match: 61,
      tags: ["Terraform", "Kubernetes", "CI/CD"],
      icon: "⚙️",
      border: "border-indigo-500/20",
      bg: "bg-indigo-500/5",
      bar: "from-indigo-400 to-blue-400",
      text: "text-indigo-400",
      glow: "shadow-indigo-500/20",
      type: "remote",
    },
  ];

  const filters = [
    { id: "all",    label: "All Jobs" },
    { id: "remote", label: "Remote" },
    { id: "hybrid", label: "Hybrid" },
    { id: "onsite", label: "On-site" },
  ];

  const filtered = filter === "all" ? jobs : jobs.filter(j => j.type === filter);
  const active = selected !== null ? jobs[selected] : null;

  return (
    <div className="min-h-screen bg-[#0b0d12] relative overflow-hidden px-4 py-14">

      {/* ── Background orbs ── */}
      <div className="absolute -top-32 -right-24 w-[400px] h-[400px] rounded-full bg-violet-700 opacity-[0.10] blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-24 w-[350px] h-[350px] rounded-full bg-sky-700 opacity-[0.08] blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[250px] h-[250px] rounded-full bg-emerald-700 opacity-[0.07] blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[200px] h-[200px] rounded-full bg-rose-700 opacity-[0.06] blur-3xl pointer-events-none" />

      {/* ── Dot grid ── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] tracking-widest uppercase text-white/30 font-medium mb-4">
            ✦ AI Powered
          </span>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Job{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-sky-400">
              Recommendations
            </span>
          </h1>
          <p className="mt-2 text-[13px] text-white/30 font-light">
            Personalized roles matched to your skills, experience, and target career path.
          </p>
        </div>

        {/* ── Filter tabs ── */}
        <div className="mb-6">
          <p className="text-[10px] tracking-widest uppercase text-white/25 font-medium mb-3">Filter By Type</p>
          <div className="flex gap-2 flex-wrap">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-1.5 rounded-full text-[12px] font-semibold border transition-all duration-200
                  ${filter === f.id
                    ? "bg-gradient-to-r from-violet-500/20 to-sky-500/20 border-violet-400/30 text-white"
                    : "border-white/8 text-white/30 hover:border-white/15 hover:text-white/50 bg-white/[0.02]"
                  }`}
              >
                {f.label}
              </button>
            ))}
            <span className="ml-auto text-[11px] text-white/20 self-center">{filtered.length} roles found</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          {/* ── Job Cards ── */}
          <div className="space-y-3">
            {filtered.map((job) => (
              <button
                key={job.id}
                onClick={() => setSelected(job.id)}
                className={`relative w-full text-left rounded-2xl p-4 border transition-all duration-200 overflow-hidden
                  ${selected === job.id
                    ? `${job.border} ${job.bg} scale-[1.01] shadow-lg ${job.glow}`
                    : "border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                  }`}
              >
                {/* Active top bar */}
                {selected === job.id && (
                  <div className={`absolute top-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r ${job.bar}`} />
                )}

                <div className="flex items-start gap-3">
                  {/* Company icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 border ${job.border} ${job.bg}`}>
                    {job.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-white text-sm font-bold truncate">{job.title}</p>
                      <span className={`text-[11px] font-black shrink-0 ${selected === job.id ? job.text : "text-white/30"}`}>
                        {job.match}%
                      </span>
                    </div>
                    <p className="text-white/40 text-[11px] mt-0.5">{job.company} · {job.location}</p>

                    {/* Match bar */}
                    <div className="h-1 bg-white/8 rounded-full overflow-hidden mt-2 mb-2">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${job.bar} transition-all duration-500`}
                        style={{ width: `${job.match}%` }}
                      />
                    </div>

                    {/* Tags */}
                    <div className="flex gap-1.5 flex-wrap">
                      {job.tags.map((tag, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/8 text-white/35">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* ── Detail Panel ── */}
          <div className="sticky top-6">
            {active ? (
              <div className={`relative rounded-2xl border p-6 overflow-hidden ${active.border} ${active.bg}`}>
                {/* Top bar */}
                <div className={`absolute top-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r ${active.bar}`} />

                {/* Company + title */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border ${active.border} ${active.bg}`}>
                    {active.icon}
                  </div>
                  <div>
                    <p className="text-white font-black text-lg leading-tight">{active.title}</p>
                    <p className="text-white/40 text-[12px] mt-0.5">{active.company}</p>
                  </div>
                </div>

                {/* Match score — big like Skill Gap overall banner */}
                <div className={`relative rounded-xl border p-4 mb-5 flex items-center justify-between overflow-hidden ${active.border} bg-black/20`}>
                  <div className={`absolute top-0 left-3 right-3 h-[2px] rounded-full bg-gradient-to-r ${active.bar}`} />
                  <div>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Match Score</p>
                    <p className="text-white font-semibold text-sm">{active.location}</p>
                  </div>
                  <p className={`text-4xl font-black ${active.text}`}>{active.match}%</p>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { label: "Salary",   value: active.salary,   bar: active.bar, border: active.border, bg: active.bg },
                    { label: "Type",     value: active.type.charAt(0).toUpperCase() + active.type.slice(1), bar: active.bar, border: active.border, bg: active.bg },
                    { label: "Company",  value: active.company,  bar: active.bar, border: active.border, bg: active.bg },
                    { label: "Location", value: active.location.split("·")[0].trim(), bar: active.bar, border: active.border, bg: active.bg },
                  ].map((d, i) => (
                    <div key={i} className={`relative rounded-xl border p-3 overflow-hidden ${d.border} ${d.bg}`}>
                      <div className={`absolute top-0 left-2 right-2 h-[1.5px] rounded-full bg-gradient-to-r ${d.bar} opacity-60`} />
                      <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">{d.label}</p>
                      <p className="text-white text-xs font-semibold truncate">{d.value}</p>
                    </div>
                  ))}
                </div>

                {/* Skills required */}
                <div className="mb-5">
                  <p className="text-[10px] text-white/25 uppercase tracking-widest mb-3">Skills Required</p>
                  <div className="space-y-2.5">
                    {active.tags.map((tag, i) => {
                      const pct = [88, 72, 65][i] || 60;
                      return (
                        <div key={i}>
                          <div className="flex justify-between mb-1">
                            <span className="text-[12px] text-white/60 font-medium">{tag}</span>
                            <span className={`text-[11px] ${active.text}`}>{pct}%</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${active.bar} transition-all duration-700`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* CTA */}
                <button className={`w-full py-3 rounded-xl font-semibold text-[13px] text-white bg-gradient-to-r ${active.bar} hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 tracking-wide`}>
                  ✦ Apply Now
                </button>
                <button className="w-full mt-2 py-2.5 rounded-xl font-semibold text-[12px] text-white/40 border border-white/8 hover:bg-white/5 hover:text-white/60 transition-all">
                  Save for Later
                </button>
              </div>
            ) : (
              /* Empty state */
              <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-10 flex flex-col items-center justify-center text-center min-h-[300px]">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl mb-4">💼</div>
                <p className="text-white/40 text-sm font-medium mb-1">Select a job</p>
                <p className="text-white/20 text-[12px]">Click any role on the left to see details</p>
              </div>
            )}
          </div>
        </div>

        {/* ── CTA ── */}
        <button className="mt-6 w-full py-3.5 rounded-xl font-semibold text-[13px] text-white bg-gradient-to-r from-violet-500 to-sky-500 hover:shadow-xl hover:shadow-violet-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 tracking-wide">
          ✦ Load More Recommendations
        </button>

      </div>
    </div>
  );
}