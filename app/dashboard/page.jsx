"use client";
import { useState, useEffect } from "react";
import { useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import axios from "axios";
import Resume from "@/app/dashboard/resume"
import SkillGap from "@/app/dashboard/skillgap"
import Roadmap from "@/app/dashboard/roadmap";
import Dashboard from "@/app/dashboard/dashboard";
import Interview from "@/app/dashboard/interview"
import Jobs from "@/app/dashboard/jobs"
import Portfolio from "@/app/dashboard/portfolio";
import Learning from "@/app/dashboard/learning";
import Mentor from "@/app/dashboard/mentor";
import Settings from "@/app/dashboard/settings";

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




<>
<Dashboard/>

<Resume />

<SkillGap/>

<Roadmap/>

<Interview/>

<Jobs/>

<Portfolio/>

<Learning/>

<Mentor/>

<Settings/>

</>


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



    const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState("dark");
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifRef = useRef();
  const profileRef = useRef();

  // Close popouts on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const notifications = [
    { icon: "🤖", title: "AI Mentor replied",        desc: "Your career question was answered",   time: "2m ago",  unread: true },
    { icon: "📄", title: "Resume analyzed",           desc: "Your ATS score is ready to view",     time: "1h ago",  unread: true },
    { icon: "🎯", title: "Skill gap updated",         desc: "3 new skills added to your roadmap",  time: "3h ago",  unread: false },
    { icon: "🔔", title: "Interview reminder",        desc: "Mock interview scheduled for tomorrow",time: "1d ago",  unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  // ── ORIGINAL BACKEND CODE (untouched) ──
  useEffect(() => {
    axios.get("/api/users/me")
      .then(res => setUser(res.data.data))
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, []);

  return (
    // ── Outer wrapper — relative position base
    <div className="relative min-h-screen flex overflow-hidden bg-black">

      {/* ── SPLINE — fixed, poori screen pe, sabse neeche z-0 ── */}
      <div className="fixed inset-0 z-0 pointer-events-none translate-x-[8%]">
  <Spline
        scene="https://prod.spline.design/8d3KHxkReUNnmBVL/scene.splinecode" 
      />
</div>

      {/* ── SIDEBAR ── */}
<aside className="fixed z-10 w-[270px] min-h-screen flex flex-col border-r border-white/[0.08] bg-[#0b0d12]/95 backdrop-blur-md overflow-hidden">

  {/* ── Background orbs inside sidebar ── */}
  <div className="absolute -top-20 -left-10 w-48 h-48 bg-violet-700 rounded-full opacity-20 blur-3xl pointer-events-none" />
  <div className="absolute bottom-20 -right-10 w-40 h-40 bg-sky-700 rounded-full opacity-20 blur-3xl pointer-events-none" />

  {/* ── Dot grid ── */}
  <div className="absolute inset-0 pointer-events-none"
    style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

  <div className="relative z-10 flex flex-col h-screen p-4">

    {/* ── Logo ── */}
    <div className="mb-6 px-1">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 overflow-hidden border border-violet-500/30 bg-violet-500/10">
          <img className="w-full h-full object-cover" src="/uplyft.svg" alt="Uplyft" />
        </div>
        <div>
          <span className="text-white font-black text-base tracking-tight font-serif">Uplyft</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-sky-400 font-black text-base font-serif"> AI</span>
          <p className="text-white/20 text-[9px] uppercase tracking-widest -mt-0.5">Career Platform</p>
        </div>
      </div>
      {/* Rainbow divider */}
      <div className="mt-4 h-[1px] w-full rounded-full opacity-30"
        style={{ background: "linear-gradient(to right, #a78bfa, #38bdf8, #34d399, #f43f5e)" }} />
    </div>

    {/* ── Nav label ── */}
    <p className="text-[9px] text-white/20 uppercase tracking-widest px-2 mb-2">Navigation</p>

    {/* ── Nav Items ── */}
    <nav className="flex-1 space-y-1 overflow-y-auto">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => setActive(item.id)}
          className={`relative w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200 overflow-hidden group
            ${active === item.id
              ? "bg-gradient-to-r from-violet-500/20 to-sky-500/10 border border-violet-400/25 text-white font-semibold"
              : "text-white/40 hover:text-white/70 hover:bg-white/[0.04] border border-transparent"
            }`}
        >
          {/* Active left bar */}
          {active === item.id && (
            <div className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full bg-gradient-to-b from-violet-400 to-sky-400" />
          )}
          <span className="pl-1">{item.label}</span>
        </button>
      ))}
    </nav>

    {/* ── Bottom section ── */}
    <div className="mt-4">
      {/* Divider */}
      <div className="h-[1px] w-full rounded-full opacity-20 mb-4"
        style={{ background: "linear-gradient(to right, #a78bfa, #38bdf8)" }} />

      {/* ── User Profile Card ── */}
      <div className="relative rounded-2xl border border-violet-500/20 bg-violet-500/5 p-3 overflow-hidden">
        {/* Top accent */}
        <div className="absolute top-0 left-3 right-3 h-[1.5px] rounded-full bg-gradient-to-r from-violet-400 to-sky-400 opacity-60" />

        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white shrink-0"
            style={{ background: "linear-gradient(135deg, #a78bfa, #38bdf8)" }}>
            {user?.fullName?.[0]?.toUpperCase() || "U"}
          </div>

          {/* Name + email */}
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">
              {user?.fullName || "User"}
            </p>
            <p className="text-white/30 text-[10px] truncate">
              {user?.email || "user@example.com"}
            </p>
          </div>

          {/* Logout button */}
          <button
            onClick={() => router.push("/logout")}
            title="Logout"
            className="w-7 h-7 rounded-lg flex items-center justify-center border border-white/10 bg-white/5 text-white/30 hover:text-rose-400 hover:border-rose-400/30 hover:bg-rose-400/10 transition-all duration-200 shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>

        {/* Pro badge */}
        <div className="mt-2.5 flex items-center gap-1.5">
          <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-violet-400 to-sky-400" />
          </div>
          <span className="text-[9px] px-2 py-0.5 rounded-full border border-violet-400/30 bg-violet-400/10 text-violet-400 font-semibold uppercase tracking-wider">Pro</span>
        </div>
      </div>

      <p className="text-center text-white/10 text-[9px] mt-3 tracking-widest uppercase">Uplyft AI · v1.0</p>
    </div>

  </div>
