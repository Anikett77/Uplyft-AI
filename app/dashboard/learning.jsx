"use client";
import { useState, useRef } from "react";
import { useResumeState } from "@/hooks/useResumeState";
import { useLearningState } from "@/hooks/useLearningState";

// ── Circle progress ───────────────────────────────────────────────────────
function CircleProgress({ pct, color, track, size = 88 }) {
  const r = 36, circ = 2 * Math.PI * r, dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox="0 0 88 88" className="-rotate-90">
      <circle cx="44" cy="44" r={r} fill="none" stroke={track} strokeWidth="7" />
      <circle cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="7"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition:"stroke-dasharray 0.8s ease" }} />
    </svg>
  );
}

// ── Skill circles seeded from resume data ─────────────────────────────────
const SKILL_STYLES = [
  { color:"#a78bfa", track:"#2e1065" },
  { color:"#38bdf8", track:"#0c2340" },
  { color:"#34d399", track:"#052e16" },
  { color:"#fb923c", track:"#431407" },
  { color:"#f472b6", track:"#4a044e" },
  { color:"#facc15", track:"#422006" },
];

function buildSkillCircles(ats, parsed) {
  const present = ats?.skillGap?.present || parsed?.skills || [];
  const missing = ats?.skillGap?.missing || [];

  // Present skills get moderate scores (40–85), missing get low (5–30)
  const circles = [
    ...present.slice(0, 3).map((name, i) => ({
      name,
      pct:  Math.min(85, 45 + i * 14),
      imp:  `+${8 + i * 6}%`,
    })),
    ...missing.slice(0, 2).map((name, i) => ({
      name,
      pct:  Math.max(5, 10 + i * 8),
      imp:  `+${3 + i * 2}%`,
    })),
  ].slice(0, 4);

  if (circles.length === 0) return [
    { name:"System Design", pct:72, imp:"+27%" },
    { name:"TypeScript",    pct:58, imp:"+14%" },
    { name:"DSA",           pct:81, imp:"+33%" },
    { name:"Algorithms",    pct:44, imp:"+9%"  },
  ];

  return circles.map((c, i) => ({ ...c, ...SKILL_STYLES[i % SKILL_STYLES.length] }));
}

// ── Add course modal ──────────────────────────────────────────────────────
const COLORS = [
  { color:"from-pink-500 to-rose-500",     tag:"text-pink-400",    tagBg:"bg-pink-500/10 border-pink-500/20"     },
  { color:"from-sky-500 to-blue-500",      tag:"text-sky-400",     tagBg:"bg-sky-500/10 border-sky-500/20"       },
  { color:"from-emerald-500 to-teal-500",  tag:"text-emerald-400", tagBg:"bg-emerald-500/10 border-emerald-500/20"},
  { color:"from-violet-500 to-purple-600", tag:"text-violet-400",  tagBg:"bg-violet-500/10 border-violet-500/20" },
  { color:"from-amber-500 to-orange-500",  tag:"text-amber-400",   tagBg:"bg-amber-500/10 border-amber-500/20"   },
];

