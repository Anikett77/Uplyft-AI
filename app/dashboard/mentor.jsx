"use client";
import { useState, useEffect } from "react";
import { useRef } from "react";



const SUGGESTED = [
  "How can I transition to a senior role?",
  "What skills should I learn next?",
  "How do I negotiate my salary?",
  "Prepare me for system design interview",
];

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function Mentor() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your AI Career Mentor. I'm here to help you with career guidance, interview preparation, skill development, and any career-related questions you might have.\n\nHow can I assist you today?",
      time: formatTime(new Date()),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggested, setShowSuggested] = useState(true);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");
    setShowSuggested(false);

    const userMsg = { role: "user", content: userText, time: formatTime(new Date()) };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setLoading(true);

    try {
      const apiMessages = updated.map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are an expert AI Career Mentor. Give concise, actionable, and encouraging career advice. Format responses clearly with short paragraphs. Never use excessive markdown — keep it conversational and warm.",
          messages: apiMessages,
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Sorry, I couldn't get a response. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply, time: formatTime(new Date()) }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong. Please try again.", time: formatTime(new Date()) }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0f14] relative overflow-hidden px-4 py-16">

      {/* Mood glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-600 rounded-full opacity-20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-sky-600 rounded-full opacity-20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-700 rounded-full opacity-20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-600 rounded-full opacity-[0.18] blur-3xl pointer-events-none" />

      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      <div className="relative z-10 w-full max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] tracking-widest uppercase text-white/30 font-medium mb-3">
            ✦ AI Powered Mentorship
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            🤖AI Mentor{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-emerald-400">
              Chat
            </span>
          </h1>
          <p className="text-white/30 mt-1 text-[13px] font-light">Get personalized career guidance from your AI mentor</p>
        </div>

        {/* Chat Container */}
        <div className="w-full bg-[#0b0d12] border border-white/[0.08] rounded-2xl p-5 flex flex-col gap-4">

          {/* Messages */}
          <div className="flex flex-col gap-4 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 items-start ${msg.role === "user" ? "flex-row-reverse" : ""}`}>

                {/* Avatar */}
                {msg.role === "assistant" ? (
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0" style={{ background: "linear-gradient(135deg, #38bdf8, #a78bfa)" }}>
                    🤖
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0" style={{ background: "linear-gradient(135deg, #f43f5e, #fb923c)" }}>
                    👤
                  </div>
                )}

                {/* Bubble */}
                <div className={`max-w-[75%] text-white text-sm p-4 leading-relaxed whitespace-pre-wrap
                  ${msg.role === "assistant"
                    ? "bg-white/5 border border-white/8 rounded-2xl rounded-tl-sm"
                    : "rounded-2xl rounded-tr-sm border"
                  }`}
                  style={msg.role === "user" ? { background: "linear-gradient(135deg, rgba(244,63,94,0.15), rgba(56,189,248,0.10))", borderColor: "rgba(244,63,94,0.25)" } : {}}
                >
                  {msg.content}
                  <p className="text-white/20 text-[10px] mt-2">{msg.time}</p>
                </div>
              </div>
            ))}

            {/* Loading dots */}
            {loading && (
              <div className="flex gap-3 items-start">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0" style={{ background: "linear-gradient(135deg, #38bdf8, #a78bfa)" }}>🤖</div>
                <div className="bg-white/5 border border-white/8 rounded-2xl rounded-tl-sm px-5 py-4 flex gap-1.5 items-center">
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggested Questions */}
          {showSuggested && (
            <div className="border-t border-b border-white/[0.08] py-4">
              <p className="text-white/30 text-[10px] uppercase tracking-widest mb-3">Suggested questions</p>
              <div className="grid grid-cols-2 gap-2">
                {SUGGESTED.map((q, i) => {
                  const colors = [
                    "hover:border-rose-400/40 hover:bg-rose-400/5 hover:text-rose-300/70",
                    "hover:border-sky-400/40 hover:bg-sky-400/5 hover:text-sky-300/70",
                    "hover:border-violet-400/40 hover:bg-violet-400/5 hover:text-violet-300/70",
                    "hover:border-emerald-400/40 hover:bg-emerald-400/5 hover:text-emerald-300/70",
                  ];
                  return (
                    <div
                      key={i}
                      onClick={() => send(q)}
                      className={`border border-white/10 bg-white/[0.03] ${colors[i]} rounded-full text-sm text-white/40 p-2 px-4 flex gap-2 cursor-pointer transition-all duration-200`}
                    >
                      <span className="opacity-60">✦</span> {q}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="flex gap-3 items-center">
            <input
              className="flex-1 bg-white/5 border border-white/10 focus:border-sky-400/40 outline-none text-white text-sm placeholder-white/20 p-3.5 rounded-xl transition-all"
              type="text"
              placeholder="Ask your AI mentor anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              disabled={loading}
            />
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-base hover:shadow-lg hover:shadow-sky-500/20 hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              style={{ background: "linear-gradient(135deg, #f43f5e, #38bdf8, #a78bfa)" }}
            >
              ➤
            </button>
          </div>

          {/* Feature chips */}
          <div className="flex flex-wrap gap-2 justify-center pt-1">
            {[
              { label: "Career Growth", color: "border-rose-500/30 text-rose-400/60 bg-rose-500/5" },
              { label: "Interview Prep", color: "border-sky-500/30 text-sky-400/60 bg-sky-500/5" },
              { label: "Skill Building", color: "border-violet-500/30 text-violet-400/60 bg-violet-500/5" },
              { label: "Salary Tips", color: "border-emerald-500/30 text-emerald-400/60 bg-emerald-500/5" },
            ].map((c, i) => (
              <span key={i} className={`text-[11px] px-3 py-1 rounded-full border font-light ${c.color}`}>{c.label}</span>
            ))}
          </div>

          <p className="text-center text-white/15 text-[11px]">AI responses are for guidance only. Always verify important career decisions.</p>
        </div>
      </div>
    </div>
  );
}