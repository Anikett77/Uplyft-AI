"use client";
import { useState, useEffect } from "react";
import { useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import axios from "axios";

const Spline = dynamic(() => import("@splinetool/react-spline"), { ssr: false });

const NAV_ITEMS = [
  { id: "dashboard",  label: "Dashboard" },
  { id: "resume",     label: "Resume Analyzer" },
  { id: "skillgap",   label: "Skill Gap Analysis" },
  { id: "roadmap",    label: "Career Roadmap" },
  { id: "interview",  label: "AI Mock Interview" },
  { id: "jobs",       label: "Job Recommendations" },
  { id: "portfolio",  label: "Portfolio Analyzer" },
  { id: "learning",   label: "Learning Tracker" },
  { id: "mentor",     label: "AI Mentor Chat" },
  { id: "settings",   label: "Settings" },
];

// ── Content Components ──
// sections/DashboardHome.jsx
// ── Ye component dashboard ka home section hai
// user prop se saara data aata hai
// setActive prop se dusre sections pe navigate kar sakte hain

export function Dashboard() {

    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

useEffect(() => {
  axios.get("/api/users/me")
    .then(res => setUser(res.data.data))
    .catch(() => router.push("/login"))
    .finally(() => setLoading(false));
}, []);

  // ── User ke skills se progress bars banate hain
  // Abhi sab 0 hai — baad mein skill gap analysis se update hoga
  const skillScores = (user?.skills || []).slice(0, 6).map(skill => ({
    name: skill,
    score: 0, // baad mein API se aayega
  }));

  // ── Stat cards ka data
  const stats = [
    { label: "ATS Score",       value: "0",  suffix: "/100", color: "text-blue-400",   sub: "Upload resume first",    action: "resume" },
    { label: "Interview Score", value: "0",  suffix: "/100", color: "text-purple-400", sub: "No mock done yet",       action: "interview" },
    { label: "Skill Match",     value: "0",  suffix: "%",    color: "text-green-400",  sub: "Analyze skills first",   action: "skillgap" },
    { label: "Tasks Done",      value: "0",  suffix: "/10",  color: "text-orange-400", sub: "Start your roadmap",     action: "roadmap" },
  ];

  // ── Recent activity — starting state, sab pending
  const activities = [
    { title: "Profile Created",      status: "done",    time: "Just now" },
    { title: "Resume Analyzed",      status: "pending", time: "Pending" },
    { title: "Skill Gap Analysis",   status: "pending", time: "Pending" },
    { title: "Mock Interview #1",    status: "pending", time: "Pending" },
    { title: "Roadmap Generated",    status: "pending", time: "Pending" },
  ];

  // ── ATS breakdown — sab — jab tak resume upload nahi hota
  const atsBreakdown = [
    { label: "Keywords",   value: "—" },
    { label: "Formatting", value: "—" },
    { label: "Skills",     value: "—" },
    { label: "Experience", value: "—" },
  ];

  return (
    <div className="space-y-5">

      {/* ── Welcome Banner ── */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600/15 to-purple-600/8 border border-blue-500/20 p-5 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">
            Hey {user?.fullName?.split(" ")[0] || "there"} 👋
          </h2>
          <p className="text-white/40 text-sm mt-1">
            Target: <span className="text-blue-400 font-medium">{user?.targetRole || "Not set"}</span>
            &nbsp;·&nbsp;
            Skills: <span className="text-purple-400 font-medium">{user?.skills?.length || 0}</span>
            &nbsp;·&nbsp;
            Keep going!
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/30 mb-1">Career Readiness</p>
          {/* Ye 0% hai abhi — baad mein AI calculate karega */}
          <p className="text-3xl font-bold text-green-400">0%</p>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <button
            key={stat.label}
            onClick={() => setActive(stat.action)}
            className="text-left rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 hover:bg-white/[0.06] hover:border-white/10 transition-all"
          >
            <p className="text-xs text-white/35 uppercase tracking-wider mb-2">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>
              {stat.value}
              <span className="text-base text-white/25">{stat.suffix}</span>
            </p>
            <p className="text-xs text-white/25 mt-1">{stat.sub}</p>
          </button>
        ))}
      </div>

      {/* ── Skills Progress + Recent Activity ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 z-10">

        {/* Skills Progress */}
        <div className="rounded-2xl border border-white bg-black/10 p-5">
          <p className="text-xs text-white/35 uppercase tracking-wider font-semibold mb-4">
            Skill Proficiency
          </p>

          {skillScores.length > 0 ? (
            <div className="space-y-3">
              {skillScores.map((skill, i) => {
                // har skill ka color alag
                const colors = ["bg-blue-400", "bg-purple-400", "bg-green-400", "bg-orange-400", "bg-pink-400", "bg-cyan-400"];
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-white/50 w-24 truncate">{skill.name}</span>
                    <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      {/* score 0 abhi — baad mein dynamic hoga */}
                      <div
                        className={`h-full rounded-full ${colors[i % colors.length]} transition-all duration-700`}
                        style={{ width: `${skill.score}%` }}
                      />
                    </div>
                    <span className="text-xs text-white/30 w-7 text-right">{skill.score}%</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-white/25 text-sm">No skills added yet</p>
          )}

          <p className="text-xs text-white/20 mt-4 pt-3 border-t border-white/[0.05]">
            Scores update after Skill Gap Analysis
          </p>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
          <p className="text-xs text-white/35 uppercase tracking-wider font-semibold mb-4">
            Recent Activity
          </p>
          <div className="space-y-0">
            {activities.map((act, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-0">
                {/* dot — green if done, gray if pending */}
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${act.status === "done" ? "bg-blue-400" : "bg-white/15"}`} />
                <div className="flex-1">
                  <p className={`text-sm ${act.status === "done" ? "text-white/75" : "text-white/30"}`}>
                    {act.title}
                  </p>
                  <p className="text-xs text-white/20">{act.time}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  act.status === "done"
                    ? "bg-blue-500/15 text-blue-400"
                    : "bg-white/[0.05] text-white/25"
                }`}>
                  {act.status === "done" ? "Done" : "Todo"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Resume ATS Box ── */}
      <div className="rounded-2xl border border-blue-500/20 bg-white/[0.02] p-5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-xs text-white/35 uppercase tracking-wider font-semibold mb-1">
              Resume ATS Analysis
            </p>
            <p className="text-sm text-white/30">
              Upload your resume in{" "}
              <button onClick={() => setActive("resume")} className="text-blue-400 underline underline-offset-2">
                Resume Analyzer
              </button>{" "}
              to get your ATS score
            </p>
          </div>
          {/* ATS Score ring */}
          <div className="text-center px-6 py-4 bg-blue-500/[0.07] rounded-xl border border-blue-500/15 flex-shrink-0">
            <p className="text-3xl font-bold text-blue-400">—</p>
            <p className="text-xs text-white/25 mt-1">ATS Score</p>
          </div>
        </div>

        {/* Breakdown mini cards */}
        <div className="grid grid-cols-4 gap-3">
          {atsBreakdown.map((item) => (
            <div key={item.label} className="bg-white/[0.03] rounded-xl p-3 text-center border border-white/[0.04]">
              <p className="text-base font-semibold text-white/30">{item.value}</p>
              <p className="text-xs text-white/20 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}



function Resume() {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleFile = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  return (
    <div className="min-h-screen bg-[#0d0f14] relative overflow-hidden flex items-center justify-center px-4 py-16">

      {/* ── Background mood lighting ── */}
      <div className="absolute top-[-80px] left-[-60px] w-[420px] h-[420px] rounded-full bg-indigo-700 opacity-[0.12] blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-60px] right-[-40px] w-[360px] h-[360px] rounded-full bg-teal-600 opacity-[0.10] blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-slate-600 opacity-[0.07] blur-3xl pointer-events-none" />

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 w-full max-w-lg">

        {/* ── Header ── */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] tracking-widest uppercase text-white/30 font-medium mb-4">
             AI Powered Analysis
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight leading-snug">
            Resume{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">
              Analyzer
            </span>
          </h1>
          <p className="mt-2 text-[13px] text-white/30 font-light leading-relaxed">
            Upload your resume and get detailed AI-powered insights, skill gaps, and role-match scores.
          </p>
        </div>

        {/* ── Upload Card ── */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => !file && inputRef.current.click()}
          className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden
            ${dragging
              ? "border-teal-400/60 bg-teal-500/5 scale-[1.01]"
              : file
              ? "border-indigo-400/40 bg-indigo-500/5 cursor-default"
              : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
            }`}
        >
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-teal-500/40 rounded-tl-xl" />
          <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-teal-500/40 rounded-tr-xl" />
          <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-indigo-500/40 rounded-bl-xl" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-indigo-500/40 rounded-br-xl" />

          <div className="px-8 py-14 flex flex-col items-center text-center">

            {file ? (
              /* ── File uploaded state ── */
              <>
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/15 border border-indigo-400/20 flex items-center justify-center mb-5 text-3xl">
                  📄
                </div>
                <p className="text-white font-semibold text-sm truncate max-w-[240px]">{file.name}</p>
                <p className="text-white/30 text-[11px] mt-1">
                  {(file.size / 1024).toFixed(1)} KB · Ready to analyze
                </p>
                <button
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="mt-4 text-[11px] text-white/25 hover:text-rose-400 transition-colors underline underline-offset-2"
                >
                  Remove file
                </button>
              </>
            ) : (
              /* ── Empty state ── */
              <>
                {/* Icon circle */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 text-2xl
                  ${dragging
                    ? "bg-teal-500/20 border border-teal-400/30 scale-110"
                    : "bg-white/5 border border-white/10"
                  }`}
                >
                  {dragging ? "📂" : "☁️"}
                </div>

                <h2 className="text-white font-semibold text-base mb-2">
                  {dragging ? "Drop it here!" : "Upload Your Resume"}
                </h2>
                <p className="text-white/25 text-[12px] leading-relaxed mb-6 max-w-[260px]">
                  Drag & drop your file here, or click to browse.<br />
                  Supports <span className="text-white/40">PDF</span> and <span className="text-white/40">DOCX</span> formats.
                </p>

                <button
                  onClick={(e) => { e.stopPropagation(); inputRef.current.click(); }}
                  className="px-6 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-gradient-to-r from-teal-500 to-indigo-500 hover:shadow-lg hover:shadow-teal-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
                >
                  Browse File
                </button>
              </>
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            onChange={handleFile}
          />
        </div>

        {/* ── Analyze button ── */}
        {file && (
          <button className="mt-4 w-full py-3.5 rounded-xl font-semibold text-[13px] text-white bg-gradient-to-r from-teal-500 to-indigo-500 hover:shadow-xl hover:shadow-indigo-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 tracking-wide">
            ✦ Analyze My Resume
          </button>
        )}

        {/* ── Feature chips ── */}
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {["ATS Score", "Skill Gap Analysis", "Role Match", "Keyword Check", "Format Review"].map((f, i) => (
            <span
              key={i}
              className="text-[11px] px-3 py-1 rounded-full bg-white/4 border border-white/8 text-white/30 font-light"
            >
              {f}
            </span>
          ))}
        </div>

        {/* ── Privacy note ── */}
        <p className="mt-5 text-center text-[11px] text-white/15">
          🔒 Your resume is never stored or shared
        </p>

      </div>
    </div>
  );
}



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

function SkillGap() {
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
 
function Roadmap() {
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


const types = [
  { icon: "🧠", name: "Behavioral", desc: "Leadership, teamwork & conflict resolution" },
  { icon: "💻", name: "Technical", desc: "Coding, systems design & problem solving" },
  { icon: "🎯", name: "Case Study", desc: "Business strategy & analytical thinking" },
];
 
function Interview() {
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


function Jobs()       { return <h1 className="text-white text-3xl">💼 Job Recommendations</h1> }






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

function Portfolio() {
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



function Learning() {
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





function Mentor()     { 
  return (
  <div>
    <h1 className="text-white text-2xl font-serif">🤖 AI Mentor Chat</h1>
    <p className="text-gray-400 m-3 font-serif">Get personalized career guidance from your AI mentor</p>
    <div className="w-full h-130 bg-blue-950 m-5 rounded-2xl pt-9 p-5 flex">
      <img className="w-9 h-9" src="/globe.svg" alt="" /> <div className="w-8/10 h-40 font-serif text-sm bg-black text-white ml-3 p-5 rounded-2xl">Hello! I'm your AI Career Mentor. I'm here to help you with career guidance, interview preparation, skill development, and any career-related questions you might have.
<br />
<br />
How can I assist you today? <p className="text-gray-400 text-xs mt-5">02:12 PM</p></div>
<div className="mt-52 -ml-5 border-y border-gray-500 w-306  h-30 absolute p-4">Suggested questions:
  <div className=" grid grid-cols-4 gap-5 mt-3">
    <div className="border border-gray-500 rounded-full text-sm p-2 flex gap-2"> <img className="w-5 h-5" src="/hexa.svg" alt="" />How can I transition to a senior role?</div>
    <div className="border border-gray-500 rounded-full text-sm p-2 flex gap-2"> <img className="w-5 h-5" src="/hexa.svg" alt="" />How can I transition to a senior role?</div>
    <div className="border border-gray-500 rounded-full text-sm p-2 flex gap-2"> <img className="w-5 h-5" src="/hexa.svg" alt="" />How can I transition to a senior role?</div>
    <div className="border border-gray-500 rounded-full text-sm p-2 flex gap-2"> <img className="w-5 h-5" src="/hexa.svg" alt="" />How can I transition to a senior role?</div>
    </div>
    </div>
    <div className="absolute top-130 w-full flex">
    <input className="w-[85%] h-12 border border-gray-500 p-3.5 rounded-2xl" type="text" placeholder="Ask your AI mentor anything..." />
    <img className="w-5 h-5 rounded-2xl ml-4 bg-blue-400 p-6" src="/vercel.svg" alt="" />
    </div>
    <p className=" absolute top-143 ml-80 text-gray-500">AI responses are for guidance only. Always verify important career decisions.</p>
    </div>
    </div>
    
  )
}
function Settings()   { 
  const [active, setActive] = useState("dashboard");

const renderContent = () => {
  switch (active) {
    case "profile": return <Profile />;
    case "notification": return <Notification />;
    case "privacy": return <Privacy />;
    case "appearance": return <Appearance />;
    case "billing": return <Billing />;
    default: return <Profile />;
  }
};

const SET_ITEMS = [
  { id: "profile", label: "Profile" },
  { id: "notification", label: "Notification" },
  { id: "privacy", label: "Privacy" },
  { id: "appearance", label: "Appearance" },
  { id: "billing", label: "Billing" },
];

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    jobTitle: "",
    location: "",
    bio: "",
  });

  // 🔥 Fetch data from backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/users/me");
        setUser({
  fullName: res.data.data.fullName || "",
  email: res.data.data.email || "",
  jobTitle: res.data.data.targetRole || "",
  location: res.data.data.college || "",
  bio: res.data.data.experience || "", 
});
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // 🔥 Handle input change
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // 🔥 Save updated data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/api/users/me", user);
      alert("Profile updated successfully 🚀");
    } catch (error) {
      console.log("Error updating profile:", error);
    }
  };

function Profile () {
  return (
    <div className="">
      <h1 className="text-white">Profile Information</h1>
      <p className="text-gray-400 text-sm mt-1">Update your personal details and public profile</p>
      <div className="flex ">
      <div className="w-21 h-21 bg-blue-600 rounded-full mt-10">{}</div>
      <div className="text-white mt-13 ml-5">Change Avatar <p className="text-xs text-gray-400 mt-2 -ml-3">JPG, PNG or GIF. Max 2MB.</p></div>
      </div>
      <form onSubmit={handleSubmit} className=" text-white gap-4 w-full">
      <div className="grid grid-cols-2 gap-5">
      <input
        type="text"
        name="fullName"
        value={user.fullName}
        onChange={handleChange}
        placeholder="Full Name"
        className="border p-2 "
      />

      <input
        type="email"
        name="email"
        value={user.email}
        onChange={handleChange}
        placeholder="Email"
        className="border p-2"
      />

      <input
        type="text"
        name="jobTitle"
        value={user.jobTitle}
        onChange={handleChange}
        placeholder="Job Title"
        className="border p-2"
      />

      <input
        type="text"
        name="location"
        value={user.location}
        onChange={handleChange}
        placeholder="Location"
        className="border p-2"
      />
</div>
<div className="flex flex-col">
      <textarea
        name="bio"
        value={user.bio}
        onChange={handleChange}
        placeholder="Bio"
        className="border p-2"
      />

      <button type="submit" className="bg-blue-500 text-white p-2">
        Save Changes
      </button>
      </div>
    </form>
    </div>
  )
}

function Notification () {
  return (
    <div></div>
  )
}

  return (
    <div className="font-serif">
  <h1 className="text-white text-2xl font-serif">⚙️ Settings</h1>
  <p className="text-gray-400 m-2">Manage your account and preferences</p>
  <div className="flex gap-10 mt-10">
    <div className="w-1/4 h-160 bg-gray-800 rounded-2xl pt-8 p-2">
    {SET_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`
              block w-full text-left px-3 py-2.5 rounded-lg mb-1  text-sm transition-all
              ${active === item.id
                ? "bg-blue-500/90 text-white font-semibold"
                : "text-white/50 hover:text-white hover:bg-white/10"
              }
            `}
          >
            {item.label}
          </button>
))}</div>
    <div className="w-3/4 h-160 bg-gray-950 rounded-2xl p-7">{renderContent()}</div>
  </div>
  </div>
  )
}

export default function App() {
  const [active, setActive] = useState("dashboard");

  // ── ID aur component match hona chahiye ──
  const renderContent = () => {
    switch (active) {
      case "dashboard":  return <Dashboard />;
      case "resume":     return <Resume />;
      case "skillgap":   return <SkillGap />;
      case "roadmap":    return <Roadmap />;
      case "interview":  return <Interview />;
      case "jobs":       return <Jobs />;
      case "portfolio":  return <Portfolio />;
      case "learning":   return <Learning />;
      case "mentor":     return <Mentor />;
      case "settings":   return <Settings />;
      default:           return <Dashboard />;
    }
  };

  return (
    // ── Outer wrapper — relative position base
    <div className="relative min-h-screen flex overflow-hidden bg-black">

      {/* ── SPLINE — fixed, poori screen pe, sabse neeche z-0 ── */}
      <div className="fixed inset-0 z-0 pointer-events-none translate-x-[8%]">
  <Spline
        scene="https://prod.spline.design/8d3KHxkReUNnmBVL/scene.splinecode" 
      />
</div>

      {/* ── SIDEBAR — z-10 pe, Spline ke upar ── */}
      <aside className="fixed z-10 w-[270px] min-h-screen border-r border-white/20 bg-black backdrop-blur-md p-5">
        <h2 className="text-white font-bold mb-4 flex"><img className="w-20 h-20 object-cover" src="/uplyft.svg" alt="" /><span className="mt-4 text-md font-serif">Uplyft AI</span></h2>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`
              block w-full text-left px-3 py-2.5 rounded-lg mb-1 text-sm transition-all
              ${active === item.id
                ? "bg-blue-500/90 text-white font-semibold"
                : "text-white/50 hover:text-white hover:bg-white/10"
              }
            `}
          >
            {item.label}
          </button>
        ))}
      </aside>

      {/* ── MAIN CONTENT — z-10 pe, Spline ke upar ── */}
      <main className="relative z-10 ml-65 flex-1 pl-2">
        {renderContent()}
      </main>

    </div>
  );
}
