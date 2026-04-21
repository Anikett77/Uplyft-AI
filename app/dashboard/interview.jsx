"use client";
import { useState, useRef, useEffect } from "react";
import { useResumeState } from "@/hooks/useResumeState";

const TYPES = [
  { icon:"🧠", name:"Behavioral",  desc:"Leadership, teamwork & conflict resolution" },
  { icon:"💻", name:"Technical",   desc:"Coding, systems design & problem solving"   },
  { icon:"🎯", name:"Case Study",  desc:"Business strategy & analytical thinking"    },
];

const TOTAL_QUESTIONS = 7;

// ── Score color helper ────────────────────────────────────────────────────
const scoreColor = (s) =>
  s >= 8 ? "text-emerald-400" : s >= 6 ? "text-amber-400" : "text-rose-400";
const scoreBg = (s) =>
  s >= 8 ? "bg-emerald-500/15 border-emerald-500/30" : s >= 6 ? "bg-amber-500/15 border-amber-500/30" : "bg-rose-500/15 border-rose-500/30";

const Orbs = () => (
  <>
    <div className="absolute -top-40 -right-32 w-96 h-96 bg-amber-500 rounded-full opacity-20 blur-3xl pointer-events-none" />
    <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-blue-600 rounded-full opacity-20 blur-3xl pointer-events-none" />
    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-violet-600 rounded-full opacity-10 blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
  </>
);

