"use client";
import { useState } from "react";
import { useGithubState } from "@/hooks/useGithubState";

// ── Language → color map ────────────────────────────────────────────────
const LANG_COLORS = {
  TypeScript:  { color:"from-blue-400 to-blue-600",      dot:"bg-blue-400"    },
  JavaScript:  { color:"from-yellow-400 to-amber-500",   dot:"bg-yellow-400"  },
  Python:      { color:"from-green-400 to-emerald-500",  dot:"bg-green-400"   },
  CSS:         { color:"from-pink-400 to-rose-500",      dot:"bg-pink-400"    },
  Go:          { color:"from-cyan-400 to-teal-500",      dot:"bg-cyan-400"    },
  Rust:        { color:"from-orange-400 to-red-500",     dot:"bg-orange-400"  },
  Java:        { color:"from-red-400 to-orange-600",     dot:"bg-red-400"     },
  "C++":       { color:"from-indigo-400 to-blue-500",    dot:"bg-indigo-400"  },
  "C#":        { color:"from-violet-400 to-purple-500",  dot:"bg-violet-400"  },
  Ruby:        { color:"from-rose-500 to-red-600",       dot:"bg-rose-500"    },
  Swift:       { color:"from-orange-500 to-amber-400",   dot:"bg-orange-500"  },
  Kotlin:      { color:"from-purple-400 to-violet-600",  dot:"bg-purple-400"  },
  Shell:       { color:"from-slate-400 to-gray-500",     dot:"bg-slate-400"   },
  HTML:        { color:"from-orange-400 to-red-400",     dot:"bg-orange-400"  },
  Vue:         { color:"from-emerald-400 to-green-500",  dot:"bg-emerald-400" },
  Dart:        { color:"from-sky-300 to-blue-400",       dot:"bg-sky-300"     },
  Unknown:     { color:"from-gray-400 to-slate-500",     dot:"bg-gray-400"    },
};
const langStyle = (name) => LANG_COLORS[name] || LANG_COLORS.Unknown;

// Project icon based on language/name
const projectIcon = (name, lang) => {
  if (name.includes("auth") || name.includes("login")) return "🔐";
  if (name.includes("ui") || name.includes("component") || name.includes("design")) return "🎨";
  if (name.includes("ml") || name.includes("ai") || name.includes("model")) return "🧠";
  if (name.includes("api") || name.includes("server") || name.includes("backend")) return "🛠️";
  if (name.includes("bot")) return "🤖";
  if (lang === "Python") return "🐍";
  if (lang === "Go") return "🔵";
  if (lang === "Rust") return "⚙️";
  return "⚡";
};

const PROJECT_COLORS = [
  "from-sky-500 to-blue-600",
  "from-violet-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-500",
  "from-cyan-500 to-sky-500",
];

const fmt = (n) => n >= 1000 ? `${(n/1000).toFixed(1)}k` : String(n);

const timeAgo = (iso) => {
  const diff = Date.now() - new Date(iso);
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "today";
  if (d === 1) return "yesterday";
  if (d < 30) return `${d}d ago`;
  if (d < 365) return `${Math.floor(d/30)}mo ago`;
  return `${Math.floor(d/365)}y ago`;
};

const Blobs = () => (
  <>
    <div className="absolute -top-28 -left-20 w-[380px] h-[380px] rounded-full bg-sky-700 opacity-[0.09] blur-3xl pointer-events-none" />
    <div className="absolute top-1/3 -right-20 w-[320px] h-[320px] rounded-full bg-violet-700 opacity-[0.09] blur-3xl pointer-events-none" />
    <div className="absolute -bottom-20 left-1/3 w-[300px] h-[300px] rounded-full bg-emerald-700 opacity-[0.08] blur-3xl pointer-events-none" />
    <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage:"radial-gradient(rgba(255,255,255,0.03) 1px,transparent 1px)", backgroundSize:"28px 28px" }} />
  </>
);

