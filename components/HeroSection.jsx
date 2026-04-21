"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

// ── Animated floating card ────────────────────────────────────────────────
function FloatingCard({ className, children }) {
  return (
    <div className={`absolute rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-3 shadow-xl ${className}`}
      style={{ animation: "float 4s ease-in-out infinite" }}>
      {children}
    </div>
  );
}

export default function HeroSection() {
  const router = useRouter();

  return (
    <div id="home" className="relative min-h-screen bg-[#060810] overflow-hidden flex items-center">

      {/* ── Background effects ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Main glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-blue-700 opacity-[0.12] blur-3xl" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-violet-700 opacity-[0.08] blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-cyan-700 opacity-[0.07] blur-3xl" />

        {/* Grid */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage:"linear-gradient(rgba(59,130,246,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.15) 1px,transparent 1px)", backgroundSize:"60px 60px" }} />

        {/* Radial fade over grid */}
        <div className="absolute inset-0" style={{ background:"radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, #060810 100%)" }} />
      </div>

      {/* ── Floating stat cards ── */}
      <FloatingCard className="top-[18%] left-[6%] hidden lg:block" style={{ animationDelay:"0s" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm">✅</div>
          <div>
            <p className="text-white text-xs font-semibold">ATS Score</p>
            <p className="text-emerald-400 text-[11px]">82 / 100</p>
          </div>
        </div>
      </FloatingCard>

      <FloatingCard className="top-[28%] right-[6%] hidden lg:block" style={{ animationDelay:"1.5s" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-400 text-sm">🎯</div>
          <div>
            <p className="text-white text-xs font-semibold">Role Match</p>
            <p className="text-sky-400 text-[11px]">Frontend Dev · 78%</p>
          </div>
        </div>
      </FloatingCard>

      <FloatingCard className="bottom-[30%] left-[8%] hidden lg:block" style={{ animationDelay:"2.5s" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400 text-sm">🧠</div>
          <div>
            <p className="text-white text-xs font-semibold">Mock Interview</p>
            <p className="text-violet-400 text-[11px]">Score 8.4 / 10</p>
          </div>
        </div>
      </FloatingCard>

      <FloatingCard className="bottom-[25%] right-[7%] hidden lg:block" style={{ animationDelay:"0.8s" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 text-sm">📈</div>
          <div>
            <p className="text-white text-xs font-semibold">Career Readiness</p>
            <p className="text-amber-400 text-[11px]">72% complete</p>
          </div>
        </div>
      </FloatingCard>

      {/* ── Main content ── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] tracking-widest uppercase text-white font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse inline-block" />
          AI-Powered Career Platform
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight font-serif mb-6">
          Your Career Mentor
          <br />
          <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
            for Success
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          Analyse your resume, identify skill gaps, generate personalised career roadmaps,
          practice AI mock interviews, and land your dream job with intelligent guidance.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button
            onClick={() => router.push('/signup')}
            className="group relative px-6 py-2 rounded-2xl font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-base">
            <span className="relative z-10 flex items-center gap-2 justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Analyse Resume — Free
            </span>
          </button>
          <button
            onClick={() => router.push('/signup')}
            className="px-8 py-4 rounded-2xl font-semibold text-white border border-white/15 hover:border-white/30 hover:bg-white/5 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-base flex items-center gap-2 justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Get Career Roadmap
          </button>
        </div>

        {/* Social proof */}
        <div className="flex items-center justify-center gap-6 flex-wrap">
          <div className="flex -space-x-2">
            {["SS","RM","AV","DK","NK"].map((i, j) => (
              <div key={j} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 border-2 border-[#060810] flex items-center justify-center text-[9px] font-bold text-white">{i}</div>
            ))}
          </div>
          <p className="text-gray-400 text-sm"><span className="text-white font-semibold">50,000+</span> professionals already growing their careers</p>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg key={i} viewBox="0 0 24 24" className="w-4 h-4 fill-amber-400"><path d="M12 2l2.9 6 6.6.9-4.8 4.7 1.2 6.6L12 17l-5.9 3.1 1.2-6.6L2.5 8.9l6.6-.9L12 2z"/></svg>
            ))}
            <span className="text-gray-400 text-sm ml-1">4.9/5</span>
          </div>
        </div>
      </div>

      {/* CSS for floating animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}