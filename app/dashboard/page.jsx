"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const Icons = {
  Dashboard:  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} points="9 22 9 12 15 12 15 22"/></svg>,
  Resume:     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
  SkillGap:   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>,
  Roadmap:    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>,
  Interview:  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>,
  Jobs:       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
  Portfolio:  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>,
  Learning:   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>,
  Mentor:     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>,
  Settings:   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  Logout:     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>,
  Menu:       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>,
  Close:      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>,
};

const NAV_ITEMS = [
  { id: "dashboard",  label: "Dashboard",           icon: "Dashboard", emoji: "🏠" },
  { id: "resume",     label: "Resume Analyzer",     icon: "Resume",    emoji: "📄" },
  { id: "skillgap",   label: "Skill Gap Analysis",  icon: "SkillGap",  emoji: "📊" },
  { id: "roadmap",    label: "Career Roadmap",       icon: "Roadmap",   emoji: "🗺️" },
  { id: "interview",  label: "AI Mock Interview",   icon: "Interview", emoji: "🎤" },
  { id: "jobs",       label: "Job Recommendations", icon: "Jobs",      emoji: "💼" },
  { id: "portfolio",  label: "Portfolio Analyzer",  icon: "Portfolio", emoji: "🖼️" },
  { id: "learning",   label: "Learning Tracker",    icon: "Learning",  emoji: "📚" },
  { id: "mentor",     label: "AI Mentor Chat",      icon: "Mentor",    emoji: "🤖" },
];

// ── Coming Soon placeholder ────────────────────────────────────────────────
function ComingSoon({ label, emoji }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
      <span className="text-6xl">{emoji}</span>
      <h2 className="text-2xl font-bold text-white">{label}</h2>
      <p className="text-white/40 text-sm max-w-sm">
        This feature is coming soon. We&apos;re building something amazing!
      </p>
      <span className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
        Coming Soon
      </span>
    </div>
  );
}