// ── Connect screen ───────────────────────────────────────────────────────
function ConnectScreen({ onConnect }) {
  const [input, setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const submit = async () => {
    const u = input.trim().replace(/^@/, "");
    if (!u) return;
    setLoading(true);
    setError("");
    try {
      const res  = await fetch(`/api/github-analyze?username=${encodeURIComponent(u)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to fetch");
      onConnect(u, json);
    } catch(e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0d12] relative overflow-hidden flex items-center justify-center px-4">
      <Blobs />
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mx-auto mb-5">🐙</div>
          <h1 className="text-3xl font-black text-white mb-2">
            Portfolio{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-violet-400">Analyzer</span>
          </h1>
          <p className="text-white/30 text-sm">Enter your GitHub username to analyse your repos, languages, and code quality.</p>
        </div>

        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
          <label className="block text-[11px] text-white/35 uppercase tracking-widest mb-2">GitHub Username</label>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-sky-500/40 transition-colors">
              <span className="text-white/20 text-sm select-none">github.com/</span>
              <input
                value={input}
                onChange={e => { setInput(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && submit()}
                placeholder="yourusername"
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/20"
                autoFocus
              />
            </div>
            <button
              onClick={submit}
              disabled={loading || !input.trim()}
              className="px-5 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-sky-500 to-violet-500 disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              {loading ? "…" : "Analyze"}
            </button>
          </div>

          {error && <p className="mt-3 text-rose-400 text-[12px]">{error}</p>}

          {loading && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                <span className="text-white/30 text-[11px]">Fetching repositories…</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-sky-500 to-violet-500 rounded-full animate-pulse" style={{ width:"60%" }} />
              </div>
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-[11px] text-white/15">Only public repositories are analysed · No auth required</p>
      </div>
    </div>
  );
}

// ── Main dashboard ────────────────────────────────────────────────────────
export default function Portfolio() {
  const { username, data, fetchedAt, save, clear, hydrated } = useGithubState();
  const [hoveredProject, setHoveredProject] = useState(null);
  const [refreshing, setRefreshing]         = useState(false);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[#0b0d12] flex items-center justify-center">
        <div style={{ width:32,height:32,border:"2px solid rgba(255,255,255,0.1)",borderTop:"2px solid #38bdf8",borderRadius:"50%",animation:"spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!data) {
    return (
      <ConnectScreen onConnect={(u, d) => save({ username:u, data:d, fetchedAt: new Date().toISOString() })} />
    );
  }

  const { profile, stats, languages, topProjects, qualityMetrics, recentActivity } = data;

  const refresh = async () => {
    setRefreshing(true);
    try {
      const res  = await fetch(`/api/github-analyze?username=${encodeURIComponent(username)}`);
      const json = await res.json();
      if (res.ok) save({ username, data:json, fetchedAt: new Date().toISOString() });
    } catch {}
    setRefreshing(false);
  };

  const statCards = [
    { value: fmt(stats.repos),          label:"Repositories", icon:"📁", text:"text-sky-400",     bg:"bg-sky-500/10",    border:"border-sky-500/20"    },
    { value: fmt(stats.stars),          label:"Total Stars",  icon:"⭐", text:"text-amber-400",   bg:"bg-amber-500/10",  border:"border-amber-500/20"   },
    { value: `${stats.overallQuality}%`,label:"Code Quality", icon:"✅", text:"text-emerald-400", bg:"bg-emerald-500/10",border:"border-emerald-500/20" },
    { value: fmt(stats.forks),          label:"Total Forks",  icon:"🔀", text:"text-violet-400",  bg:"bg-violet-500/10", border:"border-violet-500/20"  },
  ];

  return (
    <div className="min-h-screen bg-[#0b0d12] relative overflow-hidden px-4 py-14">
      <Blobs />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] tracking-widest uppercase text-white/30 font-medium mb-3">
              🐙 GitHub Connected
            </span>
            <h1 className="text-4xl font-black text-white tracking-tight">
              Portfolio{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-violet-400">Analyzer</span>
            </h1>
            <p className="mt-1 text-[13px] text-white/30 font-light">
              {profile.name} · {profile.followers} followers
              {fetchedAt && <span className="ml-2 opacity-50">· refreshed {timeAgo(fetchedAt)}</span>}
            </p>
          </div>

          {/* Profile + actions */}
          <div className="flex items-center gap-3">
            {profile.avatar && (
              <img src={profile.avatar} alt={profile.username}
                className="w-10 h-10 rounded-full border border-white/10 object-cover" />
            )}
            <div className="flex flex-col gap-1.5">
              <a href={profile.url} target="_blank" rel="noopener noreferrer"
                className="text-[11px] px-3 py-1.5 rounded-lg bg-white/5 border border-white/9 text-white/40 hover:text-white/70 transition-colors text-center">
                View on GitHub ↗
              </a>
              <button onClick={clear}
                className="text-[11px] px-3 py-1.5 rounded-lg bg-white/5 border border-white/9 text-white/25 hover:text-rose-400 transition-colors">
                Disconnect
              </button>
            </div>
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="mb-6 text-[13px] text-white/40 italic border-l-2 border-white/10 pl-3">{profile.bio}</p>
        )}

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-5">
          {statCards.map((s, i) => (
            <div key={i} className={`rounded-2xl border ${s.border} ${s.bg} p-4 flex flex-col gap-1 transition-all duration-200 hover:-translate-y-0.5`}>
              <span className="text-xl">{s.icon}</span>
              <p className={`text-2xl font-black ${s.text} leading-none mt-1`}>{s.value}</p>
              <p className="text-[11px] text-white/30 font-light">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Quality + Languages ── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">

          {/* Quality Metrics */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-sky-400" />
              <p className="text-[11px] text-white/40 uppercase tracking-widest font-semibold">Quality Signals</p>
            </div>
            <div className="space-y-4">
              {qualityMetrics.map((m, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[12px] text-white/60 font-medium">{m.name}</span>
                    <span className={`text-[11px] font-semibold ${m.score >= 70 ? "text-emerald-400" : m.score >= 40 ? "text-amber-400" : "text-rose-400"}`}>
                      {m.score}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${m.color} transition-all duration-700`} style={{ width:`${m.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-white/15 mt-5 pt-3 border-t border-white/5">Inferred from {stats.repos} public repos</p>
          </div>

          {/* Top Languages */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-violet-400" />
              <p className="text-[11px] text-white/40 uppercase tracking-widest font-semibold">Top Languages</p>
            </div>
            <div className="space-y-4">
              {languages.map((l, i) => {
                const s = langStyle(l.name);
                return (
                  <div key={i}>
                    <div className="flex justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        <span className="text-[12px] text-white/60 font-medium">{l.name}</span>
                      </div>
                      <span className="text-[11px] text-white/30">{l.score}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full bg-gradient-to-r ${s.color}`} style={{ width:`${l.score}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-white/15 mt-5 pt-3 border-t border-white/5">Across {stats.repos} repositories</p>
          </div>
        </div>

        {/* ── Top Projects ── */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 mb-4">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <p className="text-[11px] text-white/40 uppercase tracking-widest font-semibold">Top Projects</p>
            <span className="ml-auto text-[10px] text-white/20">{topProjects.length} repos</span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {topProjects.map((p, i) => {
              const ls = langStyle(p.lang);
              return (
                <a
                  key={i} href={p.url} target="_blank" rel="noopener noreferrer"
                  onMouseEnter={() => setHoveredProject(i)}
                  onMouseLeave={() => setHoveredProject(null)}
                  className={`rounded-xl border p-4 transition-all duration-200 block
                    ${hoveredProject === i ? "border-white/15 bg-white/5 -translate-y-0.5" : "border-white/6 bg-white/[0.015]"}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-lg">{projectIcon(p.name, p.lang)}</span>
                    <div className="flex items-center gap-2 text-[10px] text-white/30">
                      <span className="text-amber-400/70">⭐ {fmt(p.stars)}</span>
                      <span>🔀 {p.forks}</span>
                    </div>
                  </div>
                  <p className="text-white text-[12px] font-semibold mb-1 truncate">{p.name}</p>
                  {p.description && (
                    <p className="text-white/30 text-[11px] mb-2 line-clamp-2 leading-relaxed">{p.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${ls.dot}`} />
                      <span className="text-[11px] text-white/30">{p.lang}</span>
                    </div>
                    <span className="text-[10px] text-white/20">{timeAgo(p.updatedAt)}</span>
                  </div>
                  {p.topics?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {p.topics.slice(0, 3).map((t, j) => (
                        <span key={j} className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-white/25 border border-white/8">{t}</span>
                      ))}
                    </div>
                  )}
                </a>
              );
            })}
          </div>
        </div>

        {/* ── Recent Activity ── */}
        {recentActivity?.length > 0 && (
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-rose-400" />
              <p className="text-[11px] text-white/40 uppercase tracking-widest font-semibold">Recent Activity</p>
            </div>
            <div className="space-y-3">
              {recentActivity.map((e, i) => {
                const typeLabel = {
                  PushEvent:        { icon:"📤", label:"Pushed to" },
                  PullRequestEvent: { icon:"🔀", label:"PR on"     },
                  IssuesEvent:      { icon:"🐛", label:"Issue on"  },
                  WatchEvent:       { icon:"⭐", label:"Starred"   },
                  ForkEvent:        { icon:"🍴", label:"Forked"    },
                  CreateEvent:      { icon:"✨", label:"Created"   },
                }[e.type] || { icon:"⚡", label:"Activity on" };
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-base">{typeLabel.icon}</span>
                    <p className="text-[12px] text-white/45 flex-1">
                      <span className="text-white/25">{typeLabel.label} </span>
                      <span className="text-white/55 font-medium">{e.repo.split("/")[1] || e.repo}</span>
                    </p>
                    <span className="text-[10px] text-white/20">{timeAgo(e.date)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Refresh / CTA ── */}
        <button
          onClick={refresh}
          disabled={refreshing}
          className="w-full py-3.5 rounded-xl font-semibold text-[13px] text-white bg-gradient-to-r from-sky-500 to-violet-500 hover:shadow-xl hover:shadow-sky-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 tracking-wide disabled:opacity-50"
        >
          {refreshing ? "Refreshing…" : "↻ Refresh Analysis"}
        </button>

      </div>
    </div>
  );
}