</aside>

      {/* ── MAIN CONTENT — z-10 pe, Spline ke upar ── */}
      <main className="relative z-10 ml-65 flex-1 pl-2">


    <nav className="sticky top-0 z-50 flex justify-between items-center px-5 py-3 border-b border-white/[0.06] bg-[#0b0d12]/90 backdrop-blur-md">

      {/* Subtle top rainbow line */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] opacity-30"
        style={{ background: "linear-gradient(to right, #f43f5e, #38bdf8, #a78bfa, #34d399)" }} />

      {/* ── Search ── */}
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 text-sm">🔍</span>
        <input
          className="bg-white/5 border border-white/10 focus:border-violet-400/40 outline-none text-white text-sm placeholder-white/20 pl-9 pr-4 py-2.5 rounded-xl w-72 transition-all"
          type="text"
          placeholder="Search anything..."
        />
      </div>

      {/* ── Right side ── */}
      <div className="flex items-center gap-2">

        {/* ── Theme toggle ── */}
        <button
          onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
          className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:border-violet-400/40 hover:bg-violet-500/10 flex items-center justify-center transition-all duration-200 text-base"
          title="Toggle theme"
        >
          {theme === "dark" ? "🌙" : "☀️"}
        </button>

        {/* ── Notification bell ── */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setShowNotif(v => !v); setShowProfile(false); }}
            className="relative w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:border-sky-400/40 hover:bg-sky-500/10 flex items-center justify-center transition-all duration-200 text-base"
            title="Notifications"
          >
            🔔
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-[#0b0d12]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification popout */}
          {showNotif && (
            <div className="absolute right-0 top-12 w-80 rounded-2xl border border-white/[0.08] bg-[#0d0f14] shadow-2xl shadow-black/60 z-[999] overflow-hidden">
              {/* Top accent */}
              <div className="h-[2px] w-full bg-gradient-to-r from-sky-400 to-violet-400" />
              <div className="p-4 border-b border-white/[0.06] flex justify-between items-center">
                <p className="text-white text-sm font-semibold">Notifications</p>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/20 text-sky-400 font-semibold">
                  {unreadCount} new
                </span>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {notifications.map((n, i) => (
                  <div key={i} className={`flex gap-3 px-4 py-3 hover:bg-white/[0.03] transition-all cursor-pointer ${n.unread ? "bg-white/[0.02]" : ""}`}>
                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-sm shrink-0">
                      {n.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <p className={`text-sm font-medium truncate ${n.unread ? "text-white" : "text-white/50"}`}>{n.title}</p>
                        {n.unread && <div className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 mt-1.5" />}
                      </div>
                      <p className="text-white/30 text-xs mt-0.5 truncate">{n.desc}</p>
                      <p className="text-white/20 text-[10px] mt-1">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-white/[0.06]">
                <button className="w-full text-center text-[11px] text-sky-400 hover:text-sky-300 transition-colors py-1">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Profile ── */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setShowProfile(v => !v); setShowNotif(false); }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-white/10 hover:border-violet-400/30 hover:bg-violet-500/5 transition-all duration-200"
          >
            {/* Avatar */}
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0"
              style={{ background: "linear-gradient(135deg, #a78bfa, #38bdf8)" }}>
              {user?.fullName?.[0]?.toUpperCase() || "U"}
            </div>
            <p className="text-white text-xs font-semibold truncate max-w-[80px]">
              {user?.fullName || "User"}
            </p>
            {/* Down arrow — rotates when open */}
            <span className={`text-white/30 text-[10px] transition-transform duration-200 ${showProfile ? "rotate-180" : ""}`}>
              ▾
            </span>
          </button>

          {/* Profile popout */}
          {showProfile && (
            <div className="absolute right-0 top-12 w-56 rounded-2xl border border-white/[0.08] bg-[#0d0f14] shadow-2xl shadow-black/60 z-[999] overflow-hidden">
              {/* Top accent */}
              <div className="h-[2px] w-full bg-gradient-to-r from-violet-400 to-sky-400" />

              {/* User info */}
              <div className="px-4 py-3.5 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white shrink-0"
                    style={{ background: "linear-gradient(135deg, #a78bfa, #38bdf8)" }}>
                    {user?.fullName?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{user?.fullName || "User"}</p>
                    <p className="text-white/30 text-[11px] truncate">{user?.email || "user@email.com"}</p>
                  </div>
                </div>
                <div className="mt-2.5 flex items-center gap-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/20 text-violet-400 font-semibold">Pro Plan</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 font-semibold">Active</span>
                </div>
              </div>

              {/* Menu items */}
              <div className="p-2">
                {[
                  { icon: "👤", label: "My Profile",  color: "hover:text-sky-400    hover:bg-sky-500/8    hover:border-sky-500/15" },
                  { icon: "⚙️", label: "Settings",    color: "hover:text-violet-400 hover:bg-violet-500/8 hover:border-violet-500/15" },
                  { icon: "💳", label: "Billing",     color: "hover:text-emerald-400 hover:bg-emerald-500/8 hover:border-emerald-500/15" },
                  { icon: "❓", label: "Help & FAQ",  color: "hover:text-amber-400  hover:bg-amber-500/8  hover:border-amber-500/15" },
                ].map((item, i) => (
                  <button key={i}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-white/40 border border-transparent transition-all duration-150 ${item.color}`}>
                    <span>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Logout */}
              <div className="p-2 pt-0 border-t border-white/[0.06]">
                <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-rose-400/60 border border-transparent hover:text-rose-400 hover:bg-rose-500/8 hover:border-rose-500/15 transition-all duration-150">
                  <span>🚪</span>
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </nav>
        {renderContent()}
      </main>

    </div>
  );
}
