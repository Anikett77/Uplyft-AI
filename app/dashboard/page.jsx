"use client";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import axios from "axios";

import Resume    from "@/app/dashboard/resume";
import SkillGap  from "@/app/dashboard/skillgap";
import Roadmap   from "@/app/dashboard/roadmap";
import Dashboard from "@/app/dashboard/dashboard";
import Interview from "@/app/dashboard/interview";
import Jobs      from "@/app/dashboard/jobs";
import Portfolio from "@/app/dashboard/portfolio";
import Learning  from "@/app/dashboard/learning";
import Mentor    from "@/app/dashboard/mentor";
import Settings  from "@/app/dashboard/settings";
import LogoutButton from "@/components/LogoutButton";
import { UserContext } from "@/app/context/UserContext";

const Spline = dynamic(() => import("@splinetool/react-spline"), { ssr: false });

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard",          icon: "⬛" },
  { id: "resume",    label: "Resume Analyzer",    icon: "📄" },
  { id: "skillgap",  label: "Skill Gap Analysis", icon: "📊" },
  { id: "roadmap",   label: "Career Roadmap",     icon: "🗺️" },
  { id: "interview", label: "AI Mock Interview",  icon: "🎙️" },
  { id: "jobs",      label: "Job Recommendations",icon: "💼" },
  { id: "portfolio", label: "Portfolio Analyzer", icon: "🐙" },
  { id: "learning",  label: "Learning Tracker",   icon: "📚" },
  { id: "mentor",    label: "AI Mentor Chat",     icon: "🤖" },
  { id: "settings",  label: "Settings",           icon: "⚙️" },
];

