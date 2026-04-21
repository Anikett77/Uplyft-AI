"use client";
import { useState, useRef } from "react";
import { useResumeState } from "@/hooks/useResumeState";

// ── Helpers ────────────────────────────────────────────────────────────────
const ScoreRing = ({ score, size = 80, stroke = 7, color = "#2dd4bf" }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ-dash}`} strokeLinecap="round"
        style={{ transition:"stroke-dasharray 1s ease" }} />
    </svg>
  );
};

const Tag = ({ label, type = "neutral" }) => {
  const colors = {
    present: { bg:"rgba(45,212,191,0.12)",  border:"rgba(45,212,191,0.25)", text:"#2dd4bf" },
    missing: { bg:"rgba(239,68,68,0.12)",   border:"rgba(239,68,68,0.25)",  text:"#f87171" },
    partial: { bg:"rgba(251,191,36,0.12)",  border:"rgba(251,191,36,0.25)", text:"#fbbf24" },
    neutral: { bg:"rgba(255,255,255,0.05)", border:"rgba(255,255,255,0.12)",text:"rgba(255,255,255,0.5)" },
  };
  const c = colors[type] || colors.neutral;
  return (
    <span style={{ fontSize:11, padding:"3px 9px", borderRadius:20, background:c.bg,
      border:`1px solid ${c.border}`, color:c.text, fontWeight:500, letterSpacing:"0.02em" }}>
      {label}
    </span>
  );
};

const MetricCard = ({ label, value, sub, color="#2dd4bf" }) => (
  <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)",
    borderRadius:14, padding:"1rem 1.1rem" }}>
    <p style={{ fontSize:10, color:"rgba(255,255,255,0.3)", margin:"0 0 6px",
      textTransform:"uppercase", letterSpacing:"0.1em" }}>{label}</p>
    <p style={{ fontSize:24, fontWeight:600, margin:0, color }}>{value}</p>
    {sub && <p style={{ fontSize:11, color:"rgba(255,255,255,0.3)", margin:"4px 0 0" }}>{sub}</p>}
  </div>
);

const Blobs = () => (
  <>
    <div style={{ position:"absolute",top:-80,left:-60,width:420,height:420,borderRadius:"50%",background:"#4338ca",opacity:0.1,filter:"blur(80px)",pointerEvents:"none" }} />
    <div style={{ position:"absolute",bottom:-60,right:-40,width:360,height:360,borderRadius:"50%",background:"#0f766e",opacity:0.09,filter:"blur(80px)",pointerEvents:"none" }} />
    <div style={{ position:"absolute",inset:0,pointerEvents:"none",backgroundImage:"radial-gradient(rgba(255,255,255,0.035) 1px,transparent 1px)",backgroundSize:"28px 28px" }} />
  </>
);

// ── Main Component ──────────────────────────────────────────────────────────
export default function Resume() {
  // Persisted state (survives navigation, cleared on logout)
  const { step, parsed, ats, fileName, setState, clearResumeState, hydrated } = useResumeState();

  // Transient UI state (local only — loading spinners, drag, errors)
  const [localDragging, setLocalDragging] = useState(false);
  const [uploadErr, setUploadErr]         = useState("");
  const [atsErr, setAtsErr]               = useState("");
  const [localFile, setLocalFile]         = useState(null);
  const [transientStep, setTransientStep] = useState(null); // "parsing" | "analyzing"
  const inputRef = useRef();

  const effectiveStep = transientStep || step;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleFile = (f) => { setLocalFile(f); setUploadErr(""); };
  const handleDrop = (e) => {
    e.preventDefault();
    setLocalDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const parseResume = async () => {
    if (!localFile) return;
    setTransientStep("parsing");
    setUploadErr("");
    try {
      const fd = new FormData();
      fd.append("resume", localFile);
      const res  = await fetch("/api/resume/parse", { method:"POST", body:fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Parse failed");
      // ✅ Persist — survives navigation
      setState({ step:"parsed", parsed:json.data, fileName:localFile.name, ats:null });
      setTransientStep(null);
    } catch(e) {
      setUploadErr(e.message);
      setTransientStep(null);
    }
  };

  const analyzeAts = async () => {
    if (!parsed) return;
    setTransientStep("analyzing");
    setAtsErr("");
    try {
      const fd = new FormData();
      if (localFile) fd.append("resume", localFile);
      fd.append("parsedData", JSON.stringify(parsed));
      const res  = await fetch("/api/analyze-resume", { method:"POST", body:fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Analysis failed");
      // ✅ Persist — survives navigation
      setState({ step:"results", ats:json.data });
      setTransientStep(null);
    } catch(e) {
      setAtsErr(e.message);
      setTransientStep(null);
    }
  };

  const reset = () => {
    clearResumeState(); // wipes localStorage too
    setLocalFile(null);
    setUploadErr("");
    setAtsErr("");
    setTransientStep(null);
  };

  // ── Hydration guard — prevent flash of upload screen on return visit ──
  if (!hydrated) {
    return (
      <div style={{ minHeight:"100vh", background:"#0d0f14", display:"flex",
        alignItems:"center", justifyContent:"center" }}>
        <div style={{ width:32, height:32, border:"2px solid rgba(255,255,255,0.1)",
          borderTop:"2px solid #2dd4bf", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════
  // UPLOAD VIEW
  // ════════════════════════════════════════════════════════════════════
  if (effectiveStep === "upload" || effectiveStep === "parsing") {
    const loading = effectiveStep === "parsing";
    return (
      <div style={{ minHeight:"100vh", background:"#0d0f14", display:"flex", alignItems:"center",
        justifyContent:"center", padding:"4rem 1rem", position:"relative", overflow:"hidden" }}>
        <Blobs />
        <div style={{ position:"relative", zIndex:10, width:"100%", maxWidth:560 }}>
          <div style={{ marginBottom:"1.75rem" }}>
            <span style={{ display:"inline-flex", alignItems:"center", padding:"3px 12px", borderRadius:20,
              background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)",
              fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(255,255,255,0.3)",
              fontWeight:500, marginBottom:12 }}>AI Powered Analysis</span>
            <h1 style={{ fontSize:28, fontWeight:700, color:"#fff", margin:"0 0 8px", lineHeight:1.25 }}>
              Resume{" "}
              <span style={{ background:"linear-gradient(135deg,#2dd4bf,#818cf8)",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Analyzer</span>
            </h1>
            <p style={{ fontSize:13, color:"rgba(255,255,255,0.3)", margin:0 }}>
              Upload your resume — we'll parse it and run a full ATS analysis.
            </p>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={(e)=>{e.preventDefault();setLocalDragging(true);}}
            onDragLeave={()=>setLocalDragging(false)}
            onDrop={handleDrop}
            onClick={()=>!localFile&&!loading&&inputRef.current.click()}
            style={{
              position:"relative", borderRadius:18,
              border:`2px dashed ${localDragging?"rgba(45,212,191,0.55)":localFile?"rgba(129,140,248,0.35)":"rgba(255,255,255,0.1)"}`,
              background:localDragging?"rgba(45,212,191,0.04)":localFile?"rgba(129,140,248,0.04)":"rgba(255,255,255,0.018)",
              cursor:localFile||loading?"default":"pointer",
              transition:"all 0.25s ease", overflow:"hidden",
              transform:localDragging?"scale(1.01)":"scale(1)",
            }}>
            <div style={{ padding:"3.5rem 2rem", display:"flex", flexDirection:"column",
              alignItems:"center", textAlign:"center" }}>
              {loading ? (
                <>
                  <div style={{ width:56,height:56,borderRadius:14,background:"rgba(129,140,248,0.1)",border:"1px solid rgba(129,140,248,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,marginBottom:16 }}>⚙️</div>
                  <p style={{ color:"#fff",fontWeight:600,fontSize:14,margin:"0 0 6px" }}>Parsing your resume…</p>
                  <p style={{ color:"rgba(255,255,255,0.3)",fontSize:12,margin:0 }}>Extracting details with AI</p>
                  <div style={{ marginTop:16,width:160,height:3,borderRadius:99,background:"rgba(255,255,255,0.06)",overflow:"hidden" }}>
                    <div style={{ height:"100%",borderRadius:99,background:"linear-gradient(90deg,#2dd4bf,#818cf8)",animation:"slide 1.2s ease-in-out infinite" }} />
                  </div>
                  <style>{`@keyframes slide{0%{width:0%;margin-left:0}50%{width:60%;margin-left:20%}100%{width:0%;margin-left:100%}}`}</style>
                </>
              ) : localFile ? (
                <>
                  <div style={{ width:56,height:56,borderRadius:14,background:"rgba(129,140,248,0.1)",border:"1px solid rgba(129,140,248,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,marginBottom:14 }}>📄</div>
                  <p style={{ color:"#fff",fontWeight:600,fontSize:14,margin:"0 0 4px",maxWidth:220,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{localFile.name}</p>
                  <p style={{ color:"rgba(255,255,255,0.3)",fontSize:11,margin:0 }}>{(localFile.size/1024).toFixed(1)} KB · Ready to parse</p>
                  <button onClick={(e)=>{e.stopPropagation();setLocalFile(null);}} style={{ marginTop:12,fontSize:11,color:"rgba(255,255,255,0.25)",background:"none",border:"none",cursor:"pointer",textDecoration:"underline" }}>Remove</button>
                </>
              ) : (
                <>
                  <div style={{ width:56,height:56,borderRadius:14,
                    background:localDragging?"rgba(45,212,191,0.15)":"rgba(255,255,255,0.05)",
                    border:`1px solid ${localDragging?"rgba(45,212,191,0.25)":"rgba(255,255,255,0.09)"}`,
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,marginBottom:16,transition:"all 0.25s" }}>
                    {localDragging?"📂":"☁️"}
                  </div>
                  <h2 style={{ color:"#fff",fontWeight:600,fontSize:15,margin:"0 0 8px" }}>
                    {localDragging?"Drop it here!":"Upload Your Resume"}
                  </h2>
                  <p style={{ color:"rgba(255,255,255,0.25)",fontSize:12,lineHeight:1.6,margin:"0 0 20px",maxWidth:240 }}>
                    Drag & drop, or click to browse.<br/>
                    <span style={{ color:"rgba(255,255,255,0.4)" }}>PDF</span> and <span style={{ color:"rgba(255,255,255,0.4)" }}>DOCX</span> supported.
                  </p>
                  <button onClick={(e)=>{e.stopPropagation();inputRef.current.click();}} style={{ padding:"10px 24px",borderRadius:10,fontSize:13,fontWeight:600,color:"#fff",background:"linear-gradient(135deg,#2dd4bf,#818cf8)",border:"none",cursor:"pointer" }}>Browse File</button>
                </>
              )}
            </div>
            <input ref={inputRef} type="file" accept=".pdf,.docx" style={{ display:"none" }}
              onChange={(e)=>{if(e.target.files[0])handleFile(e.target.files[0]);}} />
          </div>

          {uploadErr && <p style={{ marginTop:10,fontSize:12,color:"#f87171",textAlign:"center" }}>{uploadErr}</p>}
          {localFile && !loading && (
            <button onClick={parseResume} style={{ marginTop:12,width:"100%",padding:"14px",borderRadius:12,fontWeight:600,fontSize:13,color:"#fff",background:"linear-gradient(135deg,#2dd4bf,#818cf8)",border:"none",cursor:"pointer",letterSpacing:"0.04em" }}>
              ✦ Parse Resume
            </button>
          )}
          <div style={{ marginTop:20,display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center" }}>
            {["ATS Score","Skill Gap","Role Match","Keywords","Format Review"].map((f,i)=>(
              <span key={i} style={{ fontSize:11,padding:"4px 12px",borderRadius:20,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.3)" }}>{f}</span>
            ))}
          </div>
          <p style={{ marginTop:16,textAlign:"center",fontSize:11,color:"rgba(255,255,255,0.15)" }}>🔒 Your resume is never stored or shared</p>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════
  // PARSED VIEW
  // ════════════════════════════════════════════════════════════════════
  if (effectiveStep === "parsed" || effectiveStep === "analyzing") {
    const loading = effectiveStep === "analyzing";
    const p = parsed || {};
    return (
      <div style={{ minHeight:"100vh", background:"#0d0f14", padding:"4rem 1rem",
        position:"relative", overflow:"hidden" }}>
        <Blobs />
        <div style={{ position:"relative", zIndex:10, width:"100%", maxWidth:680, margin:"0 auto" }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.5rem" }}>
            <div>
              <p style={{ fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(255,255,255,0.3)",margin:"0 0 4px" }}>Step 1 complete</p>
              <h1 style={{ fontSize:22,fontWeight:700,color:"#fff",margin:0 }}>
                Resume <span style={{ background:"linear-gradient(135deg,#2dd4bf,#818cf8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>Parsed</span>
              </h1>
            </div>
            <button onClick={reset} style={{ fontSize:11,color:"rgba(255,255,255,0.25)",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:8,padding:"6px 14px",cursor:"pointer" }}>↩ Start over</button>
          </div>

          <div style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:18,padding:"1.5rem",marginBottom:"1.25rem" }}>
            <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:"1.25rem" }}>
              <div style={{ width:48,height:48,borderRadius:"50%",background:"linear-gradient(135deg,rgba(45,212,191,0.3),rgba(129,140,248,0.3))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:700,color:"#fff",flexShrink:0 }}>
                {(p.fullName||"?")[0].toUpperCase()}
              </div>
              <div>
                <p style={{ fontWeight:600,fontSize:16,margin:0,color:"#fff" }}>{p.fullName||"—"}</p>
                <p style={{ fontSize:12,color:"rgba(255,255,255,0.35)",margin:0 }}>
                  {p.degree} {p.branch?`· ${p.branch}`:""} {p.college?`· ${p.college}`:""}
                </p>
              </div>
            </div>

            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:"1.25rem" }}>
              {[["Target role",p.targetRole],["Experience",p.experience],["CGPA",p.cgpa],["Degree",`${p.degree||""} ${p.branch||""}`]].map(([l,v],i)=>(
                <div key={i} style={{ background:"rgba(255,255,255,0.025)",borderRadius:10,padding:"10px 14px" }}>
                  <p style={{ fontSize:10,color:"rgba(255,255,255,0.3)",margin:"0 0 3px",textTransform:"uppercase",letterSpacing:"0.08em" }}>{l}</p>
                  <p style={{ fontSize:13,color:"rgba(255,255,255,0.75)",margin:0,fontWeight:500 }}>{v||"—"}</p>
                </div>
              ))}
            </div>

            {p.skills?.length>0&&(
              <div style={{ marginBottom:"1rem" }}>
                <p style={{ fontSize:11,color:"rgba(255,255,255,0.3)",margin:"0 0 8px",textTransform:"uppercase",letterSpacing:"0.08em" }}>Skills detected</p>
                <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
                  {p.skills.map((s,i)=><Tag key={i} label={s} type="present" />)}
                </div>
              </div>
            )}
            {p.interests?.length>0&&(
              <div>
                <p style={{ fontSize:11,color:"rgba(255,255,255,0.3)",margin:"0 0 8px",textTransform:"uppercase",letterSpacing:"0.08em" }}>Interests</p>
                <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
                  {p.interests.map((s,i)=><Tag key={i} label={s} />)}
                </div>
              </div>
            )}
          </div>

          {atsErr&&<p style={{ fontSize:12,color:"#f87171",marginBottom:10,textAlign:"center" }}>{atsErr}</p>}

          {loading ? (
            <div style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"1.5rem",textAlign:"center" }}>
              <p style={{ color:"#fff",fontWeight:600,fontSize:14,margin:"0 0 6px" }}>Running ATS analysis…</p>
              <p style={{ color:"rgba(255,255,255,0.3)",fontSize:12,margin:"0 0 16px" }}>Scoring keywords, format, role match & skill gaps</p>
              <div style={{ width:"100%",height:3,borderRadius:99,background:"rgba(255,255,255,0.06)",overflow:"hidden" }}>
                <div style={{ height:"100%",borderRadius:99,background:"linear-gradient(90deg,#2dd4bf,#818cf8)",animation:"slide 1.4s ease-in-out infinite" }} />
              </div>
              <style>{`@keyframes slide{0%{width:0%;margin-left:0}50%{width:55%;margin-left:22%}100%{width:0%;margin-left:100%}}`}</style>
            </div>
          ) : (
            <button onClick={analyzeAts} style={{ width:"100%",padding:"15px",borderRadius:12,fontWeight:600,fontSize:14,color:"#fff",background:"linear-gradient(135deg,#2dd4bf,#818cf8)",border:"none",cursor:"pointer",letterSpacing:"0.04em" }}>
              ✦ Analyze ATS Score
            </button>
          )}
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════
  // RESULTS VIEW
  // ════════════════════════════════════════════════════════════════════
  if (effectiveStep === "results" && ats) {
    const a = ats;
    return (
      <div style={{ minHeight:"100vh", background:"#0d0f14", padding:"4rem 1rem 5rem",
        position:"relative", overflow:"hidden" }}>
        <Blobs />
        <div style={{ position:"relative", zIndex:10, width:"100%", maxWidth:1020, margin:"0 auto" }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.75rem" }}>
            <div>
              <p style={{ fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(255,255,255,0.3)",margin:"0 0 4px" }}>Analysis complete</p>
              <h1 style={{ fontSize:22,fontWeight:700,color:"#fff",margin:0 }}>
                ATS <span style={{ background:"linear-gradient(135deg,#2dd4bf,#818cf8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>Report</span>
              </h1>
            </div>
            <button onClick={reset} style={{ fontSize:11,color:"rgba(255,255,255,0.25)",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:8,padding:"6px 14px",cursor:"pointer" }}>↩ New resume</button>
          </div>

          {/* Hero score */}
          <div style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:18,padding:"1.5rem 2rem",marginBottom:"1.25rem",display:"flex",alignItems:"center",gap:28,flexWrap:"wrap" }}>
            <div style={{ position:"relative",width:80,height:80,flexShrink:0 }}>
              <ScoreRing score={a.atsScore||0} color={a.atsScore>=75?"#2dd4bf":a.atsScore>=50?"#fbbf24":"#f87171"} />
              <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column" }}>
                <span style={{ fontSize:20,fontWeight:700,color:"#fff",lineHeight:1 }}>{a.atsScore}</span>
                <span style={{ fontSize:9,color:"rgba(255,255,255,0.35)" }}>/ 100</span>
              </div>
            </div>
            <div style={{ flex:1,minWidth:180 }}>
              <p style={{ fontSize:18,fontWeight:600,color:"#fff",margin:"0 0 4px" }}>
                {a.atsScore>=80?"Strong resume 🎯":a.atsScore>=60?"Good — needs polish ✨":"Needs improvement 🔧"}
              </p>
              <p style={{ fontSize:13,color:"rgba(255,255,255,0.35)",margin:0,lineHeight:1.6 }}>{a.overallSummary||"AI analysis complete."}</p>
            </div>
          </div>

          {/* 4 metrics */}
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))",gap:10,marginBottom:"1.25rem" }}>
            <MetricCard label="Role Match" value={`${a.roleMatch?.score??"—"}%`} sub={parsed?.targetRole||""} color={a.roleMatch?.score>=70?"#2dd4bf":"#fbbf24"} />
            <MetricCard label="Keywords"   value={`${a.keywords?.matched??0}/${a.keywords?.total??0}`} sub="matched" color="#818cf8" />
            <MetricCard label="Format"     value={a.formatReview?.overall||"—"} sub={a.formatReview?.score!=null?`${a.formatReview.score}/100`:""} color={a.formatReview?.overall==="Good"||a.formatReview?.overall==="Excellent"?"#2dd4bf":"#fbbf24"} />
            <MetricCard label="Skills"     value={`${a.skillGap?.present?.length??0} found`} sub={`${a.skillGap?.missing?.length??0} missing`} color="#f472b6" />
          </div>

          {/* Skill gap */}
          <div style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:18,padding:"1.25rem 1.5rem",marginBottom:"1.25rem" }}>
            <p style={{ fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.6)",margin:"0 0 12px",textTransform:"uppercase",letterSpacing:"0.08em" }}>Skill gap analysis</p>
            {a.skillGap?.present?.length>0&&(<div style={{ marginBottom:10 }}><p style={{ fontSize:11,color:"rgba(255,255,255,0.3)",margin:"0 0 7px" }}>Present ✓</p><div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>{a.skillGap.present.map((s,i)=><Tag key={i} label={s} type="present" />)}</div></div>)}
            {a.skillGap?.missing?.length>0&&(<div style={{ marginBottom:10 }}><p style={{ fontSize:11,color:"rgba(255,255,255,0.3)",margin:"0 0 7px" }}>Missing — add these</p><div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>{a.skillGap.missing.map((s,i)=><Tag key={i} label={s} type="missing" />)}</div></div>)}
            {a.skillGap?.partial?.length>0&&(<div><p style={{ fontSize:11,color:"rgba(255,255,255,0.3)",margin:"0 0 7px" }}>Partial / needs depth</p><div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>{a.skillGap.partial.map((s,i)=><Tag key={i} label={s} type="partial" />)}</div></div>)}
          </div>

          {/* Format + Keywords */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.25rem",marginBottom:"1.25rem" }}>
            <div style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:18,padding:"1.25rem 1.5rem" }}>
              <p style={{ fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.6)",margin:"0 0 12px",textTransform:"uppercase",letterSpacing:"0.08em" }}>Format review</p>
              <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                {(a.formatReview?.checks||[]).map((c,i)=>(
                  <div key={i} style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                    <span style={{ fontSize:12,color:"rgba(255,255,255,0.45)" }}>{c.label}</span>
                    <span style={{ fontSize:11,fontWeight:500,color:c.status==="pass"?"#2dd4bf":c.status==="fail"?"#f87171":"#fbbf24" }}>
                      {c.status==="pass"?"Pass":c.status==="fail"?"Fail":"Partial"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:18,padding:"1.25rem 1.5rem" }}>
              <p style={{ fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.6)",margin:"0 0 12px",textTransform:"uppercase",letterSpacing:"0.08em" }}>Keyword check</p>
              {a.keywords?.found?.length>0&&(<div style={{ marginBottom:8 }}><p style={{ fontSize:11,color:"rgba(255,255,255,0.3)",margin:"0 0 6px" }}>Found</p><div style={{ display:"flex",flexWrap:"wrap",gap:5 }}>{a.keywords.found.slice(0,8).map((k,i)=><Tag key={i} label={k} type="present" />)}</div></div>)}
              {a.keywords?.notFound?.length>0&&(<div><p style={{ fontSize:11,color:"rgba(255,255,255,0.3)",margin:"0 0 6px" }}>Missing keywords</p><div style={{ display:"flex",flexWrap:"wrap",gap:5 }}>{a.keywords.notFound.slice(0,6).map((k,i)=><Tag key={i} label={k} type="missing" />)}</div></div>)}
            </div>
          </div>

          {/* Suggestions */}
          {a.suggestions?.length>0&&(
            <div style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:18,padding:"1.25rem 1.5rem" }}>
              <p style={{ fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.6)",margin:"0 0 12px",textTransform:"uppercase",letterSpacing:"0.08em" }}>Top suggestions</p>
              <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                {a.suggestions.map((s,i)=>(
                  <div key={i} style={{ display:"flex",gap:12,alignItems:"flex-start" }}>
                    <div style={{ width:3,flexShrink:0,alignSelf:"stretch",borderRadius:99,background:s.priority==="high"?"#f87171":s.priority==="medium"?"#fbbf24":"#818cf8",minHeight:36 }} />
                    <div>
                      <p style={{ fontSize:12,color:"rgba(255,255,255,0.65)",margin:"0 0 2px",lineHeight:1.55 }}>{s.text}</p>
                      {s.priority&&<span style={{ fontSize:10,color:s.priority==="high"?"#f87171":s.priority==="medium"?"#fbbf24":"#818cf8",textTransform:"uppercase",letterSpacing:"0.08em" }}>{s.priority} priority</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p style={{ marginTop:20,textAlign:"center",fontSize:11,color:"rgba(255,255,255,0.2)" }}>✅ Results saved to your profile</p>
        </div>
      </div>
    );
  }

  return null;
}