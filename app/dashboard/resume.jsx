"use client";
import { useState, useEffect } from "react";
import { useRef } from "react";

export default function Resume() {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleFile = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  return (
    <div className="min-h-screen bg-[#0d0f14] relative overflow-hidden flex items-center justify-center px-4 py-16 -mt-13">

      {/* ── Background mood lighting ── */}
      <div className="absolute top-[-80px] left-[-60px] w-[420px] h-[420px] rounded-full bg-indigo-700 opacity-[0.12] blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-60px] right-[-40px] w-[360px] h-[360px] rounded-full bg-teal-600 opacity-[0.10] blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-slate-600 opacity-[0.07] blur-3xl pointer-events-none" />

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 w-full max-w-6xl">

        {/* ── Header ── */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] tracking-widest uppercase text-white/30 font-medium mb-4">
             AI Powered Analysis
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight leading-snug">
            Resume{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">
              Analyzer
            </span>
          </h1>
          <p className="mt-2 text-[13px] text-white/30 font-light leading-relaxed">
            Upload your resume and get detailed AI-powered insights, skill gaps, and role-match scores.
          </p>
        </div>

        {/* ── Upload Card ── */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => !file && inputRef.current.click()}
          className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden
            ${dragging
              ? "border-teal-400/60 bg-teal-500/5 scale-[1.01]"
              : file
              ? "border-indigo-400/40 bg-indigo-500/5 cursor-default"
              : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
            }`}
        >
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-teal-500/40 rounded-tl-xl" />
          <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-teal-500/40 rounded-tr-xl" />
          <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-indigo-500/40 rounded-bl-xl" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-indigo-500/40 rounded-br-xl" />

          <div className="px-8 py-14 flex flex-col items-center text-center">

            {file ? (
              /* ── File uploaded state ── */
              <>
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/15 border border-indigo-400/20 flex items-center justify-center mb-5 text-3xl">
                  📄
                </div>
                <p className="text-white font-semibold text-sm truncate max-w-[240px]">{file.name}</p>
                <p className="text-white/30 text-[11px] mt-1">
                  {(file.size / 1024).toFixed(1)} KB · Ready to analyze
                </p>
                <button
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="mt-4 text-[11px] text-white/25 hover:text-rose-400 transition-colors underline underline-offset-2"
                >
                  Remove file
                </button>
              </>
            ) : (
              /* ── Empty state ── */
              <>
                {/* Icon circle */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 text-2xl
                  ${dragging
                    ? "bg-teal-500/20 border border-teal-400/30 scale-110"
                    : "bg-white/5 border border-white/10"
                  }`}
                >
                  {dragging ? "📂" : "☁️"}
                </div>

                <h2 className="text-white font-semibold text-base mb-2">
                  {dragging ? "Drop it here!" : "Upload Your Resume"}
                </h2>
                <p className="text-white/25 text-[12px] leading-relaxed mb-6 max-w-[260px]">
                  Drag & drop your file here, or click to browse.<br />
                  Supports <span className="text-white/40">PDF</span> and <span className="text-white/40">DOCX</span> formats.
                </p>

                <button
                  onClick={(e) => { e.stopPropagation(); inputRef.current.click(); }}
                  className="px-6 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-gradient-to-r from-teal-500 to-indigo-500 hover:shadow-lg hover:shadow-teal-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
                >
                  Browse File
                </button>
              </>
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            onChange={handleFile}
          />
        </div>

        {/* ── Analyze button ── */}
        {file && (
          <button className="mt-4 w-full py-3.5 rounded-xl font-semibold text-[13px] text-white bg-gradient-to-r from-teal-500 to-indigo-500 hover:shadow-xl hover:shadow-indigo-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 tracking-wide">
            ✦ Analyze My Resume
          </button>
        )}

        {/* ── Feature chips ── */}
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {["ATS Score", "Skill Gap Analysis", "Role Match", "Keyword Check", "Format Review"].map((f, i) => (
            <span
              key={i}
              className="text-[11px] px-3 py-1 rounded-full bg-white/4 border border-white/8 text-white/30 font-light"
            >
              {f}
            </span>
          ))}
        </div>

        {/* ── Privacy note ── */}
        <p className="mt-5 text-center text-[11px] text-white/15">
          🔒 Your resume is never stored or shared
        </p>

      </div>
    </div>
  );
}