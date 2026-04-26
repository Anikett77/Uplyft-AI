"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Settings() {
  const [active, setActive] = useState("profile");

  const SET_ITEMS = [
    { id: "profile",      label: "Profile",      icon: "👤" },
    { id: "notification", label: "Notification",  icon: "🔔" },
    { id: "privacy",      label: "Privacy",       icon: "🔒" },
    { id: "appearance",   label: "Appearance",    icon: "🎨" },
    { id: "billing",      label: "Billing",       icon: "💳" },
  ];

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ fullName:"", email:"", jobTitle:"", location:"", bio:"" });

  useEffect(() => {
    axios.get("/api/users/me")
      .then(res => setUser({
        fullName: res.data.data.fullName   || "",
        email:    res.data.data.email      || "",
        jobTitle: res.data.data.targetRole || "",
        location: res.data.data.college    || "",
        bio:      res.data.data.experience || "",
      }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/api/users/me", user);
      alert("Profile updated 🚀");
    } catch (err) { console.error(err); }
  };

  const Field = ({ label, name, type = "text", placeholder }) => (
    <div>
      <label className="text-[10px] text-white/30 uppercase tracking-widest mb-1.5 block">{label}</label>
      <input type={type} name={name} value={user[name]} onChange={handleChange} placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 focus:border-sky-400/40 outline-none text-white text-sm placeholder-white/20 p-3 rounded-xl transition-all" />
    </div>
  );

  const ToggleRow = ({ label, desc, defaultOn = false, accent = "sky" }) => {
    const [on, setOn] = useState(defaultOn);
    const g = { sky:"from-sky-500 to-violet-500", rose:"from-rose-500 to-pink-500", emerald:"from-emerald-500 to-teal-500", violet:"from-violet-500 to-purple-500" };
    return (
      <div className="flex items-center justify-between py-3.5 border-b border-white/5 last:border-0 gap-4">
        <div className="min-w-0">
          <p className="text-white text-sm font-medium">{label}</p>
          <p className="text-white/30 text-xs mt-0.5 leading-relaxed">{desc}</p>
        </div>
        <button onClick={() => setOn(!on)} className={`w-11 h-6 rounded-full relative flex-shrink-0 transition-all duration-300 ${on ? `bg-gradient-to-r ${g[accent]}` : "bg-white/10"}`}>
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${on ? "left-6" : "left-1"}`} />
        </button>
      </div>
    );
  };

  function Profile() {
    return (
      <div>
        <h1 className="text-white font-semibold text-base font-serif">Profile Information</h1>
        <p className="text-white/30 text-sm mt-1">Update your personal details and public profile</p>
        <div className="flex items-center gap-4 mt-6 mb-6 flex-wrap">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white shrink-0"
            style={{ background:"linear-gradient(135deg,#f43f5e,#38bdf8,#a78bfa)" }}>
            {user.fullName?.[0] || "A"}
          </div>
          <div className="text-white text-sm font-medium">
            Change Avatar
            <p className="text-white/25 text-xs mt-1 font-normal">JPG, PNG or GIF. Max 2MB.</p>
            <button className="mt-1.5 text-[11px] text-sky-400 border border-sky-400/30 px-3 py-1 rounded-lg hover:bg-sky-400/5 transition-all">Upload Photo</button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="text-white w-full">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full Name"  name="fullName" placeholder="Full Name" />
            <Field label="Email"      name="email"    type="email" placeholder="Email" />
            <Field label="Job Title"  name="jobTitle" placeholder="Job Title" />
            <Field label="Location"   name="location" placeholder="Location" />
          </div>
          <div className="flex flex-col gap-3 mt-4">
            <div>
              <label className="text-[10px] text-white/30 uppercase tracking-widest mb-1.5 block">Bio</label>
              <textarea name="bio" value={user.bio} onChange={handleChange} placeholder="Tell us about yourself..." rows={3}
                className="w-full bg-white/5 border border-white/10 focus:border-rose-400/40 outline-none text-white text-sm placeholder-white/20 p-3 rounded-xl transition-all resize-none" />
            </div>
            <button type="submit"
              className="w-full sm:w-fit px-6 py-2.5 rounded-xl text-sm font-semibold text-white hover:shadow-lg hover:shadow-rose-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
              style={{ background:"linear-gradient(to right,#f43f5e,#38bdf8,#a78bfa)" }}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    );
  }

  function Notification() {
    return (
      <div>
        <h1 className="text-white font-semibold text-base font-serif">Notification Preferences</h1>
        <p className="text-white/30 text-sm mt-1 mb-6">Choose what updates you want to receive</p>
        <div className="mb-5">
          <p className="text-[10px] text-white/25 uppercase tracking-widest mb-3">Email Alerts</p>
          <div className="rounded-xl border border-sky-500/15 bg-sky-500/5 px-4">
            <ToggleRow label="Weekly Progress Digest"  desc="Summary of your learning and career progress"  defaultOn={true}  accent="sky" />
            <ToggleRow label="Course Recommendations"  desc="Personalized course suggestions"                defaultOn={true}  accent="sky" />
            <ToggleRow label="Job Match Alerts"        desc="When new roles match your profile"              defaultOn={false} accent="sky" />
            <ToggleRow label="Interview Reminders"     desc="Reminders before scheduled mock interviews"     defaultOn={true}  accent="sky" />
          </div>
        </div>
        <div>
          <p className="text-[10px] text-white/25 uppercase tracking-widest mb-3">Push Notifications</p>
          <div className="rounded-xl border border-violet-500/15 bg-violet-500/5 px-4">
            <ToggleRow label="Mentor Reply"    desc="When your AI mentor has a new response"       defaultOn={true}  accent="violet" />
            <ToggleRow label="Streak Reminders"desc="Daily learning streak nudges"                 defaultOn={false} accent="violet" />
            <ToggleRow label="Goal Deadlines"  desc="Reminders when goals are approaching deadline"defaultOn={true}  accent="violet" />
          </div>
        </div>
      </div>
    );
  }

  function Privacy() {
    return (
      <div>
        <h1 className="text-white font-semibold text-base font-serif">Privacy & Security</h1>
        <p className="text-white/30 text-sm mt-1 mb-6">Control your data and account security</p>
        <div className="mb-5">
          <p className="text-[10px] text-white/25 uppercase tracking-widest mb-3">Visibility</p>
          <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 px-4">
            <ToggleRow label="Public Profile"   desc="Let others see your profile and achievements"  defaultOn={true}  accent="emerald" />
            <ToggleRow label="Show Skill Scores"desc="Display your skill gap scores publicly"         defaultOn={false} accent="emerald" />
            <ToggleRow label="Activity Status"  desc="Show when you were last active"                defaultOn={true}  accent="emerald" />
          </div>
        </div>
        <div className="mb-5">
          <p className="text-[10px] text-white/25 uppercase tracking-widest mb-3">Security</p>
          <div className="rounded-xl border border-violet-500/15 bg-violet-500/5 px-4">
            <ToggleRow label="Two-Factor Authentication" desc="Extra layer of security on login"      defaultOn={false} accent="violet" />
            <ToggleRow label="Login Alerts"              desc="Email me when a new device logs in"    defaultOn={true}  accent="violet" />
          </div>
        </div>
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
          <p className="text-rose-400 text-sm font-semibold mb-1">Danger Zone</p>
          <p className="text-white/30 text-xs mb-3">These actions are permanent and cannot be undone.</p>
          <div className="flex gap-2 flex-wrap">
            <button className="text-[12px] px-4 py-2 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-all">Delete Account</button>
            <button className="text-[12px] px-4 py-2 rounded-lg border border-white/10 text-white/30 hover:bg-white/5 transition-all">Export Data</button>
          </div>
        </div>
      </div>
    );
  }

  function Appearance() {
    const [theme, setTheme]   = useState("dark");
    const [accent, setAccent] = useState("sky");
    const themes  = [{ id:"dark", label:"Dark", preview:"🌑" },{ id:"light", label:"Light", preview:"☀️" },{ id:"midnight", label:"Midnight", preview:"🌌" }];
    const accents = [{ id:"sky", cls:"bg-sky-500" },{ id:"violet", cls:"bg-violet-500" },{ id:"emerald", cls:"bg-emerald-500" },{ id:"rose", cls:"bg-rose-500" },{ id:"amber", cls:"bg-amber-500" }];
    return (
      <div>
        <h1 className="text-white font-semibold text-base font-serif">Appearance</h1>
        <p className="text-white/30 text-sm mt-1 mb-6">Customize your theme and display preferences</p>
        <div className="mb-6">
          <p className="text-[10px] text-white/25 uppercase tracking-widest mb-3">Theme</p>
          <div className="grid grid-cols-3 gap-3">
            {themes.map(t => (
              <button key={t.id} onClick={() => setTheme(t.id)}
                className={`rounded-xl border p-4 text-center transition-all duration-150 ${theme===t.id ? "border-emerald-400/40 bg-emerald-400/10 text-white" : "border-white/8 bg-white/[0.02] text-white/40 hover:border-white/15"}`}>
                <span className="text-2xl block mb-2">{t.preview}</span>
                <p className="text-sm font-medium">{t.label}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <p className="text-[10px] text-white/25 uppercase tracking-widest mb-3">Accent Color</p>
          <div className="flex gap-3 flex-wrap">
            {accents.map(a => (
              <button key={a.id} onClick={() => setAccent(a.id)}
                className={`w-8 h-8 rounded-full ${a.cls} transition-all duration-150 ${accent===a.id ? "ring-2 ring-white/40 ring-offset-2 ring-offset-[#0b0d12] scale-110" : "opacity-60 hover:opacity-90"}`} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] text-white/25 uppercase tracking-widest mb-3">Display</p>
          <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 px-4">
            <ToggleRow label="Compact Mode"        desc="Reduce spacing for more content"            defaultOn={false} accent="emerald" />
            <ToggleRow label="Animations"          desc="Enable UI transitions and effects"          defaultOn={true}  accent="emerald" />
            <ToggleRow label="Show Progress Bars"  desc="Display progress indicators everywhere"     defaultOn={true}  accent="emerald" />
          </div>
        </div>
      </div>
    );
  }

  function Billing() {
    const [plan] = useState("pro");
    const plans = [
      { id:"free", label:"Free", price:"$0",  desc:"Basic access",   features:["5 AI chats/month","1 Resume scan","Basic roadmap"] },
      { id:"pro",  label:"Pro",  price:"$12", desc:"Most popular",   features:["Unlimited AI chats","Resume analyzer","Skill gap analysis","Priority support"], highlight:true },
      { id:"team", label:"Team", price:"$29", desc:"For groups",     features:["Everything in Pro","5 team members","Admin dashboard","Custom roadmaps"] },
    ];
    return (
      <div>
        <h1 className="text-white font-semibold text-base font-serif">Billing & Plans</h1>
        <p className="text-white/30 text-sm mt-1 mb-6">Manage your subscription and payment details</p>
        <div className="rounded-xl border border-violet-400/20 bg-violet-400/5 p-4 flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Current Plan</p>
            <p className="text-white font-bold text-base">Pro · $12/month</p>
            <p className="text-white/30 text-xs mt-0.5">Renews on April 15, 2026</p>
          </div>
          <span className="text-[11px] px-3 py-1 rounded-full bg-violet-400/15 border border-violet-400/30 text-violet-400 font-semibold">Active</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mb-6">
          {plans.map(p => (
            <div key={p.id} className={`rounded-xl border p-4 transition-all relative ${plan===p.id ? "border-sky-400/40 bg-sky-400/5" : "border-white/8 bg-white/[0.02]"}`}>
              {p.highlight && plan!==p.id && <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] px-2.5 py-0.5 rounded-full text-white font-semibold" style={{ background:"linear-gradient(to right,#f43f5e,#a78bfa)" }}>Popular</span>}
              <p className="text-white font-bold text-sm">{p.label}</p>
              <p className="text-white/30 text-xs mb-3">{p.desc}</p>
              <p className="text-white text-xl font-black mb-3">{p.price}<span className="text-white/30 text-xs font-normal">/mo</span></p>
              <ul className="space-y-1.5">
                {p.features.map((f,i) => <li key={i} className="text-white/40 text-[11px] flex gap-1.5 items-center"><span className="text-emerald-400 text-[10px]">✓</span>{f}</li>)}
              </ul>
              <button className={`w-full mt-4 py-2 rounded-lg text-[12px] font-semibold transition-all ${plan===p.id ? "bg-sky-400/10 border border-sky-400/30 text-sky-400 cursor-default" : "bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white"}`}>
                {plan===p.id ? "Current Plan" : "Switch"}
              </button>
            </div>
          ))}
        </div>
        <div>
          <p className="text-[10px] text-white/25 uppercase tracking-widest mb-3">Payment Method</p>
          <div className="rounded-xl border border-sky-500/15 bg-sky-500/5 p-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-7 rounded-md flex items-center justify-center text-[10px] text-white font-bold flex-shrink-0" style={{ background:"linear-gradient(to right,#2563eb,#38bdf8)" }}>VISA</div>
              <div>
                <p className="text-white text-sm font-medium">•••• •••• •••• 4242</p>
                <p className="text-white/30 text-xs">Expires 08/27</p>
              </div>
            </div>
            <button className="text-[11px] text-sky-400 border border-sky-400/30 px-3 py-1 rounded-lg hover:bg-sky-400/5 transition-all">Update</button>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (active) {
      case "profile":      return <Profile />;
      case "notification": return <Notification />;
      case "privacy":      return <Privacy />;
      case "appearance":   return <Appearance />;
      case "billing":      return <Billing />;
      default:             return <Profile />;
    }
  };

  const activeColorMap = {
    profile:      "from-rose-500/20 to-pink-500/20 border-rose-400/25 text-rose-300",
    notification: "from-sky-500/20 to-cyan-500/20 border-sky-400/25 text-sky-300",
    privacy:      "from-violet-500/20 to-purple-500/20 border-violet-400/25 text-violet-300",
    appearance:   "from-emerald-500/20 to-teal-500/20 border-emerald-400/25 text-emerald-300",
    billing:      "from-rose-500/20 to-orange-500/20 border-rose-400/25 text-rose-300",
  };

  return (
    <div className="min-h-screen bg-[#0d0f14] relative overflow-hidden px-4 py-10">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-600 rounded-full opacity-20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-sky-600 rounded-full opacity-20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-700 rounded-full opacity-20 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage:"radial-gradient(rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize:"28px 28px" }} />

      <div className="relative z-10">
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] tracking-widest uppercase text-white/30 font-medium mb-3">✦ Account Management</div>
          <h1 className="text-white text-2xl font-serif">
            ⚙️ Settings{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage:"linear-gradient(to right,#f43f5e,#38bdf8,#a78bfa)" }}>& Preferences</span>
          </h1>
          <p className="text-white/30 mt-1 text-sm font-serif">Manage your account and preferences</p>
        </div>

        {/* Mobile: horizontal scrollable tabs */}
        <div className="flex sm:hidden gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {SET_ITEMS.map(item => (
            <button key={item.id} onClick={() => setActive(item.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs border transition-all ${active===item.id ? `bg-gradient-to-r ${activeColorMap[item.id]} font-semibold` : "text-white/40 bg-white/5 border-transparent"}`}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          {/* Desktop sidebar */}
          <div className="hidden sm:block w-44 shrink-0">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-2 space-y-1">
              {SET_ITEMS.map(item => (
                <button key={item.id} onClick={() => setActive(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 border ${active===item.id ? `bg-gradient-to-r ${activeColorMap[item.id]} font-semibold` : "text-white/40 hover:text-white/60 hover:bg-white/5 border-transparent"}`}>
                  <span>{item.icon}</span>{item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-6">
            <div className="h-0.5 w-full rounded-full mb-6 opacity-50" style={{ background:"linear-gradient(to right,#f43f5e,#38bdf8,#a78bfa,#34d399)" }} />
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}