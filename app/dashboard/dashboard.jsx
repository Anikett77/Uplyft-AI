"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useResumeState } from "@/hooks/useResumeState";
import { useLearningState } from "@/hooks/useLearningState";

export default function Dashboard({ setActive }) {
  const router = useRouter();
  const { parsed, ats, step, hydrated: resumeHydrated } = useResumeState();
  const { courses, tasks, streak, hoursLearned, hydrated: learningHydrated } = useLearningState();

  const hydrated = resumeHydrated && learningHydrated;

  if (!hydrated) return (
    <div className="min-h-screen bg-[#0b0d12] flex items-center justify-center">
      <div style={{ width:32,height:32,border:"2px solid rgba(255,255,255,0.1)",borderTop:"2px solid #818cf8",borderRadius:"50%",animation:"spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const hasResume   = step !== "upload" && parsed;
  const hasAts      = !!ats;
  const firstName   = parsed?.fullName?.split(" ")[0] || "there";
  const targetRole  = ats?.roleMatch?.role || parsed?.targetRole || "Not set";
  const skillCount  = parsed?.skills?.length || 0;

  // ── Real stat values ──
  const atsScore      = ats?.atsScore      ?? 0;
  const roleMatch     = ats?.roleMatch?.score ?? 0;
  const tasksDone     = tasks.filter(t => t.done).length;
  const tasksTotal    = tasks.length || 10;
  const completedCourses = courses.filter(c => c.status === "completed").length;

  // Career readiness = average of what's filled in
  const readinessParts = [
    hasResume ? 25 : 0,
    hasAts ? Math.round(atsScore * 0.25) : 0,
    roleMatch > 0 ? Math.round(roleMatch * 0.25) : 0,
    tasksTotal > 0 ? Math.round((tasksDone / tasksTotal) * 25) : 0,
  ];
  const readiness = readinessParts.reduce((a, b) => a + b, 0);

  const stats = [
    { label:"ATS Score",       value: hasAts ? String(atsScore) : "—",           suffix:"/100", color:"text-sky-400",     sub: hasAts ? "Based on your resume" : "Upload resume first",   href:"/resume",    border:"border-sky-500/20",    bg:"bg-sky-500/5",    bar:"from-sky-400 to-cyan-400",      pct: atsScore },
    { label:"Role Match",      value: hasAts ? `${roleMatch}` : "—",             suffix:"%",    color:"text-violet-400",  sub: hasAts ? ats.roleMatch?.role : "Analyse resume first",      href:"/skill-gap", border:"border-violet-500/20",  bg:"bg-violet-500/5", bar:"from-violet-400 to-purple-400", pct: roleMatch },
    { label:"Skill Match",     value: skillCount > 0 ? `${skillCount}` : "—",    suffix:" skills",color:"text-emerald-400",sub: hasResume ? `${parsed.skills?.slice(0,2).join(", ")}…` : "Upload resume",href:"/skill-gap",border:"border-emerald-500/20",bg:"bg-emerald-500/5",bar:"from-emerald-400 to-teal-400",pct: Math.min(100,skillCount*10)},
    { label:"Tasks Done",      value: tasksTotal > 0 ? String(tasksDone) : "—",  suffix:`/${tasksTotal}`,color:"text-rose-400",sub: tasksTotal > 0 ? `${Math.round((tasksDone/tasksTotal)*100)}% complete` : "Start your roadmap",href:"/learning",border:"border-rose-500/20",bg:"bg-rose-500/5",bar:"from-rose-400 to-pink-400",pct: tasksTotal > 0 ? Math.round((tasksDone/tasksTotal)*100) : 0},
  ];

  const atsBreakdown = [
    { label:"Keywords",   value: hasAts ? `${ats.keywords?.matched||0}/${ats.keywords?.total||0}` : "—", color:"text-sky-400",     border:"border-sky-500/20",    bg:"bg-sky-500/5",    bar:"from-sky-400 to-cyan-400"      },
    { label:"Format",     value: hasAts ? `${ats.formatReview?.score||0}/100`                    : "—", color:"text-violet-400",  border:"border-violet-500/20",  bg:"bg-violet-500/5", bar:"from-violet-400 to-purple-400" },
    { label:"Skills",     value: hasAts ? `${ats.skillGap?.present?.length||0} found`            : "—", color:"text-emerald-400", border:"border-emerald-500/20", bg:"bg-emerald-500/5",bar:"from-emerald-400 to-teal-400"  },
    { label:"Role Match", value: hasAts ? `${ats.roleMatch?.score||0}%`                          : "—", color:"text-rose-400",    border:"border-rose-500/20",    bg:"bg-rose-500/5",   bar:"from-rose-400 to-pink-400"     },
  ];

  const skillBarColors = ["from-sky-400 to-cyan-400","from-violet-400 to-purple-400","from-emerald-400 to-teal-400","from-rose-400 to-pink-400","from-amber-400 to-orange-400","from-indigo-400 to-blue-400"];

  const skillScores = (parsed?.skills || []).slice(0, 6).map((skill, i) => ({
    name: skill,
    score: ats?.keywords?.found?.map(k=>k.toLowerCase()).includes(skill.toLowerCase())
      ? Math.min(90, 55 + i * 8) : Math.min(65, 35 + i * 10),
  }));

  // Activity timeline — mark real completed steps
  const activities = [
    { title:"Account Created",      status: "done",                  time:"Profile ready"                                    },
    { title:"Resume Uploaded",       status: hasResume ? "done" : "pending", time: hasResume ? parsed.fullName : "Pending"   },
    { title:"ATS Analysis",          status: hasAts    ? "done" : "pending", time: hasAts    ? `${atsScore}/100` : "Pending" },
    { title:"Skill Gap Reviewed",    status: hasAts    ? "done" : "pending", time: hasAts    ? `${ats.skillGap?.missing?.length||0} gaps` : "Pending" },
    { title:"Learning Plan Created", status: courses.length > 0 ? "done" : "pending", time: courses.length > 0 ? `${courses.length} courses` : "Pending" },
  ];

  return (
    <div className="min-h-screen bg-[#0b0d12] relative overflow-hidden px-4 py-14">
      <div className="absolute -top-32 -right-24 w-[400px] h-[400px] rounded-full bg-violet-700 opacity-[0.10] blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-24 w-[350px] h-[350px] rounded-full bg-sky-700 opacity-[0.08] blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[250px] h-[250px] rounded-full bg-emerald-700 opacity-[0.07] blur-3xl pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage:"radial-gradient(rgba(255,255,255,0.035) 1px,transparent 1px)", backgroundSize:"28px 28px" }} />

      <div className="relative z-10 max-w-6xl mx-auto space-y-5">

        {/* Header */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] tracking-widest uppercase text-white/30 font-medium mb-4">✦ AI Powered</span>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Career <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-sky-400">Dashboard</span>
          </h1>
          <p className="mt-2 text-[13px] text-white/30 font-light">
            Hey <span className="text-violet-400 font-medium">{firstName} 👋</span>
            &nbsp;·&nbsp; Target: <span className="text-sky-400 font-medium">{targetRole}</span>
            {skillCount > 0 && <>&nbsp;·&nbsp; <span className="text-emerald-400 font-medium">{skillCount} skills</span></>}
          </p>
        </div>

        {/* Readiness banner */}
        <div className="relative rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5 flex justify-between items-center overflow-hidden flex-wrap gap-4">
          <div className="absolute top-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r from-violet-400 to-sky-400" />
          <div>
            <p className="text-white/40 text-[11px] uppercase tracking-widest mb-1">Overall Progress</p>
            <p className="text-white font-bold text-base">Career Readiness Overview</p>
            <p className="text-white/25 text-xs mt-1">{readiness < 50 ? "Complete all sections to boost your score" : readiness < 80 ? "Great progress — keep going!" : "You're highly prepared 🎯"}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/30 mb-1">Career Readiness</p>
            <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-sky-400">{readiness}%</p>
            <p className="text-white/25 text-[11px]">overall score</p>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((s) => (
            <button key={s.label}
              className={`relative text-left rounded-2xl p-5 border transition-all duration-200 hover:scale-[1.02] overflow-hidden ${s.border} ${s.bg}`}>
              <div className={`absolute top-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r ${s.bar}`} />
              <p className="text-[10px] text-white/35 uppercase tracking-widest mb-2">{s.label}</p>
              <p className={`text-3xl font-black ${s.color}`}>{s.value}<span className="text-sm text-white/25">{s.suffix}</span></p>
              <div className="h-1 bg-white/8 rounded-full overflow-hidden mt-2 mb-1">
                <div className={`h-full rounded-full bg-gradient-to-r ${s.bar} transition-all duration-700`} style={{ width:`${s.pct}%` }} />
              </div>
              <p className="text-xs text-white/25 truncate">{s.sub}</p>
            </button>
          ))}
        </div>

        {/* Skills + Activity */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                      <div className={`h-full rounded-full bg-gradient-to-r ${skillBarColors[i%skillBarColors.length]} transition-all duration-700`} style={{ width:`${skill.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-white/20 text-sm mb-3">No skills detected yet</p>
                <button className="text-[12px] px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" onClick={() => setActive("resume")}>Upload resume →</button>
              </div>
            )}
            <p className="text-[10px] text-white/15 mt-5 pt-3 border-t border-white/5">Scores inferred from ATS keyword analysis</p>
          </div>

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
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${act.status==="done" ? dots[i%dots.length] : "bg-white/15"}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${act.status==="done" ? "text-white/75" : "text-white/30"}`}>{act.title}</p>
                      <p className="text-xs text-white/20">{act.time}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium border flex-shrink-0 ${act.status==="done" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" : "bg-white/[0.05] text-white/25 border-white/8"}`}>
                      {act.status==="done" ? "Done" : "Todo"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ATS breakdown */}
        <div className="relative rounded-2xl border border-sky-500/20 bg-sky-500/[0.03] p-5 overflow-hidden">
          <div className="absolute top-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r from-sky-400 to-violet-400" />
          <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
            <div>
              <p className="text-[10px] text-white/35 uppercase tracking-widest font-semibold mb-1">Resume ATS Analysis</p>
              {!hasAts ? (
                <p className="text-sm text-white/30">Upload your resume in <button className="text-sky-400 underline underline-offset-2" onClick={() => setActive("resume")}>Resume Analyzer</button> to get your ATS score</p>
              ) : (
                <p className="text-sm text-white/50">{ats.overallSummary?.slice(0, 80)}…</p>
              )}
            </div>
            <div className="text-center px-6 py-4 rounded-xl border border-sky-500/20 bg-sky-500/10 flex-shrink-0">
              <p className="text-3xl font-black text-sky-400">{hasAts ? atsScore : "—"}</p>
              <p className="text-xs text-white/25 mt-1">ATS Score</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {atsBreakdown.map((item) => (
              <div key={item.label} className={`relative rounded-xl p-3 text-center border overflow-hidden ${item.border} ${item.bg}`}>
                <div className={`absolute top-0 left-3 right-3 h-[2px] rounded-full bg-gradient-to-r ${item.bar}`} />
                <p className={`text-base font-black ${item.color}`}>{item.value}</p>
                <p className="text-xs text-white/25 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          className="w-full py-3.5 rounded-xl font-semibold text-[13px] text-white bg-gradient-to-r from-violet-500 to-sky-500 hover:shadow-xl hover:shadow-violet-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 tracking-wide">
          {hasResume ? "✦ View Full Career Analysis" : "✦ Start Full Career Analysis"}
        </button>
      </div>
    </div>
  );
}