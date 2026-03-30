"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Dashboard() {
  const [active, setActive] = useState("dashboard");

  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── ORIGINAL BACKEND CODE (untouched) ──
  useEffect(() => {
    axios.get("/api/users/me")
      .then(res => setUser(res.data.data))
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, []);

  const skillScores = (user?.skills || []).slice(0, 6).map(skill => ({
    name: skill,
    score: 0,
  }));

  const stats = [
    { label: "ATS Score",       value: "0", suffix: "/100", color: "text-sky-400",     sub: "Upload resume first",  action: "resume",    border: "border-sky-500/20",     bg: "bg-sky-500/5",     bar: "from-sky-400 to-cyan-400" },
    { label: "Interview Score", value: "0", suffix: "/100", color: "text-violet-400",  sub: "No mock done yet",     action: "interview", border: "border-violet-500/20",  bg: "bg-violet-500/5",  bar: "from-violet-400 to-purple-400" },
    { label: "Skill Match",     value: "0", suffix: "%",    color: "text-emerald-400", sub: "Analyze skills first", action: "skillgap",  border: "border-emerald-500/20", bg: "bg-emerald-500/5", bar: "from-emerald-400 to-teal-400" },
    { label: "Tasks Done",      value: "0", suffix: "/10",  color: "text-rose-400",    sub: "Start your roadmap",   action: "roadmap",   border: "border-rose-500/20",    bg: "bg-rose-500/5",    bar: "from-rose-400 to-pink-400" },
  ];

  const activities = [
    { title: "Profile Created",    status: "done",    time: "Just now" },
    { title: "Resume Analyzed",    status: "pending", time: "Pending" },
    { title: "Skill Gap Analysis", status: "pending", time: "Pending" },
    { title: "Mock Interview #1",  status: "pending", time: "Pending" },
    { title: "Roadmap Generated",  status: "pending", time: "Pending" },
  ];

  const atsBreakdown = [
    { label: "Keywords",   value: "—", color: "text-sky-400",     border: "border-sky-500/20",     bg: "bg-sky-500/5",     bar: "from-sky-400 to-cyan-400" },
    { label: "Formatting", value: "—", color: "text-violet-400",  border: "border-violet-500/20",  bg: "bg-violet-500/5",  bar: "from-violet-400 to-purple-400" },
    { label: "Skills",     value: "—", color: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/5", bar: "from-emerald-400 to-teal-400" },
    { label: "Experience", value: "—", color: "text-rose-400",    border: "border-rose-500/20",    bg: "bg-rose-500/5",    bar: "from-rose-400 to-pink-400" },
  ];

  const skillBarColors = [
    "from-sky-400 to-cyan-400",
    "from-violet-400 to-purple-400",
    "from-emerald-400 to-teal-400",
    "from-rose-400 to-pink-400",
    "from-amber-400 to-orange-400",
    "from-indigo-400 to-blue-400",
  ];

  return (
    <div className="min-h-screen bg-[#0b0d12] relative overflow-hidden px-4 py-14">

      {/* ── Background orbs — exact Skill Gap style ── */}
      <div className="absolute -top-32 -right-24 w-[400px] h-[400px] rounded-full bg-violet-700 opacity-[0.10] blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-24 w-[350px] h-[350px] rounded-full bg-sky-700 opacity-[0.08] blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[250px] h-[250px] rounded-full bg-emerald-700 opacity-[0.07] blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[200px] h-[200px] rounded-full bg-rose-700 opacity-[0.06] blur-3xl pointer-events-none" />

      {/* ── Dot grid ── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      <div className="relative z-10 max-w-6xl mx-auto space-y-5">

        {/* ── Header ── */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] tracking-widest uppercase text-white/30 font-medium mb-4">
            ✦ AI Powered
          </span>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Career{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-sky-400">
              Dashboard
            </span>
          </h1>
          <p className="mt-2 text-[13px] text-white/30 font-light">
            Hey <span className="text-violet-400 font-medium">{user?.fullName?.split(" ")[0] || "there"} 👋</span>
            &nbsp;·&nbsp; Target: <span className="text-sky-400 font-medium">{user?.targetRole || "Not set"}</span>
            &nbsp;·&nbsp; Skills: <span className="text-emerald-400 font-medium">{user?.skills?.length || 0}</span>
          </p>
        </div>

        {/* ── Welcome banner ── */}
        <div className="relative rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5 flex justify-between items-center overflow-hidden">
          <div className="absolute top-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r from-violet-400 to-sky-400" />
          <div>
            <p className="text-white/40 text-[11px] uppercase tracking-widest mb-1">Overall Progress</p>
            <p className="text-white font-bold text-base">Career Readiness Overview</p>
            <p className="text-white/25 text-xs mt-1">Complete all sections to boost your score</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/30 mb-1">Career Readiness</p>
            <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-sky-400">0%</p>
            <p className="text-white/25 text-[11px]">compatibility</p>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((stat) => (
            <button
              key={stat.label}
              onClick={() => setActive(stat.action)}
              className={`relative text-left rounded-2xl p-5 border transition-all duration-200 hover:scale-[1.02] overflow-hidden ${stat.border} ${stat.bg}`}
            >
              {/* Top accent bar — same as role cards in Skill Gap */}
              <div className={`absolute top-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r ${stat.bar}`} />
              <p className="text-[10px] text-white/35 uppercase tracking-widest mb-2">{stat.label}</p>
              <p className={`text-3xl font-black ${stat.color}`}>
                {stat.value}
                <span className="text-base text-white/25">{stat.suffix}</span>
              </p>
              {/* Mini match bar */}
              <div className="h-1 bg-white/8 rounded-full overflow-hidden mt-2 mb-1">
                <div className={`h-full rounded-full bg-gradient-to-r ${stat.bar}`} style={{ width: "0%" }} />
              </div>
              <p className="text-xs text-white/25">{stat.sub}</p>
            </button>
          ))}
        </div>

        {/* ── Skills Progress + Recent Activity ── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* Skills You Have — mirrors left panel of Skill Gap */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <p className="text-[11px] text-white/40 uppercase tracking-widest font-semibold">Skill Proficiency</p>
            </div>

            {skillScores.length > 0 ? (
              <div className="space-y-4">
                {skillScores.map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[12px] text-white/60 font-medium">{skill.name}</span>
                      <span className="text-[11px] text-white/30">{skill.score}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${skillBarColors[i % skillBarColors.length]} transition-all duration-700`}
                        style={{ width: `${skill.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/25 text-sm">No skills added yet</p>
            )}

            <p className="text-[10px] text-white/15 mt-5 pt-3 border-t border-white/5">
              Scores update after Skill Gap Analysis
            </p>
          </div>

          {/* Recent Activity — mirrors right panel */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-violet-400" />
              <p className="text-[11px] text-white/40 uppercase tracking-widest font-semibold">Recent Activity</p>
            </div>
            <div className="space-y-0">
              {activities.map((act, i) => {
                const dots = ["bg-sky-400","bg-violet-400","bg-emerald-400","bg-rose-400","bg-amber-400"];
                return (
                  <div key={i} className="flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${act.status === "done" ? dots[i % dots.length] : "bg-white/15"}`} />
                    <div className="flex-1">
                      <p className={`text-sm ${act.status === "done" ? "text-white/75" : "text-white/30"}`}>{act.title}</p>
                      <p className="text-xs text-white/20">{act.time}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                      act.status === "done"
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                        : "bg-white/[0.05] text-white/25 border-white/8"
                    }`}>
                      {act.status === "done" ? "Done" : "Todo"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Resume ATS Box ── */}
        <div className="relative rounded-2xl border border-sky-500/20 bg-sky-500/[0.03] p-5 overflow-hidden">
          <div className="absolute top-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r from-sky-400 to-violet-400" />
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-[10px] text-white/35 uppercase tracking-widest font-semibold mb-1">
                Resume ATS Analysis
              </p>
              <p className="text-sm text-white/30">
                Upload your resume in{" "}
                <button onClick={() => setActive("resume")} className="text-sky-400 underline underline-offset-2 hover:text-sky-300 transition-colors">
                  Resume Analyzer
                </button>{" "}
                to get your ATS score
              </p>
            </div>
            <div className="text-center px-6 py-4 rounded-xl border border-sky-500/20 bg-sky-500/10 flex-shrink-0">
              <p className="text-3xl font-black text-sky-400">—</p>
              <p className="text-xs text-white/25 mt-1">ATS Score</p>
            </div>
          </div>

          {/* Breakdown mini cards — exact Skill Gap card style */}
          <div className="grid grid-cols-4 gap-3">
            {atsBreakdown.map((item) => (
              <div key={item.label} className={`relative rounded-xl p-3 text-center border overflow-hidden ${item.border} ${item.bg}`}>
                <div className={`absolute top-0 left-3 right-3 h-[2px] rounded-full bg-gradient-to-r ${item.bar}`} />
                <p className={`text-base font-black ${item.color}`}>{item.value}</p>
                <p className="text-xs text-white/25 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA — exact Skill Gap button ── */}
        <button className="w-full py-3.5 rounded-xl font-semibold text-[13px] text-white bg-gradient-to-r from-violet-500 to-sky-500 hover:shadow-xl hover:shadow-violet-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 tracking-wide">
          ✦ Start Full Career Analysis
        </button>

      </div>
    </div>
  );
}