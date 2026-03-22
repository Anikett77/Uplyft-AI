"use client";
import { useState, useEffect } from "react";
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Skills Progress */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
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
function Resume(){ 
  return ( 
  <div>
    <h1 className="text-white text-2xl font-serif font-medium">📄Resume Analyzer</h1> 
    <p className="text-gray-400 font-serif">Upload your resume to get AI-powered analysis and recommendations
      <div className="border-2 border-dashed border-black bg-blue-950/30 w-300 h-125 my-10 mx-5 rounded-xl flex justify-center">
        <div className="bg-blue-500 rounded-full w-30 h-30 mt-40 absolute"></div>
        <div className="flex-none items-center text-center">
        <h1 className="mt-80 text-white text-2xl">Upload Your Resume</h1>
        <p className="text-gray-400 text-sm mt-3">Drag and drop your resume here, or click to browse <br />
Supports PDF and DOCX formats</p>
<button className="p-2 bg-blue-500 text-black rounded-lg mt-5 px-4">Browse File</button>
</div>
      </div>

</p>

  </div>
  )
}
function SkillGap()   { return <h1 className="text-white text-3xl">📊 Skill Gap Analysis</h1> }
function Roadmap()    { return <h1 className="text-white text-3xl">🗺️ Career Roadmap</h1> }
function Interview()  { return <h1 className="text-white text-3xl">🎤 AI Mock Interview</h1> }
function Jobs()       { return <h1 className="text-white text-3xl">💼 Job Recommendations</h1> }
function Portfolio()  { return <h1 className="text-white text-3xl">🖼️ Portfolio Analyzer</h1> }
function Learning()   { return <h1 className="text-white text-3xl">📚 Learning Tracker</h1> }
function Mentor()     { return <h1 className="text-white text-3xl">🤖 AI Mentor Chat</h1> }
function Settings()   { return <h1 className="text-white text-3xl">⚙️ Settings</h1> }

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
      <div className="fixed inset-0 z-0 pointer-events-none translate-x-[7%]">
  <Spline
        scene="https://prod.spline.design/8d3KHxkReUNnmBVL/scene.splinecode" 
      />
</div>

      {/* ── SIDEBAR — z-10 pe, Spline ke upar ── */}
      <aside className="relative z-10 w-[270px] min-h-screen border-r border-white/20 bg-black backdrop-blur-md p-5">
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
      <main className="relative z-10 flex-1 p-8">
        {renderContent()}
      </main>

    </div>
  );
}