// ── Dashboard Home ─────────────────────────────────────────────────────────
function DashboardHome({ user, setActive }) {
  const CARDS = [
    { id: "resume",    label: "Resume Analyzer",     desc: "AI feedback on your resume",           emoji: "📄", color: "from-blue-500/20 to-transparent",    border: "border-blue-500/20" },
    { id: "skillgap",  label: "Skill Gap Analysis",  desc: "Find missing skills for target role",   emoji: "📊", color: "from-purple-500/20 to-transparent",  border: "border-purple-500/20" },
    { id: "roadmap",   label: "Career Roadmap",      desc: "Your personalized step-by-step plan",   emoji: "🗺️", color: "from-green-500/20 to-transparent",   border: "border-green-500/20" },
    { id: "interview", label: "AI Mock Interview",   desc: "Practice AI-powered interviews",        emoji: "🎤", color: "from-orange-500/20 to-transparent",  border: "border-orange-500/20" },
    { id: "jobs",      label: "Job Recommendations", desc: "Curated jobs matching your profile",    emoji: "💼", color: "from-pink-500/20 to-transparent",    border: "border-pink-500/20" },
    { id: "portfolio", label: "Portfolio Analyzer",  desc: "Analyze and improve your portfolio",    emoji: "🖼️", color: "from-cyan-500/20 to-transparent",    border: "border-cyan-500/20" },
    { id: "learning",  label: "Learning Tracker",    desc: "Track your learning progress",          emoji: "📚", color: "from-yellow-500/20 to-transparent",  border: "border-yellow-500/20" },
    { id: "mentor",    label: "AI Mentor Chat",      desc: "Chat with your AI career mentor",       emoji: "🤖", color: "from-red-500/20 to-transparent",     border: "border-red-500/20" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600/20 to-purple-600/10 border border-blue-500/20 p-6">
        <h2 className="text-2xl font-bold text-white">
          Hey {user?.fullName?.split(" ")[0] || "there"} 👋
        </h2>
        <p className="text-white/50 mt-1 text-sm">
          Target: <span className="text-blue-400 font-medium">{user?.targetRole || "Not set"}</span>
          &nbsp;·&nbsp;
          Skills: <span className="text-purple-400 font-medium">{user?.skills?.length || 0}</span>
          &nbsp;·&nbsp;
          Experience: <span className="text-green-400 font-medium">{user?.experience || "—"}</span>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Skills",    value: user?.skills?.length || 0,    color: "text-blue-400" },
          { label: "Interests", value: user?.interests?.length || 0, color: "text-purple-400" },
          { label: "CGPA",      value: user?.cgpa || "—",            color: "text-green-400" },
          { label: "Degree",    value: user?.degree || "—",          color: "text-orange-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-white/30 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Cards */}
      <div>
        <p className="text-white/25 text-xs font-semibold uppercase tracking-widest mb-4">AI Tools</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {CARDS.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`text-left p-5 rounded-2xl border bg-gradient-to-br ${c.color} ${c.border} hover:scale-[1.02] hover:brightness-110 transition-all duration-200 space-y-2`}
            >
              <span className="text-2xl">{c.emoji}</span>
              <p className="text-white font-semibold text-sm">{c.label}</p>
              <p className="text-white/40 text-xs leading-relaxed">{c.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Settings ───────────────────────────────────────────────────────────────
function SettingsSection({ user }) {
  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Settings</h2>
        <p className="text-white/40 text-sm">Manage your account preferences</p>
      </div>
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 space-y-4">
        <h3 className="text-white font-semibold text-sm">Account Info</h3>
        {[
          { label: "Email",       value: user?.email },
          { label: "Full Name",   value: user?.fullName },
          { label: "Target Role", value: user?.targetRole },
          { label: "College",     value: user?.college },
        ].map((row) => (
          <div key={row.label} className="flex justify-between items-center py-2 border-b border-white/[0.04] last:border-0">
            <span className="text-white/30 text-sm">{row.label}</span>
            <span className="text-white text-sm">{row.value || "—"}</span>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 space-y-3">
        <h3 className="text-white font-semibold text-sm">Danger Zone</h3>
        <button className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition">
          Delete Account
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════════════
export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser]       = useState(null);
  const [active, setActive]   = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/users/me")
      .then(res => setUser(res.data.data))
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await axios.get("/api/users/logout");
    router.push("/login");
  };

  const renderContent = () => {
    switch (active) {
      case "dashboard": return <DashboardHome user={user} setActive={setActive} />;
      case "settings":  return <SettingsSection user={user} />;
      default: {
        const item = NAV_ITEMS.find(n => n.id === active);
        return <ComingSoon label={item?.label || active} emoji={item?.emoji || "🚧"} />;
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#080b12] flex items-center justify-center">
      <span className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const activeLabel = active === "settings"
    ? "Settings"
    : NAV_ITEMS.find(n => n.id === active)?.label || "Dashboard";

  return (
    <div className="min-h-screen bg-[#080b12] flex overflow-hidden">

      {/* Mobile overlay */}
      {!collapsed && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setCollapsed(true)} />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`fixed top-0 left-0 h-screen z-30 flex flex-col bg-[#0c0e1a] border-r border-white/[0.05] transition-all duration-300 ${collapsed ? "w-[68px]" : "w-[240px]"}`}>

        {/* Logo + toggle */}
        <div className={`flex items-center px-4 py-5 border-b border-white/[0.05] ${collapsed ? "justify-center" : "justify-between"}`}>
          {!collapsed && <span className="text-white font-bold text-base">Uplyft <span className="text-blue-400">AI</span></span>}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-lg text-white/25 hover:text-white hover:bg-white/[0.06] transition">
            {collapsed ? Icons.Menu : Icons.Close}
          </button>
        </div>

        {/* User */}
        <div
          onClick={() => router.push(`/profile/${user?._id}`)}
          title={collapsed ? user?.fullName : ""}
          className={`flex items-center gap-3 px-4 py-4 border-b border-white/[0.05] cursor-pointer hover:bg-white/[0.03] transition ${collapsed ? "justify-center" : ""}`}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-white text-xs font-semibold truncate">{user?.fullName}</p>
              <p className="text-white/25 text-[11px] truncate">{user?.email}</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                title={collapsed ? item.label : ""}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group
                  ${isActive ? "bg-blue-500/15 text-blue-400 font-semibold border border-blue-500/20" : "text-white/40 hover:text-white hover:bg-white/[0.05] font-medium"}
                  ${collapsed ? "justify-center" : ""}`}
              >
                <span className={`flex-shrink-0 ${isActive ? "text-blue-400" : "text-white/25 group-hover:text-white/60"}`}>
                  {Icons[item.icon]}
                </span>
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-2 pb-3 pt-2 border-t border-white/[0.05] space-y-0.5">
          <button
            onClick={() => setActive("settings")}
            title={collapsed ? "Settings" : ""}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
              ${active === "settings" ? "bg-blue-500/15 text-blue-400 border border-blue-500/20" : "text-white/40 hover:text-white hover:bg-white/[0.05]"}
              ${collapsed ? "justify-center" : ""}`}
          >
            <span className={active === "settings" ? "text-blue-400" : "text-white/25"}>{Icons.Settings}</span>
            {!collapsed && <span className="flex-1 text-left">Settings</span>}
          </button>

          <button
            onClick={handleLogout}
            title={collapsed ? "Logout" : ""}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400/50 hover:text-red-400 hover:bg-red-400/[0.07] transition-all ${collapsed ? "justify-center" : ""}`}
          >
            {Icons.Logout}
            {!collapsed && <span className="flex-1 text-left">Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${collapsed ? "ml-[68px]" : "ml-[240px]"}`}>

        {/* Topbar */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[#080b12]/90 backdrop-blur-md border-b border-white/[0.05]">
          <div>
            <h1 className="text-white font-bold text-lg">{activeLabel}</h1>
            <p className="text-white/20 text-xs mt-0.5">Welcome back, {user?.fullName?.split(" ")[0]} 👋</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/profile/${user?._id}`)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/[0.07] hover:border-white/20 hover:bg-white/[0.04] transition text-white/40 hover:text-white text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <span className="hidden sm:inline text-xs">Profile</span>
            </button>
            <div
              onClick={() => router.push(`/profile/${user?._id}`)}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer"
            >
              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}