export default function App() {
  // ── default is resume ──
  const [active,       setActive]      = useState("resume");
  const [sidebarOpen,  setSidebarOpen] = useState(false);
const [user,    setUser]    = useState(null);
const [loading, setLoading] = useState(true); // ← add this line
  const [showNotif,    setShowNotif]   = useState(false);
  const [showProfile,  setShowProfile] = useState(false);
  

  const router     = useRef(useRouter()).current;
  const notifRef   = useRef();
  const profileRef = useRef();
  const sidebarRef = useRef();

// REPLACE WITH:
useEffect(() => {
  axios.get("/api/users/me")
    .then(res => setUser(res.data.data))
    .catch(() => { window.location.href = "/login"; })
    .finally(() => setLoading(false));
}, []);

  // Close popouts on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current   && !notifRef.current.contains(e.target))   setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
      // Close mobile sidebar on outside tap
      if (sidebarRef.current && !sidebarRef.current.contains(e.target) && sidebarOpen) setSidebarOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [sidebarOpen]);

  // Close sidebar on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setSidebarOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleSetActive = (id) => {
    setActive(id);
    setSidebarOpen(false);
    setShowProfile(false);
  };

  const notifications = [
    { icon:"🤖", title:"AI Mentor replied",   desc:"Your career question was answered",    time:"2m ago",  unread:true  },
    { icon:"📄", title:"Resume analyzed",      desc:"Your ATS score is ready to view",      time:"1h ago",  unread:true  },
    { icon:"🎯", title:"Skill gap updated",    desc:"3 new skills added to your roadmap",   time:"3h ago",  unread:false },
    { icon:"🔔", title:"Interview reminder",   desc:"Mock interview scheduled for tomorrow",time:"1d ago",  unread:false },
  ];
  const unreadCount = notifications.filter(n => n.unread).length;

  const renderContent = () => {
    switch (active) {
      case "dashboard": return <Dashboard setActive={setActive} />;
      case "resume":    return <Resume />;
      case "skillgap":  return <SkillGap setActive={setActive} />;
      case "roadmap":   return <Roadmap setActive={setActive} />;
      case "interview": return <Interview />;
      case "jobs":      return <Jobs />;
      case "portfolio": return <Portfolio />;
      case "learning":  return <Learning setActive={setActive} />;
      case "mentor":    return <Mentor />;
      case "settings":  return <Settings />;
      default:          return <Resume />;
    }
  };

  // ── Sidebar inner content (shared between desktop + mobile) ──
  const SidebarContent = () => (
    <div className="relative z-10 flex flex-col h-full p-4">

      {/* Logo */}
      <div className="mb-6 px-1">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10">
              <img className="w-15 h-15 object-cover object-centre" src="uplyft.svg" alt="" />
            </div>
          <div>
            <span className="text-white font-black text-base tracking-tight font-serif">Uplyft</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-sky-400 font-black text-base font-serif"> AI</span>
            <p className="text-white/20 text-[9px] uppercase tracking-widest -mt-0.5">Career Platform</p>
          </div>
        </div>
        <div className="mt-4 h-[1px] w-full rounded-full opacity-30"
          style={{ background:"linear-gradient(to right,#a78bfa,#38bdf8,#34d399,#f43f5e)" }} />
      </div>

      <p className="text-[9px] text-white/20 uppercase tracking-widest px-2 mb-2">Navigation</p>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-0.5">
        {NAV_ITEMS.map((item) => (
          <button key={item.id} onClick={() => handleSetActive(item.id)}
            className={`relative w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200 overflow-hidden flex items-center gap-2.5
              ${active === item.id
                ? "bg-gradient-to-r from-violet-500/20 to-sky-500/10 border border-violet-400/25 text-white font-semibold"
                : "text-white/40 hover:text-white/70 hover:bg-white/[0.04] border border-transparent"
              }`}>
            {active === item.id && (
              <div className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full bg-gradient-to-b from-violet-400 to-sky-400" />
            )}
            <span className="text-base leading-none">{item.icon}</span>
            <span className="pl-0.5">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom user card */}
      <div className="mt-4">
        <div className="h-[1px] w-full rounded-full opacity-20 mb-4"
          style={{ background:"linear-gradient(to right,#a78bfa,#38bdf8)" }} />
        <div className="relative rounded-2xl border border-violet-500/20 bg-violet-500/5 p-3 overflow-hidden">
          <div className="absolute top-0 left-3 right-3 h-[1.5px] rounded-full bg-gradient-to-r from-violet-400 to-sky-400 opacity-60" />
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white shrink-0"
              style={{ background:"linear-gradient(135deg,#a78bfa,#38bdf8)" }}>
              {user?.fullName?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{user?.fullName || "User"}</p>
              <p className="text-white/30 text-[10px] truncate">{user?.email || "user@example.com"}</p>
            </div>
            <LogoutButton />
          </div>
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
  );

if (loading) return (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div style={{ width:32, height:32, border:"2px solid rgba(255,255,255,0.1)", borderTop:"2px solid #a78bfa", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
);


  return (
    <UserContext.Provider value={user}>
    <div className="relative min-h-screen flex overflow-hidden bg-black">

      {/* Spline background */}
      <div className="fixed inset-0 z-0 pointer-events-none translate-x-[8%]">
        <Spline scene="https://prod.spline.design/8d3KHxkReUNnmBVL/scene.splinecode" />
      </div>

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── SIDEBAR desktop (always visible ≥ lg) ── */}
      <aside className="hidden lg:flex fixed z-10 w-[270px] min-h-screen flex-col border-r border-white/[0.08] bg-[#0b0d12]/95 backdrop-blur-md overflow-hidden">
        <div className="absolute -top-20 -left-10 w-48 h-48 bg-violet-700 rounded-full opacity-20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 -right-10 w-40 h-40 bg-sky-700 rounded-full opacity-20 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage:"radial-gradient(rgba(255,255,255,0.03) 1px,transparent 1px)", backgroundSize:"24px 24px" }} />
        <SidebarContent />
      </aside>

      {/* ── SIDEBAR mobile (slide in from left) ── */}
      <aside ref={sidebarRef}
        className={`lg:hidden fixed z-30 top-0 left-0 h-full w-[270px] flex flex-col border-r border-white/[0.08] bg-[#0b0d12]/98 backdrop-blur-md overflow-hidden transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="absolute -top-20 -left-10 w-48 h-48 bg-violet-700 rounded-full opacity-20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 -right-10 w-40 h-40 bg-sky-700 rounded-full opacity-20 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage:"radial-gradient(rgba(255,255,255,0.03) 1px,transparent 1px)", backgroundSize:"24px 24px" }} />
        <SidebarContent />
      </aside>

      {/* ── MAIN ── */}
      <main className="relative z-10 flex-1 lg:ml-[270px] min-w-0">

        {/* Topbar */}
        <nav className="sticky top-0 z-50 flex justify-between items-center px-4 py-3 border-b border-white/[0.06] bg-[#0b0d12]/90 backdrop-blur-md gap-3">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] opacity-30"
            style={{ background:"linear-gradient(to right,#f43f5e,#38bdf8,#a78bfa,#34d399)" }} />

          {/* Left: hamburger (mobile) + search */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Hamburger — mobile only */}
            <button onClick={() => setSidebarOpen(o => !o)}
              className="lg:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-white/5 transition-colors flex-shrink-0">
              <span className={`block w-5 h-px bg-white/70 transition-all duration-200 ${sidebarOpen ? "rotate-45 translate-y-1.5" : ""}`} />
              <span className={`block w-5 h-px bg-white/70 transition-all duration-200 ${sidebarOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-px bg-white/70 transition-all duration-200 ${sidebarOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
            </button>

            {/* Search — hidden on very small screens */}
            <div className="relative hidden sm:block">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 text-sm">🔍</span>
              <input
                className="bg-white/5 border border-white/10 focus:border-violet-400/40 outline-none text-white text-sm placeholder-white/20 pl-9 pr-4 py-2.5 rounded-xl w-56 lg:w-72 transition-all"
                type="text" placeholder="Search anything..." />
            </div>

            {/* Current page label — mobile */}
            <p className="sm:hidden text-white/60 text-sm font-medium truncate">
              {NAV_ITEMS.find(n => n.id === active)?.label || "Dashboard"}
            </p>
          </div>

          {/* Right: notif + profile */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {/* Notification */}
            <div className="relative" ref={notifRef}>
              <button onClick={() => { setShowNotif(v => !v); setShowProfile(false); }}
                className="relative w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:border-sky-400/40 hover:bg-sky-500/10 flex items-center justify-center transition-all text-base">
                🔔
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-[#0b0d12]">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotif && (
                <div className="absolute right-0 top-12 w-72 sm:w-80 rounded-2xl border border-white/[0.08] bg-[#0d0f14] shadow-2xl shadow-black/60 z-[999] overflow-hidden">
                  <div className="h-[2px] w-full bg-gradient-to-r from-sky-400 to-violet-400" />
                  <div className="p-4 border-b border-white/[0.06] flex justify-between items-center">
                    <p className="text-white text-sm font-semibold">Notifications</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/20 text-sky-400 font-semibold">{unreadCount} new</span>
                  </div>
                  <div className="divide-y divide-white/[0.04]">
                    {notifications.map((n, i) => (
                      <div key={i} className={`flex gap-3 px-4 py-3 hover:bg-white/[0.03] transition-all cursor-pointer ${n.unread ? "bg-white/[0.02]" : ""}`}>
                        <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-sm shrink-0">{n.icon}</div>
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
                    <button className="w-full text-center text-[11px] text-sky-400 hover:text-sky-300 transition-colors py-1">View all</button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button onClick={() => { setShowProfile(v => !v); setShowNotif(false); }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-white/10 hover:border-violet-400/30 hover:bg-violet-500/5 transition-all">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0"
                  style={{ background:"linear-gradient(135deg,#a78bfa,#38bdf8)" }}>
                  {user?.fullName?.[0]?.toUpperCase() || "U"}
                </div>
                <p className="text-white text-xs font-semibold truncate max-w-[60px] hidden sm:block">
                  {user?.fullName?.split(" ")[0] || "User"}
                </p>
                <span className={`text-white/30 text-[10px] transition-transform duration-200 ${showProfile ? "rotate-180" : ""}`}>▾</span>
              </button>

              {showProfile && (
                <div className="absolute right-0 top-12 w-52 rounded-2xl border border-white/[0.08] bg-[#0d0f14] shadow-2xl shadow-black/60 z-[999] overflow-hidden">
                  <div className="h-[2px] w-full bg-gradient-to-r from-violet-400 to-sky-400" />
                  <div className="px-4 py-3.5 border-b border-white/[0.06]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white shrink-0"
                        style={{ background:"linear-gradient(135deg,#a78bfa,#38bdf8)" }}>
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

                  {/* Nav shortcuts */}
                  <div className="p-2">
                    {[
                      { icon:"⚙️", label:"Settings", id:"settings", color:"hover:text-violet-400 hover:bg-violet-500/8 hover:border-violet-500/15" },
                      { icon:"📄", label:"My Resume", id:"resume",   color:"hover:text-sky-400 hover:bg-sky-500/8 hover:border-sky-500/15"         },
                    ].map((item) => (
                      <button key={item.id}
                        onClick={() => handleSetActive(item.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-white/40 border border-transparent transition-all duration-150 ${item.color}`}>
                        <span>{item.icon}</span>{item.label}
                      </button>
                    ))}
                  </div>

                  {/* Logout */}
                  <div className="p-2 pt-1 border-t border-white/[0.06]">
                    <LogoutButton className="w-full rounded-xl px-3 py-2.5 justify-start gap-2.5 text-sm text-white/40 border-transparent hover:text-rose-400 hover:bg-rose-500/8 hover:border-rose-500/15 h-auto" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Page content */}
        <div className="min-h-[calc(100vh-57px)]">
          {renderContent()}
        </div>
      </main>
    </div>
    </UserContext.Provider>
  );
}