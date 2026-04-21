import React from 'react';

const STEPS = [
  {
    num: "01",
    title: "Upload Your Resume",
    desc: "Upload your resume in PDF or DOCX format. Our AI instantly parses, extracts your skills, experience, and education.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
    ),
    color: "from-blue-500 to-cyan-500",
    glow: "shadow-blue-500/30",
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
  },
  {
    num: "02",
    title: "Get AI Analysis",
    desc: "Receive your ATS score, skill gap analysis, role compatibility, keyword check, and personalised improvement plan.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    color: "from-violet-500 to-purple-500",
    glow: "shadow-violet-500/30",
    border: "border-violet-500/30",
    bg: "bg-violet-500/10",
  },
  {
    num: "03",
    title: "Accelerate Your Career",
    desc: "Follow your custom roadmap, practice AI mock interviews, track your learning, and get matched with your dream role.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: "from-emerald-500 to-teal-500",
    glow: "shadow-emerald-500/30",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
  },
];

const STATS = [
  { value:"50,000+",  label:"Users Helped",      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  { value:"100,000+", label:"Resumes Analysed",  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
  { value:"95%",      label:"Success Rate",       icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg> },
  { value:"10,000+",  label:"Jobs Matched",       icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
];

// Mini dashboard preview card
function PreviewCard() {
  return (
    <div className="border border-blue-900/50 bg-blue-950/30 rounded-2xl p-1.5">
      <div className="bg-[#0a0c13] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-white font-semibold font-serif">ATS Analysis</p>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400">Live</span>
        </div>

        {/* Score ring */}
        <div className="flex items-center gap-4 mb-5">
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
              <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
              <circle cx="32" cy="32" r="26" fill="none" stroke="#38bdf8" strokeWidth="6"
                strokeDasharray="115 49" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-black text-white">78</span>
            </div>
          </div>
          <div>
            <p className="text-white text-sm font-bold">Good Resume ✨</p>
            <p className="text-white/30 text-[11px] mt-0.5">Needs polish on keywords</p>
          </div>
        </div>

        {/* Skill bars */}
        {[
          { name:"React.js",   pct:82, color:"from-sky-400 to-blue-500"      },
          { name:"TypeScript", pct:55, color:"from-violet-400 to-purple-500" },
          { name:"Node.js",    pct:68, color:"from-emerald-400 to-teal-500"  },
          { name:"Docker",     pct:30, color:"from-rose-400 to-pink-500"     },
        ].map((s, i) => (
          <div key={i} className="mb-2.5">
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-white/50">{s.name}</span>
              <span className="text-white/30">{s.pct}%</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full rounded-full bg-gradient-to-r ${s.color}`} style={{ width:`${s.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Works() {
  return (
    <div id="works">

      {/* ── How it works ── */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[400px] h-[300px] rounded-full bg-blue-700 opacity-[0.06] blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] tracking-widest uppercase text-blue-400 font-medium mb-4">
              How it Works
            </span>
            <h2 className="text-4xl font-bold text-white font-serif">Start your journey in 3 simple steps</h2>
          </div>

          {/* Steps */}
          <div className="relative">
            {/* Connector line desktop */}
            <div className="hidden md:block absolute top-14 left-[calc(16.67%+32px)] right-[calc(16.67%+32px)] h-px bg-gradient-to-r from-blue-600 via-violet-600 to-emerald-600 opacity-30" />

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {STEPS.map((s, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  {/* Icon circle */}
                  <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow-xl ${s.glow} mb-5 z-10`}>
                    {s.icon}
                    {/* Step badge */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#0b0d12] border border-white/10 flex items-center justify-center">
                      <span className="text-[9px] font-black text-white/60">{s.num}</span>
                    </div>
                  </div>

                  <div className={`rounded-2xl border ${s.border} ${s.bg} p-5 w-full`}>
                    <span className={`text-[11px] font-bold tracking-widest text-blue-400 uppercase`}>Step {s.num}</span>
                    <h3 className="text-white font-bold text-lg font-serif mt-1 mb-2">{s.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Platform preview + feature list ── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] tracking-widest uppercase text-blue-400 font-medium mb-4">
              Platform Preview
            </span>
            <h2 className="text-4xl font-bold text-white font-serif mb-3">Powerful tools at your fingertips</h2>
            <p className="text-gray-400 text-base mb-8 leading-relaxed">Experience a beautifully designed interface that makes career planning intuitive and engaging.</p>

            {/* Feature list */}
            <div className="space-y-4">
              {[
                { icon:"📄", title:"Smart Resume Analysis",    items:["ATS Score Check", "Keyword Matching", "Format Review"]             },
                { icon:"📊", title:"Skill Gap Intelligence",   items:["Role Compatibility", "Missing Skills", "Learning Roadmap"]          },
                { icon:"🎙️", title:"AI Mock Interviews",       items:["Instant Feedback", "Score Report", "Model Answers"]                 },
              ].map((f, i) => (
                <div key={i}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-base">{f.icon}</div>
                    <p className="text-white font-semibold text-sm font-serif">{f.title}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 ml-12">
                    {f.items.map((item, j) => (
                      <span key={j} className="flex items-center gap-1.5 text-xs text-white/50 bg-white/5 border border-white/8 px-3 py-1 rounded-full">
                        <svg viewBox="0 0 6 6" className="w-1.5 h-1.5 fill-blue-400"><circle cx="3" cy="3" r="3" /></svg>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview card */}
          <div className="lg:pl-8">
            <PreviewCard />
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-3xl border border-white/8 bg-gradient-to-br from-gray-900/80 via-gray-900/40 to-gray-900/80 p-8 sm:p-12">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-white">
              {STATS.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto mb-3">
                    {s.icon}
                  </div>
                  <p className="text-4xl font-bold text-white sm:text-5xl">{s.value}</p>
                  <p className="mt-2 text-gray-400 font-serif">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}