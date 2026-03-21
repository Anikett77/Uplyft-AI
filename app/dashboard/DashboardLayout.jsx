"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import Link from "next/link";

// ── Icons ──────────────────────────────────────────────────────────────────
const Icons = {
  Dashboard:    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} points="9 22 9 12 15 12 15 22"/></svg>,
  Resume:       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
  SkillGap:     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>,
  Roadmap:      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>,
  Interview:    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>,
  Jobs:         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
  Portfolio:    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>,
  Learning:     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>,
  Mentor:       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>,
  Settings:     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  Logout:       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>,
  Menu:         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>,
  Close:        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>,
  User:         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>,
};

// ── Nav Items ──────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "Dashboard",         icon: "Dashboard",  href: "/dashboard" },
  { label: "Resume Analyzer",   icon: "Resume",     href: "/dashboard/resume" },
  { label: "Skill Gap Analysis",icon: "SkillGap",   href: "/dashboard/skill-gap" },
  { label: "Career Roadmap",    icon: "Roadmap",    href: "/dashboard/roadmap" },
  { label: "AI Mock Interview", icon: "Interview",  href: "/dashboard/interview" },
  { label: "Job Recommendations",icon: "Jobs",      href: "/dashboard/jobs" },
  { label: "Portfolio Analyzer",icon: "Portfolio",  href: "/dashboard/portfolio" },
  { label: "Learning Tracker",  icon: "Learning",   href: "/dashboard/learning" },
  { label: "AI Mentor Chat",    icon: "Mentor",     href: "/dashboard/mentor" },
];

// ── Sidebar Component ──────────────────────────────────────────────────────
function Sidebar({ user, collapsed, setCollapsed, activeHref }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.get("/api/users/logout");
      router.push("/login");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-screen z-30 flex flex-col
        bg-[#0f0f17] border-r border-white/8
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-[70px]" : "w-[240px]"}
      `}>

        {/* ── Logo + Toggle ── */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-white/8">
          {!collapsed && (
            <span className="text-white font-bold text-lg tracking-tight">
              Uplyft <span className="text-blue-400">AI</span>
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition ml-auto"
          >
            {collapsed ? Icons.Menu : Icons.Close}
          </button>
        </div>

        {/* ── User Profile ── */}
        <div className={`flex items-center gap-3 px-4 py-4 border-b border-white/8 ${collapsed ? "justify-center" : ""}`}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-white text-sm font-medium truncate">{user?.fullName || "User"}</p>
              <p className="text-white/40 text-xs truncate">{user?.email}</p>
            </div>
          )}
        </div>

        {/* ── Nav Items ── */}
        <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">
          {NAV_ITEMS.map((item) => {
            const isActive = activeHref === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : ""}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-150 group relative
                  ${isActive
                    ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                    : "text-white/50 hover:text-white hover:bg-white/8"
                  }
                  ${collapsed ? "justify-center" : ""}
                `}
              >
                <span className={`flex-shrink-0 ${isActive ? "text-blue-400" : "text-white/40 group-hover:text-white"}`}>
                  {Icons[item.icon]}
                </span>
                {!collapsed && <span>{item.label}</span>}

                {/* Active indicator */}
                {isActive && !collapsed && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Bottom — Settings + Logout ── */}
        <div className="px-2 pb-4 space-y-0.5 border-t border-white/8 pt-3">
          <Link
            href="/dashboard/settings"
            title={collapsed ? "Settings" : ""}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
              text-white/50 hover:text-white hover:bg-white/8 transition-all
              ${collapsed ? "justify-center" : ""}
            `}
          >
            <span className="text-white/40">{Icons.Settings}</span>
            {!collapsed && <span>Settings</span>}
          </Link>

          <button
            onClick={handleLogout}
            title={collapsed ? "Logout" : ""}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
              text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-all
              ${collapsed ? "justify-center" : ""}
            `}
          >
            <span>{Icons.Logout}</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

// ── Main Dashboard Layout ──────────────────────────────────────────────────
export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/users/me");
        setUser(res.data.data);
      } catch {
        router.push("/login");
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-[#080b12] flex">

      {/* Sidebar */}
      <Sidebar
        user={user}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        activeHref={pathname}
      />

      {/* Main content area */}
      <main className={`
        flex-1 min-h-screen flex flex-col
        transition-all duration-300
        ${collapsed ? "ml-[70px]" : "ml-[240px]"}
      `}>

        {/* ── Top bar ── */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[#080b12]/80 backdrop-blur-md border-b border-white/8">
          <div>
            <h1 className="text-white font-semibold text-lg">
              {NAV_ITEMS.find(n => n.href === pathname)?.label || "Dashboard"}
            </h1>
            <p className="text-white/30 text-xs mt-0.5">
              Welcome back, {user?.fullName?.split(" ")[0] || "there"} 👋
            </p>
          </div>

          {/* Right side — profile avatar */}
          <div className="flex items-center gap-3">
            <Link
              href={`/profile/${user?._id}`}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition text-white/60 hover:text-white text-sm"
            >
              {Icons.User}
              <span className="hidden sm:inline">Profile</span>
            </Link>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold cursor-pointer"
              onClick={() => router.push(`/profile/${user?._id}`)}>
              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </div>
        </header>

        {/* ── Page content ── */}
        <div className="flex-1 p-6">
          {children}
        </div>

      </main>
    </div>
  );
}