function AddCourseModal({ onAdd, onClose }) {
  const [title, setTitle]       = useState("");
  const [platform, setPlatform] = useState("");
  const [total, setTotal]       = useState("12");
  const [colorIdx, setColorIdx] = useState(0);

  const submit = () => {
    if (!title.trim()) return;
    onAdd({
      title: title.trim(),
      platform: platform.trim() || "Self-study",
      totalModules: parseInt(total) || 12,
      icon: "📖",
      ...COLORS[colorIdx],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background:"rgba(0,0,0,0.7)", backdropFilter:"blur(4px)" }}>
      <div className="w-full max-w-sm bg-[#0f111a] border border-white/10 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-white font-bold text-base mb-5">Add Course</h3>
        <div className="space-y-3 mb-5">
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Course title"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/25 outline-none focus:border-violet-500/40" />
          <input value={platform} onChange={e=>setPlatform(e.target.value)} placeholder="Platform (e.g. Udemy)"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/25 outline-none focus:border-violet-500/40" />
          <input value={total} onChange={e=>setTotal(e.target.value)} placeholder="Total modules" type="number" min="1"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/25 outline-none focus:border-violet-500/40" />
          <div>
            <p className="text-[10px] text-white/25 uppercase tracking-widest mb-2">Color</p>
            <div className="flex gap-2">
              {COLORS.map((c, i) => (
                <button key={i} onClick={() => setColorIdx(i)}
                  className={`w-7 h-7 rounded-full bg-gradient-to-br ${c.color} transition-all ${colorIdx===i?"ring-2 ring-white/40 scale-110":""}`} />
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm text-white/35 border border-white/10 hover:border-white/20 transition-all">Cancel</button>
          <button onClick={submit} disabled={!title.trim()} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-emerald-500 disabled:opacity-40">Add Course</button>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function Learning({setActive}) {
  const { parsed, ats, step } = useResumeState();
  const {
    courses, tasks, streak, hoursLearned, planGenerated, hydrated,
    addCourse, updateCourse, removeCourse,
    toggleTask, addTask, removeTask,
    seedPlan,
  } = useLearningState();

  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showAddTask,   setShowAddTask]   = useState(false);
  const [newTask,       setNewTask]       = useState("");
  const [showPlan,      setShowPlan]      = useState(false);

  const hasResume  = step !== "upload" && parsed;
  const skillCircles = buildSkillCircles(ats, parsed);

  // Derived stats
  const activeCourses    = courses.filter(c => c.status === "active" || c.status === "not_started");
  const completedCourses = courses.filter(c => c.status === "completed");
  const tasksCompleted   = tasks.filter(t => t.done).length;
  const taskTotal        = tasks.length;

  const statsCards = [
    { value: String(completedCourses.length || 0), label:"Courses Completed", icon:"🎓", text:"text-violet-400", bg:"bg-violet-500/10", border:"border-violet-500/20" },
    { value: `${Math.round(hoursLearned)}h`,        label:"Hours Learned",    icon:"⏱️", text:"text-sky-400",    bg:"bg-sky-500/10",    border:"border-sky-500/20"    },
    { value: String(streak),                        label:"Day Streak",       icon:"🔥", text:"text-orange-400", bg:"bg-orange-500/10", border:"border-orange-500/20" },
    { value: String(activeCourses.length || 0),     label:"In Progress",      icon:"📖", text:"text-emerald-400",bg:"bg-emerald-500/10",border:"border-emerald-500/20"},
  ];

  if (!hydrated) return (
    <div className="min-h-screen bg-[#0b0d12] flex items-center justify-center">
      <div style={{ width:32,height:32,border:"2px solid rgba(255,255,255,0.1)",borderTop:"2px solid #a78bfa",borderRadius:"50%",animation:"spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b0d12] relative overflow-hidden px-4 py-14">
      {/* Orbs */}
      <div className="absolute -top-24 -right-16 w-[360px] h-[360px] rounded-full bg-violet-700 opacity-[0.09] blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-20 w-[320px] h-[320px] rounded-full bg-sky-700 opacity-[0.08] blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-[260px] h-[260px] rounded-full bg-emerald-700 opacity-[0.07] blur-3xl pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage:"radial-gradient(rgba(255,255,255,0.03) 1px,transparent 1px)", backgroundSize:"28px 28px" }} />

      {showAddCourse && (
        <AddCourseModal
          onAdd={course => addCourse(course)}
          onClose={() => setShowAddCourse(false)}
        />
      )}

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] tracking-widest uppercase text-white/30 font-medium mb-4">
              📚 Learning Hub
            </span>
            <h1 className="text-4xl font-black text-white tracking-tight">
              Learning{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-emerald-400">Tracker</span>
            </h1>
            <p className="mt-2 text-[13px] text-white/30 font-light">
              {hasResume
                ? `Personalised for ${parsed.fullName || "you"} · targeting ${ats?.roleMatch?.role || parsed.targetRole || "your role"}`
                : "Track your courses, daily tasks, and skill improvements."}
            </p>
          </div>

          {/* Resume link if not parsed */}
          {!hasResume && (
            <a onClick={()=> setActive("resume")} className="text-[11px] px-4 py-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-500/15 transition-colors">
              Upload resume for personalised plan →
            </a>
          )}
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-5">
          {statsCards.map((s, i) => (
            <div key={i} className={`rounded-2xl border ${s.border} ${s.bg} p-4 hover:-translate-y-0.5 transition-all duration-200`}>
              <span className="text-xl">{s.icon}</span>
              <p className={`text-2xl font-black ${s.text} leading-none mt-2`}>{s.value}</p>
              <p className="text-[11px] text-white/30 font-light mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Active Courses + Tasks ── */}
        <div className="flex gap-4 mb-4 flex-wrap lg:flex-nowrap">

          {/* Active Courses */}
          <div className="flex-[2] min-w-0 rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-pink-400" />
                <p className="text-[11px] text-white/40 uppercase tracking-widest font-semibold">Active Courses</p>
                <span className="text-[10px] text-white/20">{activeCourses.length}</span>
              </div>
              <button onClick={() => setShowAddCourse(true)}
                className="text-[11px] text-white/30 border border-white/10 px-2.5 py-1 rounded-lg hover:border-white/20 hover:text-white/50 transition-all">
                + Add
              </button>
            </div>

            {activeCourses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-white/20 text-sm mb-3">No courses yet</p>
                {hasResume && !planGenerated && (
                  <button onClick={() => seedPlan(ats, parsed)}
                    className="text-[12px] px-4 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-500/15 transition-colors">
                    ✦ Load suggested courses from your resume
                  </button>
                )}
                {!hasResume && (
                  <button onClick={() => setShowAddCourse(true)}
                    className="text-[12px] px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:border-white/20 transition-colors">
                    + Add your first course
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {activeCourses.map((c) => (
                  <div key={c.id} className="rounded-xl border border-white/6 bg-white/[0.015] p-4 hover:bg-white/[0.03] transition-all duration-200 group">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{c.icon}</span>
                        <p className="text-[13px] text-white font-semibold leading-tight">{c.title}</p>
                        {c.suggested && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400">AI pick</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <button
                          onClick={() => updateCourse(c.id, {
                            status: "active",
                            modules: Math.min((c.modules || 0) + 1, c.totalModules),
                            pct: Math.min(100, Math.round(((c.modules || 0) + 1) / c.totalModules * 100)),
                            last: "Today",
                          })}
                          className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border ${c.tagBg} ${c.tag}`}>
                          +1 Module
                        </button>
                        <button
                          onClick={() => updateCourse(c.id, { status:"completed", pct:100, modules:c.totalModules, last:"Today" })}
                          className="text-[10px] text-white/20 hover:text-emerald-400 transition-colors px-1 opacity-0 group-hover:opacity-100">✓</button>
                        <button onClick={() => removeCourse(c.id)}
                          className="text-[10px] text-white/20 hover:text-rose-400 transition-colors px-1 opacity-0 group-hover:opacity-100">✕</button>
                      </div>
                    </div>
                    <p className="text-[11px] text-white/30 mb-3 ml-6">{c.platform}</p>
                    <div className="flex justify-between text-[10px] text-white/30 mb-1.5">
                      <span>{c.modules || 0}/{c.totalModules} modules</span>
                      <span className={c.tag}>{c.pct || 0}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full bg-gradient-to-r ${c.color} transition-all duration-500`} style={{ width:`${c.pct || 0}%` }} />
                    </div>
                    {c.last && <p className="text-[10px] text-white/20 mt-2">Last accessed: {c.last}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Today's Tasks */}
          <div className="flex-1 min-w-[240px] rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <p className="text-[11px] text-white/40 uppercase tracking-widest font-semibold">Today's Tasks</p>
              </div>
              <button onClick={() => setShowAddTask(t => !t)}
                className="text-[11px] text-white/30 border border-white/10 px-2.5 py-1 rounded-lg hover:border-white/20 transition-all">
                + Add
              </button>
            </div>

            {showAddTask && (
              <div className="mb-3 flex gap-2">
                <input value={newTask} onChange={e=>setNewTask(e.target.value)}
                  onKeyDown={e=>{ if(e.key==="Enter"&&newTask.trim()){ addTask(newTask.trim()); setNewTask(""); setShowAddTask(false); }}}
                  placeholder="New task…"
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder:text-white/20 outline-none focus:border-amber-400/30" autoFocus />
                <button onClick={()=>{ if(newTask.trim()){ addTask(newTask.trim()); setNewTask(""); setShowAddTask(false); }}}
                  className="px-3 py-2 rounded-lg bg-amber-500/15 border border-amber-500/25 text-amber-400 text-xs">Add</button>
              </div>
            )}

            {tasks.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-white/20 text-sm mb-3">No tasks yet</p>
                {hasResume && !planGenerated && (
                  <button onClick={() => seedPlan(ats, parsed)}
                    className="text-[11px] px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    Load from resume
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2.5">
                {tasks.map((t) => (
                  <div key={t.id} className="flex items-start gap-2.5 group">
                    <button onClick={() => toggleTask(t.id)}
                      className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all duration-200
                        ${t.done ? "bg-emerald-400 border-emerald-400" : "border-white/20 hover:border-white/40"}`}>
                      {t.done && <span className="text-[8px] font-black text-black">✓</span>}
                    </button>
                    <span className={`flex-1 text-[12px] leading-snug transition-all ${t.done ? "text-white/25 line-through" : "text-white/60"}`}>
                      {t.text}
                    </span>
                    <button onClick={() => removeTask(t.id)}
                      className="text-[10px] text-white/15 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all">✕</button>
                  </div>
                ))}
              </div>
            )}

            {tasks.length > 0 && (
              <div className="mt-5 pt-3 border-t border-white/5">
                <p className="text-[10px] text-white/20">{tasksCompleted}/{taskTotal} completed</p>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden mt-1.5">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width:`${taskTotal ? (tasksCompleted/taskTotal)*100 : 0}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Skill Improvements (from resume) ── */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 mb-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-violet-400" />
            <p className="text-[11px] text-white/40 uppercase tracking-widest font-semibold">Skill Improvements</p>
            {hasResume && <span className="text-[10px] text-white/20 ml-auto">Based on your resume</span>}
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {skillCircles.map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="relative">
                  <CircleProgress pct={s.pct} color={s.color} track={s.track} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-black text-white">{s.pct}%</span>
                  </div>
                </div>
                <p className="text-[12px] text-white/70 font-semibold mt-2 truncate max-w-[90px]">{s.name}</p>
                <p className="text-[10px] text-emerald-400 mt-0.5">{s.imp}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Recently Completed ── */}
        {completedCourses.length > 0 && (
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 mb-4">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-teal-400" />
              <p className="text-[11px] text-white/40 uppercase tracking-widest font-semibold">Recently Completed</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {completedCourses.slice(0, 3).map((c) => (
                <div key={c.id} className={`rounded-xl border p-4 hover:-translate-y-0.5 transition-all duration-200 bg-gradient-to-br from-white/[0.02] to-transparent border-emerald-500/20`}>
                  <span className="text-xl block mb-2">{c.icon}</span>
                  <p className="text-[12px] text-white font-semibold leading-snug mb-1">{c.title}</p>
                  <p className="text-[10px] text-white/25">{c.platform} · Completed</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Generate Learning Plan CTA ── */}
        {!planGenerated && hasResume ? (
          <button
            onClick={() => { seedPlan(ats, parsed); setShowPlan(true); }}
            className="w-full py-3.5 rounded-xl font-semibold text-[13px] text-white bg-gradient-to-r from-violet-500 to-emerald-500 hover:shadow-xl hover:shadow-violet-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 tracking-wide">
            ✦ Generate Learning Plan from Resume
          </button>
        ) : planGenerated ? (
          <div className="w-full py-3 rounded-xl text-center text-[12px] text-emerald-400 border border-emerald-500/20 bg-emerald-500/5">
            ✅ Learning plan loaded from your resume · {activeCourses.length} courses suggested
          </div>
        ) : (
          <a onClick={()=> setActive("resume")}
            className="block w-full py-3.5 rounded-xl font-semibold text-[13px] text-white text-center bg-gradient-to-r from-violet-500 to-emerald-500 hover:shadow-xl hover:shadow-violet-500/20 hover:-translate-y-0.5 transition-all">
            ✦ Upload Resume to Generate Plan
          </a>
        )}

      </div>
    </div>
  );
}