export default function Interview() {
  const { parsed } = useResumeState();

  // ── Session state ──
  const [selected,        setSelected]        = useState(0);
  const [phase,           setPhase]           = useState("setup");     // setup | loading | question | feedback | report
  const [history,         setHistory]         = useState([]);          // [{question, answer, feedback}]
  const [currentQ,        setCurrentQ]        = useState("");
  const [questionNum,     setQuestionNum]      = useState(0);
  const [answer,          setAnswer]          = useState("");
  const [feedback,        setFeedback]        = useState(null);
  const [report,          setReport]          = useState(null);
  const [error,           setError]           = useState("");
  const [timeLeft,        setTimeLeft]        = useState(120);         // 2 min per question
  const [timerActive,     setTimerActive]     = useState(false);
  const timerRef = useRef(null);
  const textareaRef = useRef(null);

  // ── Timer ──
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      clearInterval(timerRef.current);
      if (phase === "question") submitAnswer();
    }
    return () => clearInterval(timerRef.current);
  }, [timerActive, timeLeft, phase]);

  const resetTimer = () => { setTimeLeft(120); setTimerActive(false); };

  const fmtTime = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;

  // ── API call helper ──
  const api = async (body) => {
    const res  = await fetch("/api/interview", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ ...body, resumeData: parsed }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "API error");
    return json;
  };

  // ── Start session — fetch Q1 ──
  const startSession = async () => {
    setPhase("loading");
    setHistory([]);
    setError("");
    resetTimer();
    try {
      const { question, questionNumber } = await api({
        action: "question",
        type:   TYPES[selected].name,
        history: [],
      });
      setCurrentQ(question);
      setQuestionNum(questionNumber);
      setAnswer("");
      setPhase("question");
      setTimeout(() => { setTimerActive(true); textareaRef.current?.focus(); }, 300);
    } catch(e) {
      setError(e.message);
      setPhase("setup");
    }
  };

  // ── Submit answer → get feedback ──
  const submitAnswer = async () => {
    if (!answer.trim() && timeLeft > 0) return;
    clearInterval(timerRef.current);
    setTimerActive(false);
    setPhase("loading");
    setError("");
    try {
      const { feedback: fb } = await api({
        action:          "feedback",
        type:            TYPES[selected].name,
        currentQuestion: currentQ,
        userAnswer:      answer.trim() || "(No answer given — time ran out)",
      });
      setFeedback(fb);
      setPhase("feedback");
    } catch(e) {
      setError(e.message);
      setPhase("question");
    }
  };

  // ── Next question or end session ──
  const nextQuestion = async () => {
    const newHistory = [...history, { question: currentQ, answer, feedback }];
    setHistory(newHistory);

    if (newHistory.length >= TOTAL_QUESTIONS) {
      // Generate final report
      setPhase("loading");
      try {
        const { report: r } = await api({
          action:  "report",
          type:    TYPES[selected].name,
          history: newHistory,
        });
        setReport(r);
        setPhase("report");
      } catch(e) {
        setError(e.message);
        setPhase("feedback");
      }
      return;
    }

    setPhase("loading");
    resetTimer();
    setFeedback(null);
    try {
      const { question, questionNumber } = await api({
        action:  "question",
        type:    TYPES[selected].name,
        history: newHistory,
      });
      setCurrentQ(question);
      setQuestionNum(questionNumber);
      setAnswer("");
      setPhase("question");
      setTimeout(() => { setTimerActive(true); textareaRef.current?.focus(); }, 300);
    } catch(e) {
      setError(e.message);
      setPhase("feedback");
    }
  };

  const endSession = () => {
    clearInterval(timerRef.current);
    setPhase("setup");
    setHistory([]);
    setCurrentQ("");
    setAnswer("");
    setFeedback(null);
    setReport(null);
    setError("");
    resetTimer();
  };

  const avgScore = history.length > 0
    ? Math.round(history.reduce((s, h) => s + (h.feedback?.score || 0), 0) / history.length)
    : 0;

  // ════════════════════════════════════════════════════════════════════
  // LOADING
  // ════════════════════════════════════════════════════════════════════
  if (phase === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <Orbs />
        <div className="relative z-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl mx-auto mb-4 animate-pulse">🤖</div>
          <p className="text-white/60 text-sm font-medium">AI is thinking…</p>
          <p className="text-white/25 text-xs mt-1">Powered by GPT-4o mini</p>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════
  // REPORT
  // ════════════════════════════════════════════════════════════════════
  if (phase === "report" && report) {
    return (
      <div className="min-h-screen flex justify-center relative overflow-hidden py-10 px-4">
        <Orbs />
        <div className="relative z-10 w-full max-w-2xl border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-[1px]">
          <div className="text-center mb-8">
            <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Session Complete</p>
            <h1 className="text-3xl font-bold text-white mb-1">Interview <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent italic">Report</span></h1>
            <p className="text-white/30 text-sm">{TYPES[selected].name} · {TOTAL_QUESTIONS} questions</p>
          </div>

          {/* Score hero */}
          <div className={`rounded-2xl border p-6 mb-5 text-center ${scoreBg(report.overallScore)}`}>
            <p className={`text-6xl font-black mb-1 ${scoreColor(report.overallScore)}`}>{report.overallScore}<span className="text-2xl">/10</span></p>
            <p className="text-white font-semibold text-lg">{report.overallLabel}</p>
            <p className="text-white/40 text-sm mt-2 leading-relaxed">{report.summary}</p>
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
              <span className="text-xs text-white/40">Readiness:</span>
              <span className={`text-xs font-semibold ${scoreColor(report.overallScore)}`}>{report.readiness}</span>
            </div>
          </div>

          {/* Strengths + Improvements */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
              <p className="text-[11px] text-emerald-400 uppercase tracking-widest font-semibold mb-3">Top Strengths</p>
              <div className="space-y-2">
                {(report.topStrengths || []).map((s,i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <span className="text-emerald-400 text-xs mt-0.5 flex-shrink-0">✓</span>
                    <p className="text-white/55 text-xs leading-relaxed">{s}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
              <p className="text-[11px] text-amber-400 uppercase tracking-widest font-semibold mb-3">Key Improvements</p>
              <div className="space-y-2">
                {(report.keyImprovements || []).map((s,i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <span className="text-amber-400 text-xs mt-0.5 flex-shrink-0">→</span>
                    <p className="text-white/55 text-xs leading-relaxed">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Next steps */}
          {report.nextSteps && (
            <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4 mb-5">
              <p className="text-[11px] text-violet-400 uppercase tracking-widest font-semibold mb-2">Next Steps</p>
              <p className="text-white/50 text-sm leading-relaxed">{report.nextSteps}</p>
            </div>
          )}

          {/* Per-question scores */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 mb-5">
            <p className="text-[11px] text-white/35 uppercase tracking-widest font-semibold mb-3">Question Breakdown</p>
            <div className="space-y-2">
              {history.map((h,i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-[10px] text-white/25 w-4 flex-shrink-0">Q{i+1}</span>
                  <p className="text-xs text-white/45 flex-1 truncate">{h.question}</p>
                  <span className={`text-xs font-bold flex-shrink-0 ${scoreColor(h.feedback?.score || 0)}`}>{h.feedback?.score || "—"}/10</span>
                </div>
              ))}
            </div>
          </div>

          <button onClick={endSession} className="w-full py-4 rounded-2xl font-medium text-sm text-gray-900 bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30 hover:-translate-y-0.5 transition-all">
            ↩ Practice Again
          </button>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════
  // FEEDBACK VIEW
  // ════════════════════════════════════════════════════════════════════
  if (phase === "feedback" && feedback) {
    return (
      <div className="min-h-screen flex justify-center relative overflow-hidden py-10 px-4">
        <Orbs />
        <div className="relative z-10 w-full max-w-2xl border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-[1px]">

          {/* Progress */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-[10px] text-white/25 uppercase tracking-widest">Question {questionNum} / {TOTAL_QUESTIONS}</p>
            <div className="flex gap-1">
              {Array.from({ length: TOTAL_QUESTIONS }).map((_,i) => (
                <div key={i} className={`h-1 rounded-full transition-all ${i < questionNum ? "w-6 bg-amber-400" : "w-3 bg-white/10"}`} />
              ))}
            </div>
          </div>

          {/* Score badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-5 ${scoreBg(feedback.score)}`}>
            <span className={`text-2xl font-black ${scoreColor(feedback.score)}`}>{feedback.score}</span>
            <span className="text-white/30 text-sm">/10</span>
            <span className={`text-sm font-semibold ${scoreColor(feedback.score)}`}>{feedback.scoreLabel}</span>
          </div>

          {/* Question recap */}
          <div className="rounded-xl bg-white/[0.03] border border-white/8 p-4 mb-4">
            <p className="text-[10px] text-white/25 uppercase tracking-widest mb-1">Question</p>
            <p className="text-white/70 text-sm leading-relaxed">{currentQ}</p>
          </div>

          {/* Your answer */}
          <div className="rounded-xl bg-white/[0.02] border border-white/6 p-4 mb-4">
            <p className="text-[10px] text-white/25 uppercase tracking-widest mb-1">Your Answer</p>
            <p className="text-white/50 text-sm leading-relaxed italic">{answer || "(No answer given)"}</p>
          </div>

          {/* Strengths + improvements */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
              <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-semibold mb-2">Strengths</p>
              {(feedback.strengths || []).map((s,i) => (
                <div key={i} className="flex gap-1.5 items-start mb-1.5">
                  <span className="text-emerald-400 text-xs mt-0.5">✓</span>
                  <p className="text-white/55 text-xs leading-relaxed">{s}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3">
              <p className="text-[10px] text-rose-400 uppercase tracking-widest font-semibold mb-2">Improve</p>
              {(feedback.improvements || []).map((s,i) => (
                <div key={i} className="flex gap-1.5 items-start mb-1.5">
                  <span className="text-rose-400 text-xs mt-0.5">↑</span>
                  <p className="text-white/55 text-xs leading-relaxed">{s}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Model answer */}
          {feedback.betterAnswer && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 mb-4">
              <p className="text-[10px] text-amber-400 uppercase tracking-widest font-semibold mb-2">💡 Stronger Answer</p>
              <p className="text-white/55 text-sm leading-relaxed">{feedback.betterAnswer}</p>
            </div>
          )}

          {/* Tip */}
          {feedback.tip && (
            <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-3 mb-5">
              <p className="text-white/45 text-xs leading-relaxed">🎯 <span className="text-violet-400 font-medium">Tip:</span> {feedback.tip}</p>
            </div>
          )}

          {error && <p className="text-rose-400 text-xs mb-3">{error}</p>}

          <div className="flex gap-3">
            <button onClick={endSession} className="flex-1 py-3 rounded-xl font-medium text-sm text-white/40 border border-white/10 hover:border-white/20 transition-all">
              End Session
            </button>
            <button onClick={nextQuestion} className="flex-[2] py-3 rounded-xl font-medium text-sm text-gray-900 bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20 hover:-translate-y-0.5 transition-all">
              {history.length + 1 >= TOTAL_QUESTIONS ? "View Report →" : `Next Question (${history.length + 1}/${TOTAL_QUESTIONS}) →`}
            </button>
          </div>
        </div>
      </div>
    );
  }

// ─────────────────────────────────────────────────────────────
// MCQ PARSER
// ─────────────────────────────────────────────────────────────
const parseMCQ = (text) => {
  if (!text) return null;

  const lines = text.split("\n").map(l => l.trim());

  const question = lines.find(l => l.startsWith("Question:"))
    ?.replace("Question:", "")
    .trim();

  const options = lines
    .filter(l => /^[A-D]\./.test(l))
    .map(l => ({
      key: l[0],
      text: l.slice(2).trim()
    }));

  const correct = lines.find(l => l.startsWith("Correct Answer:"))
    ?.split(":")[1]
    ?.trim();

  const explanation = lines.find(l => l.startsWith("Explanation:"))
    ?.replace("Explanation:", "")
    ?.trim();

  return { question, options, correct, explanation };
};

// ─────────────────────────────────────────────────────────────
// QUESTION VIEW
// ─────────────────────────────────────────────────────────────
if (phase === "question") {
  const timerPct = (timeLeft / 120) * 100;

  const mcq = parseMCQ(currentQ);

  return (
    <div className="min-h-screen flex justify-center relative overflow-hidden py-10 px-4">
      <Orbs />

      <div className="relative z-10 w-full max-w-2xl border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-[1px]">

        {/* Progress + Timer */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-1 items-center">
            {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all 
                ${i < questionNum - 1
                    ? "w-6 bg-amber-400"
                    : i === questionNum - 1
                    ? "w-6 bg-amber-400/60"
                    : "w-3 bg-white/10"
                  }`}
              />
            ))}
          </div>

          <div className={`flex items-center gap-2 text-sm font-mono font-semibold 
            ${timeLeft <= 30 ? "text-rose-400" : "text-white/40"}`}>
            
            <div className="relative w-6 h-6">
              <svg className="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="2"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  stroke={timeLeft <= 30 ? "#f87171" : "#fbbf24"}
                  strokeWidth="2"
                  strokeDasharray={`${(timerPct / 100) * 62.8} 62.8`}
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {fmtTime(timeLeft)}
          </div>
        </div>

        {/* Type + question number */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">{TYPES[selected].icon}</span>
          <span className="text-[11px] text-white/25 uppercase tracking-widest">
            {TYPES[selected].name} · Question {questionNum}
          </span>

          {parsed?.targetRole && (
            <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full 
              bg-amber-500/10 border border-amber-500/20 text-amber-400/70">
              {parsed.targetRole}
            </span>
          )}
        </div>

        {/* Question */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 mb-5">
          <p className="text-white text-base leading-relaxed font-medium">
            {mcq?.question || "Loading question..."}
          </p>
        </div>

        {/* MCQ Options */}
        <div className="mb-5">
          <label className="text-[10px] text-white/25 uppercase tracking-widest block mb-3">
            Choose your answer
          </label>

          <div className="space-y-3">
            {mcq?.options.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setAnswer(opt.key)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all
                ${
                  answer === opt.key
                    ? "border-amber-400 bg-amber-500/10 text-white"
                    : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20"
                }`}
              >
                <span className="font-semibold mr-2">{opt.key}.</span>
                {opt.text}
              </button>
            ))}
          </div>

          <p className="text-[10px] text-white/20 mt-2">
            Selected: {answer || "None"}
          </p>
        </div>

        {/* Running score */}
        {history.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <p className="text-[10px] text-white/25">Session avg:</p>
            <span className={`text-[11px] font-bold ${scoreColor(avgScore)}`}>
              {avgScore}/10
            </span>

            <div className="flex gap-1 ml-1">
              {history.map((h, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full 
                  ${
                    h.feedback?.score >= 8
                      ? "bg-emerald-400"
                      : h.feedback?.score >= 6
                      ? "bg-amber-400"
                      : "bg-rose-400"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {error && (
          <p className="text-rose-400 text-xs mb-3">{error}</p>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={endSession}
            className="px-4 py-3 rounded-xl font-medium text-sm text-white/35 border border-white/10 hover:border-white/20 transition-all"
          >
            End
          </button>

          <button
            onClick={submitAnswer}
            disabled={!answer}
            className="flex-1 py-3 rounded-xl font-medium text-sm text-gray-900 
            bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20 
            hover:-translate-y-0.5 active:translate-y-0 transition-all 
            disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Submit Answer →
          </button>
        </div>
      </div>
    </div>
  );
}

  // ════════════════════════════════════════════════════════════════════
  // SETUP VIEW
  // ════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen flex justify-center relative overflow-hidden">
      <Orbs />
      <div className="relative z-10 w-full m-10 border border-white/10 backdrop-blur-[1px] rounded-3xl p-10 shadow-2xl max-w-2xl self-start mt-16">

        <h1 className="text-4xl font-bold text-white leading-tight tracking-tight">
          Master Your{" "}
          <span className="italic bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Interview
          </span>
        </h1>
        <p className="mt-3 text-sm text-white/35 font-light">
          Practice with our AI interviewer and get instant, detailed feedback on every answer.
        </p>

        {/* Resume context pill */}
        {parsed?.fullName ? (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <p className="text-[11px] text-emerald-400">
              Personalised for <span className="font-semibold">{parsed.fullName}</span>
              {parsed.targetRole && ` · ${parsed.targetRole}`}
            </p>
          </div>
        ) : (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <p className="text-[11px] text-white/30">Generic questions · <a href="/resume" className="text-amber-400/70 underline underline-offset-2">Upload resume</a> for personalised session</p>
          </div>
        )}

        <p className="mt-8 text-xs tracking-widest uppercase text-white/25 font-medium mb-3">Select Interview Type</p>

        <div className="grid grid-cols-3 gap-3">
          {TYPES.map((t, i) => (
            <button key={i} onClick={() => setSelected(i)}
              className={`relative text-left rounded-2xl p-4 border transition-all duration-200
                ${selected === i ? "border-amber-400 bg-amber-400/10 shadow-lg shadow-amber-500/10" : "border-white/10 bg-white/5 hover:border-amber-400/30 hover:bg-amber-400/5"}`}>
              {selected === i && <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" />}
              <div className={`absolute top-3 right-3 w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black text-xs font-bold transition-all duration-200 ${selected === i ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}>✓</div>
              <span className="text-xl mb-2 block">{t.icon}</span>
              <p className="text-sm font-semibold text-white mb-1">{t.name}</p>
              <p className="text-xs text-white/30 font-light leading-snug">{t.desc}</p>
            </button>
          ))}
        </div>

        {/* Session info */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          {[
            { label:"Questions", value:`${TOTAL_QUESTIONS} total`  },
            { label:"Time/Q",    value:"2 minutes"                 },
            { label:"Feedback",  value:"Instant AI"                },
          ].map((s,i) => (
            <div key={i} className="rounded-xl bg-white/[0.025] border border-white/7 p-3 text-center">
              <p className="text-white font-semibold text-sm">{s.value}</p>
              <p className="text-white/25 text-[10px] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="my-7 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {error && <p className="text-rose-400 text-sm mb-3 text-center">{error}</p>}

        <button onClick={startSession}
          className="w-full py-4 rounded-2xl font-medium text-sm tracking-wide text-gray-900 bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150">
          ▶ Start {TYPES[selected].name} Interview
        </button>

        <p className="text-center text-xs text-white/25 mt-4">
          {TOTAL_QUESTIONS} questions · ~{TOTAL_QUESTIONS * 2} min · Powered by GPT-4o mini
        </p>
      </div>
    </div>
  );
}